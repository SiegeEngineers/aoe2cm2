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

function getAssignedRole(socket: SocketIO.Socket, roomHost: string, roomGuest: string) {
    let assignedRole: Player = Player.NONE;
    if (Object.keys(socket.rooms).includes(roomHost)) {
        assignedRole = Player.HOST;
    } else if (Object.keys(socket.rooms).includes(roomGuest)) {
        assignedRole = Player.GUEST;
    }
    return assignedRole;
}

export const DraftServer = {
    serve(port: string | number | undefined): { httpServerAddr: AddressInfo | string | null; io: SocketIO.Server; httpServer: Server } {
        const app = express();
        app.set("port", port);
        app.use(express.json());

        const server = new Server(app);
        const io = socketio(server, {cookie: false});
        const draftsStore = new DraftsStore();
        const validator = new Validator(draftsStore);

        function connectPlayer(draftId: string, player: Player, name: string) {
            if (!draftsStore.has(draftId)) {
                draftsStore.initDraft(draftId, Preset.SAMPLE);
            }
            draftsStore.connectPlayer(draftId, player, name);
        }

        app.post('/preset/new', (req, res) => {
            console.log('/preset/new', req.body);
            let draftId = Util.newDraftId();
            while(draftsStore.has(draftId)){
                draftId += Util.randomChar();
            }
            const pojo: Preset = req.body.preset as Preset;
            let preset = Preset.fromPojo(pojo);
            const validationErrors = Validator.validatePreset(preset);
            if (validationErrors.length === 0) {
                draftsStore.initDraft(draftId, preset as Preset);
                res.json({status: 'ok', draftId});
            } else {
                res.json({status: 'error', validationErrors});
            }
        });
        app.use('/draft/[a-zA-Z]+', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        app.use(express.static('build'));
        app.use('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        io.on("connection", (socket: socketio.Socket) => {
            const draftIdRaw: string = socket.handshake.query.draftId;
            const draftId = Util.sanitizeDraftId(draftIdRaw);

            const roomHost: string = `${draftId}-host`;
            const roomGuest: string = `${draftId}-guest`;
            const roomSpec: string = `${draftId}-spec`;

            console.log("a user connected to the draft", draftId);

            if (!draftsStore.has(draftId)) {
                const path = `data/${draftId}.json`;
                if (fs.existsSync(path)) {
                    console.log("Found recorded draft. Sending replay.", draftId);
                    socket.emit('replay', JSON.parse(fs.readFileSync(path).toString('utf8')));
                } else {
                    console.log("Did not find recorded draft.", draftId);
                    socket.emit('message', 'This draft does not exist.');
                }
                console.log("disconnecting.", draftId);
                socket.disconnect(true);
                return;
            }

            const rooms = Object.keys(socket.rooms);
            console.log('rooms', rooms);
            let yourPlayerType = Player.NONE;
            if (rooms.includes(roomHost)) {
                socket.join(roomHost);
                yourPlayerType = Player.HOST;
            } else if (rooms.includes(roomGuest)) {
                socket.join(roomGuest);
                yourPlayerType = Player.GUEST;
            } else {
                socket.join(roomSpec);
            }

            socket.on("set_role", (message: ISetRoleMessage, fn: (dc: IDraftConfig) => void) => {
                console.log("player wants to set own role:", message);
                const role: Player = Util.sanitizeRole(message.role);
                let assignedRole = Player.NONE;
                const rooms = Object.keys(socket.rooms);
                if (rooms.includes(roomSpec)) {
                    if (role === Player.HOST && !draftsStore.isPlayerConnected(draftId, role)) {
                        console.log("setting player role:", message);
                        socket.join(roomHost);
                        socket.leave(roomSpec);
                        connectPlayer(draftId, Player.HOST, message.name);
                        assignedRole = Player.HOST;
                    } else if (role === Player.GUEST && !draftsStore.isPlayerConnected(draftId, role)) {
                        console.log("setting player role:", message);
                        socket.join(roomGuest);
                        socket.leave(roomSpec);
                        connectPlayer(draftId, Player.GUEST, message.name);
                        assignedRole = Player.GUEST;
                    }
                }

                socket.nsp
                    .in(roomHost)
                    .in(roomGuest)
                    .in(roomSpec)
                    .emit("player_set_role", {name: message.name, playerType: assignedRole});
                fn({
                    ...draftsStore.getDraftViewsOrThrow(draftId).getDraftForPlayer(assignedRole),
                    yourPlayerType: assignedRole
                });
            });

            socket.on("ready", (message: {}, fn: (dc: IDraftConfig) => void) => {
                console.log("player ready:", message);
                let assignedRole: Player = Player.NONE;
                if (Object.keys(socket.rooms).includes(roomHost)) {
                    draftsStore.setPlayerReady(draftId, Player.HOST);
                    assignedRole = Player.HOST;
                } else if (Object.keys(socket.rooms).includes(roomGuest)) {
                    draftsStore.setPlayerReady(draftId, Player.GUEST);
                    assignedRole = Player.GUEST;
                }
                if(draftsStore.playersAreReady(draftId)){
                    draftsStore.startCountdown(draftId, socket)
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

            socket.on('disconnect', function () {
                const assignedRole = getAssignedRole(socket, roomHost, roomGuest);
                console.log(`Got disconnect! draftId: ${draftId}, role: ${assignedRole}`);
                draftsStore.disconnectPlayer(draftId, assignedRole);
            });

            console.log('emitting "draft_state": ', {
                ...draftsStore.getDraftViewsOrThrow(draftId).getDraftForPlayer(Player.NONE),
                yourPlayerType: yourPlayerType
            });
            socket.emit("draft_state", {
                ...draftsStore.getDraftViewsOrThrow(draftId).getDraftForPlayer(Player.NONE),
                yourPlayerType:yourPlayerType
            });
        });

        const httpServer = server.listen(port, () => {
            console.log("listening on *:" + port);
        });
        const httpServerAddr = httpServer.address();


        function validateAndApply(draftId: string, message: DraftEvent): ValidationId[] {
            return validator.validateAndApply(draftId, message);
        }

        return {httpServer, httpServerAddr, io};
    }
};