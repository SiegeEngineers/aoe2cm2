import express, {Express, Response as ExpressResponse} from "express";
import {createServer, Server} from "http"
import {Server as SocketioServer, Socket} from "socket.io";
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
import {ActListener} from "./util/ActListener";
import * as fs from "fs";
import {logger} from "./util/Logger";
import {ISetNameMessage} from "./types/ISetNameMessage";
import {PresetUtil} from "./util/PresetUtil";
import {IRecentDraft, IServerState} from "./types";
import path from "path";
import {SessionStore} from "./models/SessionStore";

const ONE_HOUR = 1000 * 60 * 60;


export class DraftServer {
    readonly serverStateFile: string;
    readonly baseDir: string;
    readonly currentDataDirectory: string;
    readonly dataDirectory: string;
    readonly presetDirectory: string;
    readonly usersFile: string;
    readonly sessionsFile: string;

    constructor(baseDir: string = './') {
        this.serverStateFile = path.join(baseDir, 'serverState.json');
        this.baseDir = baseDir;
        this.dataDirectory = path.join(baseDir, 'data');
        this.currentDataDirectory = path.join(this.dataDirectory, 'current');
        this.presetDirectory = path.join(baseDir, 'presets');
        this.usersFile = path.join(baseDir, 'users.json');
        this.sessionsFile = path.join(baseDir, 'sessions.json');
    }

    private loadState(): IServerState {
        if (fs.existsSync(this.serverStateFile)) {
            const fileContent = fs.readFileSync(this.serverStateFile);
            return JSON.parse(fileContent.toString()) as IServerState;
        } else {
            return {maintenanceMode: false, hiddenPresetIds: []};
        }
    }

    private saveState(state: IServerState) {
        fs.writeFileSync(this.serverStateFile, JSON.stringify(state));
    }

    static plain404 = (res: ExpressResponse<any>) => (err: Error) => {
        if (err) {
            res.status(404).send("Not found.")
        }
    };

    serve(port: string | number | undefined): { httpServerAddr: AddressInfo | string | null; io: SocketioServer; httpServer: Server } {
        logger.info("Starting DraftServer on port %d", port);
        const app = express();
        app.set("port", port);
        app.use(express.json());

        const server = createServer(app);
        const io = new SocketioServer(server, {cookie: false});
        const state: IServerState = this.loadState();
        const draftsStore = new DraftsStore(this.baseDir, state);
        const sessionStore = new SessionStore(this.usersFile, this.sessionsFile);

        this.setUpApiRoutes(app, state, draftsStore, sessionStore, io);
        this.setUpSocketIo(io, draftsStore);

        const httpServer = server.listen(port, () => {
            logger.info("Listening on: %d", port);
        });
        const httpServerAddr = httpServer.address();

        setInterval(() => {
            draftsStore.purgeStaleDrafts()
        }, ONE_HOUR);

        return {httpServer, httpServerAddr, io};
    }

    private handleDraftLobby(socket: Socket, draftsStore: DraftsStore) {
        logger.info('Connection for lobby');

        socket.on('spectate_drafts', (message: {}, fn: (drafts: IRecentDraft[]) => void) => {
            const roomLobby: string = 'lobby';

            socket.join(roomLobby);
            fn(draftsStore.getRecentDrafts());
        });
    }

