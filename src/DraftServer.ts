import express from "express";
import {Server} from "http"
import socketio from "socket.io";
import Player from "./models/Player";
import {IDraftConfig} from "./models/IDraftConfig";
import {IJoinMessage} from "./models/IJoinMessage";
import {DraftsStore} from "./models/DraftsStore";
import {Validator} from "./models/Validator";
import {ValidationId} from "./models/ValidationId";
import PlayerEvent from "./models/PlayerEvent";
import {DraftEvent} from "./models/DraftEvent";
import Action from "./models/Action";
import {Util} from "./models/Util";
import {AddressInfo} from "net";

export const DraftServer = {
    serve(port: string | number | undefined):{ httpServerAddr: AddressInfo | string | null; io: SocketIO.Server; httpServer: Server } {
        const app = express();
        app.set("port", port);

        const server = new Server(app);
        const io = socketio(server, {cookie: false});
        const draftsStore = new DraftsStore();
        const validator = new Validator(draftsStore);

        function setPlayerName(draftId: string, player: Player, name: string) {
            if (!draftsStore.has(draftId)) {
                draftsStore.initDraft(draftId);
            }
            draftsStore.setPlayerName(draftId, player, name);
        }

        function newDraftId(): string {

            const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            let id: string = '';
            for (let i = 0; i < 5; i++) {

                id += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return id;
        }

        app.use(/^\/new$/, (req, res) => {
            console.log('redirecting');
            res.redirect('/draft/' + newDraftId());
        });
        app.use('/preset/new', (req, res) => {
            const draftId = newDraftId();
            if (!draftsStore.has(draftId)) {
                draftsStore.initDraft(draftId);
            }
            res.json({draftId});
        });
        app.use('/draft/[a-zA-Z]+', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        app.use(express.static('build'));
        app.use('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        io.on("connection", (socket: socketio.Socket) => {
            const draftId: string = socket.handshake.query.draftId;

            const roomHost: string = `${draftId}-host`;
            const roomGuest: string = `${draftId}-guest`;
            const roomSpec: string = `${draftId}-spec`;

            console.log("a user connected to the draft", draftId);

            if (!draftsStore.has(draftId)) {
                draftsStore.initDraft(draftId);
            }

            const {nameHost, nameGuest} = draftsStore.getPlayerNames(draftId);

            const rooms = Object.keys(socket.adapter.rooms);
            console.log('rooms', rooms);
            if (!rooms.includes(roomHost)) {
                socket.join(roomHost);
                const message = {nameHost, nameGuest, youAre: Player.HOST};
                console.log('sending', message);
            } else if (!rooms.includes(roomGuest)) {
                socket.join(roomGuest);
                const message = {nameHost, nameGuest, youAre: Player.GUEST};
                console.log('sending', message);
            } else {
                socket.join(roomSpec);
                const message = {nameHost, nameGuest, youAre: Player.NONE};
                console.log('sending', message);
            }

            socket.on("join", (message: IJoinMessage, fn: (dc: IDraftConfig) => void) => {
                console.log("player joined:", message);
                let playerType: Player = Player.NONE;
                if (Object.keys(socket.rooms).includes(roomHost)) {
                    setPlayerName(draftId, Player.HOST, message.name);
                    draftsStore.setPlayerReady(draftId, Player.HOST);
                    playerType = Player.HOST;
                } else if (Object.keys(socket.rooms).includes(roomGuest)) {
                    setPlayerName(draftId, Player.GUEST, message.name);
                    draftsStore.setPlayerReady(draftId, Player.GUEST);
                    playerType = Player.GUEST
                }
                socket.nsp
                    .in(roomHost)
                    .in(roomGuest)
                    .in(roomSpec)
                    .emit("player_joined", {name: message.name, playerType});
                fn({
                    ...draftsStore.getDraftViewsOrThrow(draftId).getDraftForPlayer(playerType),
                    yourPlayerType: playerType
                });
            });

            socket.on("act", (message: PlayerEvent, fn: (retval: any) => void) => {
                console.log(message);

                const civilisationsList = draftsStore.getDraftOrThrow(draftId).preset.civilisations.slice();
                message = Util.setRandomCivilisationIfNeeded(message, draftId, draftsStore, civilisationsList);

                const validationErrors: ValidationId[] = validateAndApply(draftId, message);
                if (validationErrors.length === 0) {

                    const draftViews = draftsStore.getDraftViewsOrThrow(draftId);

                    socket.nsp
                        .in(roomHost)
                        .emit("playerEvent", draftViews.getLastEventForHost());
                    socket.nsp
                        .in(roomGuest)
                        .emit("playerEvent", draftViews.getLastEventForGuest());
                    socket.nsp
                        .in(roomSpec)
                        .emit("playerEvent", draftViews.getLastEventForSpec());
                    fn({status: 'ok', validationErrors});

                    const expectedAction = draftsStore.getExpectedAction(draftId);
                    if (expectedAction !== null) {
                        if (expectedAction.player === Player.NONE) { // Admin Event
                            if (expectedAction.action === Action.REVEAL_ALL) {
                                setTimeout(() => {
                                    draftViews.revealAll();
                                    socket.nsp
                                        .in(roomHost)
                                        .emit("adminEvent", {
                                            ...expectedAction,
                                            events: draftViews.getHostDraft().events
                                        });
                                    socket.nsp
                                        .in(roomGuest)
                                        .emit("adminEvent", {
                                            ...expectedAction,
                                            events: draftViews.getGuestDraft().events
                                        });
                                    socket.nsp
                                        .in(roomSpec)
                                        .emit("adminEvent", {
                                            ...expectedAction,
                                            events: draftViews.getSpecDraft().events
                                        });
                                    draftsStore.addDraftEvent(draftId, expectedAction);
                                }, 2000);
                            } else {
                                throw new Error("Unknown expected action!" + expectedAction);
                            }
                        }
                    }
                } else {
                    fn({status: 'error', validationErrors});
                }
            });
        });

        const httpServer = server.listen(port, () => {
            console.log("listening on *:" + port);
        });
        const httpServerAddr = httpServer.listen().address();


        function validateAndApply(draftId: string, message: DraftEvent): ValidationId[] {
            return validator.validateAndApply(draftId, message);
        }

        return {httpServer, httpServerAddr, io};
    }
};