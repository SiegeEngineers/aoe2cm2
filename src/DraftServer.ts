import express from "express";
import {Server} from "http"
import socketio from "socket.io";
import Player from "./constants/Player";
import {IDraftConfig} from "./types/IDraftConfig";
import {ISetRoleMessage} from "./types/ISetRoleMessage";
import {DraftsStore} from "./models/DraftsStore";
import {Validator} from "./models/Validator";
import {ValidationId} from "./constants/ValidationId";
import {DraftEvent} from "./types/DraftEvent";
import {Util} from "./util/Util";
import {AddressInfo} from "net";
import Preset from "./models/Preset";
import {Listeners} from "./util/Listeners";
import * as fs from "fs";
import {logger} from "./util/Logger";
import {ISetNameMessage} from "./types/ISetNameMessage";
import {PresetUtil} from "./util/PresetUtil";

const ONE_HOUR = 1000 * 60 * 60;

export const DraftServer = {
    serve(port: string | number | undefined): { httpServerAddr: AddressInfo | string | null; io: SocketIO.Server; httpServer: Server } {
        logger.info("Starting DraftServer on port %d", port);
        const app = express();
        app.set("port", port);
        app.use(express.json());

        const server = new Server(app);
        const io = socketio(server, {cookie: false});
        const draftsStore = new DraftsStore();
        const validator = new Validator(draftsStore);

        function connectPlayer(draftId: string, player: Player, name: string) {
            draftsStore.connectPlayer(draftId, player, name);
        }

        function setPlayerName(draftId: string, player: Player, name: string) {
            draftsStore.setPlayerName(draftId, player, name);
        }

        app.post('/api/draft/new', (req, res) => {
            logger.info('Received request to create a new draft: %s', JSON.stringify(req.body));
            let draftId = Util.newDraftId();
            while (draftsStore.has(draftId)) {
                draftId += Util.randomChar();
            }
            const pojo: Preset = req.body.preset as Preset;
            let preset = Preset.fromPojo(pojo);
            const validationErrors = Validator.validatePreset(preset);
            if (validationErrors.length === 0) {
                draftsStore.initDraft(draftId, preset as Preset);
                res.json({status: 'ok', draftId});
                logger.info('Created new draft with id: %s', draftId, {draftId});
            } else {
                res.json({status: 'error', validationErrors});
                logger.info('Draft validation failed: %s', JSON.stringify(validationErrors));
            }
        });
        app.post('/api/preset/new', (req, res) => {
            logger.info('Received request to create a new preset: %s', JSON.stringify(req.body));
            const pojo: Preset = req.body.preset as Preset;
            let preset = Preset.fromPojo(pojo);
            const validationErrors = Validator.validatePreset(preset);
            if (validationErrors.length === 0) {
                const presetId = PresetUtil.createPreset(preset as Preset);
                res.json({status: 'ok', presetId: presetId});
                logger.info('Created new preset with id: %s', presetId, {presetId});
            } else {
                res.json({status: 'error', validationErrors});
                logger.info('Preset validation failed: %s', JSON.stringify(validationErrors));
            }
        });
        app.get('/api/connections', (req, res) => {
            // @ts-ignore
            res.json({connections: io.engine.clientsCount});
        });
        app.get('/api/alerts', (req, res) => {
            res.sendFile('alerts.json', {'root': __dirname + '/..'});
        });
        app.get('/api/preset/list', (req, res) => {
            res.sendFile('presets.json', {'root': __dirname + '/..'});
        });
        app.get('/api/preset/:id', (req, res) => {
            res.sendFile(req.params.id + '.json', {'root': __dirname + '/../presets'});
        });
        app.get('/api/recentdrafts', (req, res) => {
            res.json(draftsStore.getRecentDrafts());
        });
        app.get('/api/draft/:id', (req, res) => {
            res.sendFile(req.params.id + '.json', {'root': __dirname + '/../data'});
        });

        const indexPath = __dirname + '/index.html';

        app.use('/draft/[a-zA-Z]+', (req, res) => {
            if (fs.existsSync(indexPath)) {
                res.sendFile(indexPath);
            } else {
                res.sendFile('maintenance.html', {'root': __dirname + '/../public'});
            }
        });

        app.use(express.static('build'));
        app.use('/', (req, res) => {
            if (fs.existsSync(indexPath)) {
                res.sendFile(indexPath);
            } else {
                res.sendFile('maintenance.html', {'root': __dirname + '/../public'});
            }
        });

        io.on("connection", (socket: socketio.Socket) => {
            const draftIdRaw: string = socket.handshake.query.draftId;
            const draftId = Util.sanitizeDraftId(draftIdRaw);
            logger.info('Connection for draftId: %s', draftId, {draftId});

            const roomHost: string = `${draftId}-host`;
            const roomGuest: string = `${draftId}-guest`;
            const roomSpec: string = `${draftId}-spec`;

            if (!draftsStore.has(draftId)) {
                const path = `data/${draftId}.json`;
                if (fs.existsSync(path)) {
                    logger.info("Found recorded draft. Sending replay.", {draftId});
                    socket.emit('replay', JSON.parse(fs.readFileSync(path).toString('utf8')));
                } else {
                    logger.info("No recorded draft found.", {draftId});
                    socket.emit('message', 'This draft does not exist.');
                }
                logger.info("Disconnecting.", {draftId});
                socket.disconnect(true);
                return;
            }

            const rooms = Object.keys(socket.rooms);
            logger.debug("rooms: %s", JSON.stringify(rooms), {draftId});
            let yourPlayerType = Player.NONE;
            if (rooms.includes(roomHost)) {
                socket.join(roomHost); // async
                yourPlayerType = Player.HOST;
            } else if (rooms.includes(roomGuest)) {
                socket.join(roomGuest); // async
                yourPlayerType = Player.GUEST;
            } else {
                socket.join(roomSpec); // async
            }

            socket.on("set_role", (message: ISetRoleMessage, fn: (dc: IDraftConfig) => void) => {
                logger.info("Player wants to set own role: %s", JSON.stringify(message), {draftId});
                if (!draftsStore.has(draftId)) {
                    logger.warn("Draft does not exist", {draftId});
                    socket.emit('message', 'This draft does not exist.');
                    return;
                }
                const role: Player = Util.sanitizeRole(message.role);
                let assignedRole = Util.getAssignedRole(socket, roomHost, roomGuest);
                const rooms = Object.keys(socket.rooms);
                if (rooms.includes(roomSpec)) {
                    if (role === Player.HOST && !draftsStore.isPlayerConnected(draftId, role)) {
                        logger.info("Setting player role to 'HOST': %s", message.name, {draftId});
                        socket.join(roomHost); // async
                        socket.leave(roomSpec); // async
                        connectPlayer(draftId, Player.HOST, message.name);
                        assignedRole = Player.HOST;
                    } else if (role === Player.GUEST && !draftsStore.isPlayerConnected(draftId, role)) {
                        logger.info("Setting player role to 'GUEST': %s", message.name, {draftId});
                        socket.join(roomGuest); // async
                        socket.leave(roomSpec); // async
                        connectPlayer(draftId, Player.GUEST, message.name);
                        assignedRole = Player.GUEST;
                    } else {
                        logger.info("Setting role not possible: %s", role, {draftId});
                    }
                } else {
                    logger.info("Player is not registered as spectator currently. No action taken.", {draftId});
                }

                socket.nsp
                    .in(roomHost)
                    .in(roomGuest)
                    .in(roomSpec)
                    .emit("player_set_role", {name: message.name, playerType: assignedRole});
                fn({
                    ...draftsStore.getDraftViewsOrThrow(draftId).getDraftForPlayer(assignedRole),
                    yourPlayerType: assignedRole,
                });
            });

            socket.on("set_name", (message: ISetNameMessage, fn: () => void) => {
                logger.info("Player wants to set own name: %s", JSON.stringify(message), {draftId});
                if (!draftsStore.has(draftId)) {
                    logger.warn("Draft does not exist", {draftId});
                    socket.emit('message', 'This draft does not exist.');
                    return;
                }
                let assignedRole = Util.getAssignedRole(socket, roomHost, roomGuest);
                if (assignedRole === Player.HOST) {
                    logger.info("Setting HOST player name to: %s", message.name, {draftId});
                    setPlayerName(draftId, Player.HOST, message.name);
                } else if (assignedRole === Player.GUEST) {
                    logger.info("Setting GUEST player name to: %s", message.name, {draftId});
                    setPlayerName(draftId, Player.GUEST, message.name);
                } else {
                    logger.info("Player is not registered as HOST or GUEST currently. No action taken.", {draftId});
                    return;
                }

                socket.nsp
                    .in(roomHost)
                    .in(roomGuest)
                    .in(roomSpec)
                    .emit("player_set_name", {name: message.name, playerType: assignedRole});
                fn();
            });

            socket.on("ready", (message: {}, fn: (dc: IDraftConfig) => void) => {
                if (!draftsStore.has(draftId)) {
                    logger.warn("Player wants to indicate readyness, but Draft does not exist", {draftId});
                    socket.emit('message', 'This draft does not exist.');
                    return;
                }
                let assignedRole: Player = Player.NONE;
                let wasAlreadyReady = false;
                if (Object.keys(socket.rooms).includes(roomHost)) {
                    wasAlreadyReady = draftsStore.setPlayerReady(draftId, Player.HOST);
                    assignedRole = Player.HOST;
                } else if (Object.keys(socket.rooms).includes(roomGuest)) {
                    wasAlreadyReady = draftsStore.setPlayerReady(draftId, Player.GUEST);
                    assignedRole = Player.GUEST;
                }
                logger.info("Player indicates they are ready: %s", assignedRole, {draftId});
                if (!wasAlreadyReady && draftsStore.playersAreReady(draftId)) {
                    logger.info("Both Players are ready, starting countdown.", {draftId});
                    draftsStore.startCountdown(draftId, socket);
                    draftsStore.setStartTimestamp(draftId);
                }
                socket.nsp
                    .in(roomHost)
                    .in(roomGuest)
                    .in(roomSpec)
                    .emit("player_ready", {playerType: assignedRole});
                fn({
                    ...draftsStore.getDraftViewsOrThrow(draftId).getDraftForPlayer(assignedRole),
                    yourPlayerType: assignedRole
                });
            });

            socket.on("act", Listeners.actListener(draftsStore, draftId, validateAndApply, socket, roomHost, roomGuest, roomSpec));

            socket.on('disconnecting', function () {
                const assignedRole = Util.getAssignedRole(socket, roomHost, roomGuest);
                logger.info("Player disconnected: %s", assignedRole, {draftId});
                if (!draftsStore.has(draftId)) {
                    return;
                }
                draftsStore.disconnectPlayer(draftId, assignedRole);
            });

            let draftState = {
                ...draftsStore.getDraftViewsOrThrow(draftId).getDraftForPlayer(Player.NONE),
                yourPlayerType: yourPlayerType
            };
            logger.info("Emitting draft_state: %s", JSON.stringify(draftState), {draftId});
            socket.emit("draft_state", draftState);
        });

        const httpServer = server.listen(port, () => {
            logger.info("Listening on: %d", port);
        });
        const httpServerAddr = httpServer.address();


        function validateAndApply(draftId: string, message: DraftEvent): ValidationId[] {
            return validator.validateAndApply(draftId, message);
        }

        setInterval(() => {
            draftsStore.purgeStaleDrafts()
        }, ONE_HOUR);

        return {httpServer, httpServerAddr, io};
    }
};