    private handleDraftRoom(socket: Socket, draftsStore: DraftsStore) {
        const draftIdRaw: string | string[] | undefined = socket.handshake.query.draftId;
        const draftId = Util.sanitizeDraftId(draftIdRaw);
        logger.info('Connection for draftId: %s', draftId, {draftId});

        const roomLobby: string = 'lobby';
        const roomHost: string = `${draftId}-host`;
        const roomGuest: string = `${draftId}-guest`;
        const roomSpec: string = `${draftId}-spec`;

        if (!draftsStore.has(draftId)) {
            try {
                const draftPath = path.join(this.currentDataDirectory, `${draftId}.json`);
                if (fs.existsSync(draftPath)) {
                    logger.info("Found recorded draft. Sending replay.", {draftId});
                    socket.emit('replay', JSON.parse(fs.readFileSync(draftPath).toString('utf8')));
                } else if (draftsStore.hasArchive(draftId)) {
                    logger.info("Found archived draft. Sending replay.", {draftId});
                    const archiveFolder = draftsStore.getArchiveFolder(draftId);
                    const archivedDraftPath = path.join(this.dataDirectory, archiveFolder, `${draftId}.json`);
                    socket.emit('replay', JSON.parse(fs.readFileSync(archivedDraftPath).toString('utf8')));
                } else {
                    logger.info("No recorded draft found.", {draftId});
                    socket.emit('message', 'This draft does not exist.');
                }
            } catch (e: any) {
                logger.error('Sending replay file failed', {draftId});
                logger.error(e.message, {draftId});
            }
            logger.info("Disconnecting.", {draftId});
            socket.disconnect(true);
            return;
        }

        logger.debug("rooms: %s", JSON.stringify(socket.rooms), {draftId});
        let yourPlayerType = Player.SPEC;
        if (socket.rooms.has(roomHost)) {
            socket.join(roomHost); // async
            yourPlayerType = Player.HOST;
        } else if (socket.rooms.has(roomGuest)) {
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
            let hasAssignedRole = false;
            if (socket.rooms.has(roomSpec)) {
                if (role === Player.HOST && !draftsStore.isPlayerConnected(draftId, role)) {
                    logger.info("Setting player role to 'HOST': %s", message.name, {draftId});
                    socket.join(roomHost); // async
                    socket.leave(roomSpec); // async
                    draftsStore.connectPlayer(draftId, Player.HOST, message.name);
                    assignedRole = Player.HOST;
                    hasAssignedRole = true;
                } else if (role === Player.GUEST && !draftsStore.isPlayerConnected(draftId, role)) {
                    logger.info("Setting player role to 'GUEST': %s", message.name, {draftId});
                    socket.join(roomGuest); // async
                    socket.leave(roomSpec); // async
                    draftsStore.connectPlayer(draftId, Player.GUEST, message.name);
                    assignedRole = Player.GUEST;
                    hasAssignedRole = true;
                } else {
                    logger.info("Setting role not possible: %s", role, {draftId});
                }
            } else {
                logger.info("Player is not registered as spectator currently. No action taken.", {draftId});
            }

            if (hasAssignedRole && draftsStore.isPlayersConnected(draftId) && !draftsStore.draftIsHidden(draftId)) {
                socket.nsp
                    .in(roomLobby)
                    .emit('draft_update', draftsStore.getLobbyDraft(draftId));
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
                draftsStore.setPlayerName(draftId, Player.HOST, message.name);
            } else if (assignedRole === Player.GUEST) {
                logger.info("Setting GUEST player name to: %s", message.name, {draftId});
                draftsStore.setPlayerName(draftId, Player.GUEST, message.name);
            } else {
                logger.info("Player is not registered as HOST or GUEST currently. No action taken.", {draftId});
                return;
            }

            if (draftsStore.isPlayersConnected(draftId) && !draftsStore.draftIsHidden(draftId)) {
                socket.nsp
                    .in(roomLobby)
                    .emit('draft_update', draftsStore.getLobbyDraft(draftId));
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
            let assignedRole: Player = Player.SPEC;
            let wasAlreadyReady = false;
            if (socket.rooms.has(roomHost)) {
                wasAlreadyReady = draftsStore.setPlayerReady(draftId, Player.HOST);
                assignedRole = Player.HOST;
            } else if (socket.rooms.has(roomGuest)) {
                wasAlreadyReady = draftsStore.setPlayerReady(draftId, Player.GUEST);
                assignedRole = Player.GUEST;
            }
            logger.info("Player indicates they are ready: %s", assignedRole, {draftId});
            if (!wasAlreadyReady && draftsStore.playersAreReady(draftId)) {
                logger.info("Both Players are ready, starting countdown.", {draftId});

                draftsStore.setStartTimestampIfNecessary(draftId);

                const draftViews = draftsStore.getDraftViewsOrThrow(draftId);
                let adminEventCounter = 0;
                while (ActListener.nextActionIsAdminEvent(draftsStore, draftId, adminEventCounter)) {
                    adminEventCounter++;
                    ActListener.scheduleAdminEvent(adminEventCounter, draftsStore, draftId, draftViews, socket, roomLobby, roomHost, roomGuest, roomSpec, this.currentDataDirectory);
                }
                if (draftViews.shouldRestartOrCancelCountdown()) {
                    draftsStore.restartOrCancelCountdown(draftId, this.currentDataDirectory);
                }
                ActListener.finishDraftIfNoFurtherActions(draftViews, socket, draftsStore, draftId, roomLobby, roomHost, roomGuest, roomSpec, this.currentDataDirectory);

                if (!draftViews.getActualDraft().hasNextAction()) {
                    return;
                }
                
                if (!draftsStore.draftIsHidden(draftId)) {
                    socket.nsp.in(roomLobby).emit('draft_update', draftsStore.getLobbyDraft(draftId));
                }

                draftsStore.startCountdown(draftId, socket, this.currentDataDirectory);
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

        const validator = new Validator(draftsStore);

        function validateAndApply(draftId: string, message: DraftEvent): ValidationId[] {
            return validator.validateAndApply(draftId, message);
        }

        socket.on("act", new ActListener(this.currentDataDirectory).actListener(draftsStore, draftId, validateAndApply, socket, roomLobby, roomHost, roomGuest, roomSpec));

        socket.on('disconnecting', function () {
            const assignedRole = Util.getAssignedRole(socket, roomHost, roomGuest);
            logger.info("Player disconnected: %s", assignedRole, {draftId});
            if (!draftsStore.has(draftId)) {
                return;
            }
            const wasPublic = draftsStore.isPlayersConnected(draftId);
            
            draftsStore.disconnectPlayer(draftId, assignedRole);

            if (wasPublic && !draftsStore.draftIsHidden(draftId)) {
                logger.info("Notifying lobby draft %s no longer has both players", draftId, {draftId});
                socket.nsp.in(roomLobby).emit('draft_abandoned', draftId);
            }
        });

        let draftState = {
            ...draftsStore.getDraftViewsOrThrow(draftId).getDraftForPlayer(Player.SPEC),
            yourPlayerType: yourPlayerType
        };
        logger.info("Emitting draft_state: %s", JSON.stringify(draftState), {draftId});
        socket.emit("draft_state", draftState);
    }

    private setUpSocketIo(io: SocketioServer, draftsStore: DraftsStore) {
        io.on("connection", (socket: Socket) => {
            if (socket.handshake.query.draftId) {
                this.handleDraftRoom(socket, draftsStore);
            }
            else if (socket.handshake.query.lobby) {
                this.handleDraftLobby(socket, draftsStore);
            } else {
                logger.info("Disconnecting client with invalid socket.");
                socket.disconnect(true);
            }
        });
    }

    private setUpApiRoutes(app: Express, state: IServerState, draftsStore: DraftsStore, sessionStore: SessionStore, io: SocketioServer) {
        app.post('/api/login', express.urlencoded({extended: false}), function (req, res) {
            const user = req.body.user;
            const pass = req.body.password;
            let apiKey = sessionStore.authenticate(user, pass);
            if (apiKey) {
                res.status(200).json({apiKey: apiKey});
            }
            res.status(401).end()
        });

        app.post('/api/state', (req, res) => {
            if (!Util.isAuthenticatedRequest(req, sessionStore)) {
                res.status(403).end();
                return;
            }
            const user = Util.getAuthenticatedUser(req, sessionStore);
            logger.info("Received request by user '%s' to set state mode: %s", user, JSON.stringify(req.body));
            for (let key in req.body) {
                if (state.hasOwnProperty(key) && req.body.hasOwnProperty(key)) {
                    state[key] = req.body[key];
                }
            }
            res.json(state);
            logger.info('New state = %s', JSON.stringify(state));
            this.saveState(state);
            logger.info('Persisted new state');
        });
        app.get('/api/state', (req, res) => {
            if (!Util.isAuthenticatedRequest(req, sessionStore)) {
                res.status(403).end();
                return;
            }
            res.json(state);
        });
        app.get('/api/presets-and-drafts', (req, res) => {
            if (!Util.isAuthenticatedRequest(req, sessionStore)) {
                res.status(403).end();
                return;
            }
            res.sendFile('presets-and-drafts.json', {'root': __dirname + '/..'});
        });
        app.post('/api/reload-archive', (req, res) => {
            if (!Util.isAuthenticatedRequest(req, sessionStore)) {
                res.status(403).end();
                return;
            }
            const user = Util.getAuthenticatedUser(req, sessionStore);
            logger.info("Reloading draft archive data, requested by user '%s'", user);
            const response = draftsStore.reloadArchiveData();
            res.json(response);
            logger.info('Reloading draft archive data finished');
        });
        app.post('/api/draft/new', (req, res) => {
            logger.info('Received request to create a new draft: %s', JSON.stringify(req.body));

            if (state.maintenanceMode) {
                res.json({
                    status: 'error',
                    message: 'aoe2cm is currently in maintenance mode, no drafts can be created'
                });
                logger.info('Server is in maintenance mode. Discarding draft creation request.');
                return;
            }

            let draftId = Util.newDraftId();
            while (draftsStore.draftIdExists(draftId)) {
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
                const presetId = PresetUtil.createPreset(preset as Preset, this.presetDirectory);
                res.json({status: 'ok', presetId: presetId});
                logger.info('Created new preset with id: %s', presetId, {presetId});
            } else {
                res.json({status: 'error', validationErrors});
                logger.info('Preset validation failed: %s', JSON.stringify(validationErrors));
            }
        });
        app.get('/api/connections', (req, res) => {
            if (Util.isAuthenticatedRequest(req, sessionStore)) {
                // @ts-ignore
                res.json({
                    connections: io.engine.clientsCount,
                    rooms: Array.from(io.sockets.adapter.rooms.keys())
                        .filter(value => value.includes('-spec') || value.includes('-host') || value.includes('-guest'))
                        .sort()
                });
            } else {
                // @ts-ignore
                res.json({connections: io.engine.clientsCount});
            }
        });
        app.get('/api/alerts', (req, res) => {
            res.sendFile('alerts.json', {'root': __dirname + '/..'});
        });
        app.get('/api/preset/list', (req, res) => {
            res.sendFile('presets.json', {'root': __dirname + '/..'});
        });
        app.get('/api/preset/:id', (req, res) => {
            res.sendFile(req.params.id + '.json', {'root': __dirname + '/../presets'}, DraftServer.plain404(res));
        });
        app.get('/api/recentdrafts', (req, res) => {
            res.json(draftsStore.getRecentDrafts());
        });
        app.get('/api/draft/:id', (req, res) => {
            const draftId = req.params.id;
            if (draftsStore.hasArchive(draftId)) {
                const archiveDirectory = draftsStore.getArchiveFolder(draftId);
                res.sendFile(draftId + '.json', {'root': path.join(this.dataDirectory, archiveDirectory)}, DraftServer.plain404(res));
            } else {
                res.sendFile(draftId + '.json', {'root': this.currentDataDirectory}, DraftServer.plain404(res));
            }
        });

        const indexPath = __dirname + '/index.html';

        app.use('/draft/:draftid', (req, res) => {
            if (Util.isRequestForPreview(req)) {
                this.handlePreviewRequest(req, res, draftsStore);
            } else {
                if (fs.existsSync(indexPath)) {
                    res.sendFile(indexPath);
                } else {
                    res.sendFile('maintenance.html', {'root': __dirname + '/../public'});
                }
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
    }

    private handlePreviewRequest(req: any, res: any, draftsStore: DraftsStore) {
        try {
            const draftId = req.params.draftid;

            if (draftsStore.has(draftId)) {
                const content = draftsStore.getDraftOrThrow(draftId);
                res.send(Util.draftToPreviewPage(draftId, content));
            } else {
                let draftPath = path.join(this.currentDataDirectory, draftId + '.json');
                if (draftsStore.hasArchive(draftId)) {
                    const archiveDirectory = draftsStore.getArchiveFolder(draftId);
                    draftPath = path.join(this.dataDirectory, archiveDirectory, draftId + '.json');
                }
                if (fs.existsSync(draftPath)) {
                    const content = JSON.parse(fs.readFileSync(draftPath).toString());
                    res.send(Util.draftToPreviewPage(draftId, content));
                } else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.send('an error occured');
        }
    }
}
