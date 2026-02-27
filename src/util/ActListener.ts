import {DraftEvent} from "../types/DraftEvent";
import PlayerEvent from "../models/PlayerEvent";
import {DraftsStore} from "../models/DraftsStore";
import {ValidationId} from "../constants/ValidationId";
import {Util} from "./Util";
import Player from "../constants/Player";
import ActionType, {actionTypeFromAction} from "../constants/ActionType";
import DraftViews from "../models/DraftViews";
import fs from "fs";
import {logger} from "./Logger";
import AdminEvent from "../models/AdminEvent";
import path from "path";
import {Socket} from "socket.io";
import DraftOption from "../models/DraftOption";
import Draft from "../models/Draft";

export class ActListener {
    readonly dataDirectory: string;
    readonly presetDraftsDirectory: string;
    private static readonly adminTurnDelay = 2000;

    constructor(dataDirectory: string, presetDraftsDirectory: string) {
        this.dataDirectory = dataDirectory;
        this.presetDraftsDirectory = presetDraftsDirectory;
    }

    actListener(draftsStore: DraftsStore, draftId: string, validateAndApply: (draftId: string, message: DraftEvent) => ValidationId[], socket: Socket, roomLobby: string, roomHost: string, roomGuest: string, roomSpec: string, skipSourceValidation = false) {
        return (message: PlayerEvent, fn: (retval: any) => void) => {
            logger.info("Got act message: %s", JSON.stringify(message), {draftId});

            const assignedRole = Util.getAssignedRole(socket, roomHost, roomGuest);

            if (!skipSourceValidation) {
                if (assignedRole === Player.SPEC) {
                    logger.warn("Discarding spectator message", {draftId});
                    socket.emit('message', 'You shall not act.');
                    return;
                }

                if (message.executingPlayer !== assignedRole) {
                    logger.warn("Discarding fake message", {draftId});
                    socket.emit('message', 'You shall not impersonate your opponent.');
                    return;
                }

                if (!draftsStore.has(draftId)) {
                    logger.warn("Draft does not exist", {draftId});
                    socket.emit('message', 'This draft does not exist.');
                    return;
                }
            }

            const civilisationsList = draftsStore.getDraftOrThrow(draftId).preset.options.slice();
            message = Util.setRandomDraftOptionIfNeeded(message, draftId, draftsStore, civilisationsList);
            logger.info("Augmented message: %s", JSON.stringify(message), {draftId});

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

                let adminEventCounter = 0;
                while (ActListener.nextActionIsAdminEvent(draftsStore, draftId, adminEventCounter)) {
                    adminEventCounter++;
                    ActListener.scheduleAdminEvent(adminEventCounter, draftsStore, draftId, draftViews, socket, roomLobby, roomHost, roomGuest, roomSpec, this.dataDirectory, this.presetDraftsDirectory);
                }
                if (draftViews.shouldRestartOrCancelCountdown()) {
                    draftsStore.restartOrCancelCountdown(draftId, this.dataDirectory, this.presetDraftsDirectory);
                }
                ActListener.finishDraftIfNoFurtherActions(draftViews, socket, draftsStore, draftId, roomLobby, roomHost, roomGuest, roomSpec, this.dataDirectory, this.presetDraftsDirectory);
            } else {
                logger.info("Validation yielded errors: %s", JSON.stringify(validationErrors), {draftId});
                fn({status: 'error', validationErrors});
            }
        };
    }

    static nextActionIsAdminEvent(draftsStore: DraftsStore, draftId: string, offset: number) {
        const expectedActions = draftsStore.getExpectedActions(draftId, offset);
        if (expectedActions.length === 1) {
            return expectedActions[0].executingPlayer === Player.NONE;
        }
        return false;
    }


    static scheduleAdminEvent(adminEventCounter: number, draftsStore: DraftsStore, draftId: string, draftViews: DraftViews, socket: Socket, roomLobby: string, roomHost: string, roomGuest: string, roomSpec: string, dataDirectory: string, presetDraftsDirectory: string) {
        const expectedActions = draftsStore.getExpectedActions(draftId, adminEventCounter - 1);
        const expectedAction = expectedActions[0];
        if (expectedAction.executingPlayer === Player.NONE) { // Admin Event
            if (actionTypeFromAction(expectedAction.action) === ActionType.REVEAL) {
                const draftEvent = new AdminEvent(expectedAction.player, expectedAction.action);
                setTimeout(() => {
                    logger.info('Executing admin event: %s', JSON.stringify(draftEvent), {draftId});
                    draftViews.reveal(expectedAction.action);
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
                    draftsStore.addDraftEvent(draftId, draftEvent);
                    draftsStore.restartOrCancelCountdown(draftId, dataDirectory, presetDraftsDirectory);
                    ActListener.finishDraftIfNoFurtherActions(draftViews, socket, draftsStore, draftId, roomLobby, roomHost, roomGuest, roomSpec, dataDirectory, presetDraftsDirectory);
                }, adminEventCounter * this.adminTurnDelay);
            } else if (actionTypeFromAction(expectedAction.action) === ActionType.PAUSE) {
                const draftEvent = new AdminEvent(expectedAction.player, expectedAction.action);
                setTimeout(() => {
                    logger.info('Executing admin event: %s', JSON.stringify(draftEvent), {draftId});
                    draftsStore.pause(draftId);
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
                    draftsStore.addDraftEvent(draftId, draftEvent);
                    ActListener.finishDraftIfNoFurtherActions(draftViews, socket, draftsStore, draftId, roomLobby, roomHost, roomGuest, roomSpec, dataDirectory, presetDraftsDirectory);
                }, adminEventCounter * this.adminTurnDelay);
            } else if (actionTypeFromAction(expectedAction.action) === ActionType.RESET_CL) {
                const draftEvent = new AdminEvent(expectedAction.player, expectedAction.action);
                setTimeout(() => {
                    logger.info('Executing admin event: %s', JSON.stringify(draftEvent), {draftId});
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
                    draftsStore.addDraftEvent(draftId, draftEvent);
                    ActListener.finishDraftIfNoFurtherActions(draftViews, socket, draftsStore, draftId, roomLobby, roomHost, roomGuest, roomSpec, dataDirectory, presetDraftsDirectory);
                }, adminEventCounter * this.adminTurnDelay);
            } else if ([ActionType.PICK, ActionType.BAN, ActionType.STEAL, ActionType.SNIPE].includes(actionTypeFromAction(expectedAction.action))) {
                setTimeout(() => {
                    let draftEvent = new PlayerEvent(expectedAction.player, actionTypeFromAction(expectedAction.action), DraftOption.RANDOM.id, false, Player.NONE);
                    const civilisationsList = draftsStore.getDraftOrThrow(draftId).preset.options.slice();
                    draftEvent = Util.setRandomDraftOptionIfNeeded(draftEvent, draftId, draftsStore, civilisationsList);
                    draftEvent.isRandomlyChosen = (expectedAction.player !== Player.NONE);
                    logger.info('Executing admin event: %s', JSON.stringify(draftEvent), {draftId});

                    draftsStore.addDraftEvent(draftId, draftEvent);

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

                    draftsStore.restartOrCancelCountdown(draftId, dataDirectory, presetDraftsDirectory);
                    ActListener.finishDraftIfNoFurtherActions(draftViews, socket, draftsStore, draftId, roomLobby, roomHost, roomGuest, roomSpec, dataDirectory, presetDraftsDirectory);
                }, adminEventCounter * this.adminTurnDelay);
            } else {
                throw new Error("Unknown expected action! " + expectedAction);
            }
        }
    }

    static finishDraftIfNoFurtherActions(draftViews: DraftViews, socket: Socket, draftsStore: DraftsStore,
                                         draftId: string, roomLobby: string, roomHost: string, roomGuest: string,
                                         roomSpec: string, dataDirectory: string, presetDraftsDirectory: string) {
        if (!draftViews.getActualDraft().hasNextAction()) {
            const draft = draftsStore.getDraftOrThrow(draftId);
            const savedDraft = Draft.from(draft);
            if (draft.private) {
                logger.info("Discarding private draft: %s", JSON.stringify(savedDraft), {draftId});
                draftsStore.finishDraft(draftId);
                return;
            }
            savedDraft.hostConnected = false;
            savedDraft.guestConnected = false;
            savedDraft.startTimestamp = 0;
            logger.info("Saving draft: %s", JSON.stringify(savedDraft), {draftId});
            const draftPath = path.join(dataDirectory, `${draftId}.json`);
            fs.writeFile(draftPath, JSON.stringify(savedDraft), (err) => {
                logger.info("No further action expected. Disconnecting clients.", {draftId});
                for (let room of [roomHost, roomGuest, roomSpec]) {
                    socket.nsp.in(room).allSockets().then(
                        value => value.forEach(
                            socketId => socket.nsp.sockets.get(socketId)?.disconnect(true)
                        )
                    )
                }
                if (!draftsStore.draftIsHidden(draftId)) {
                    socket.nsp.in(roomLobby).emit('draft_finished', draftsStore.getLobbyDraft(draftId));
                }
                if (err) throw err;
                logger.info(`Draft saved to ${draftPath}`, {draftId});
                if (draft.preset.presetId) {
                    const presetId = draft.preset.presetId;
                    if (presetId.match(/^[A-Za-z0-9_-]+$/)) {
                        const dataPath = path.join(presetDraftsDirectory, presetId + '.json');
                        const draftMetaData = {
                            draftId,
                            guest: savedDraft.nameGuest,
                            host: savedDraft.nameHost,
                            ts: draft.startTimestamp
                        };
                        if (fs.existsSync(dataPath)) {
                            const content = JSON.parse(fs.readFileSync(dataPath).toString());
                            content.push(draftMetaData)
                            fs.writeFileSync(dataPath, JSON.stringify(content));
                            logger.info(`Added draftId to preset drafts for preset ${presetId}`, {draftId});
                        } else {
                            fs.writeFileSync(dataPath, JSON.stringify([draftMetaData]));
                            logger.info(`Created new file and added draftId to preset drafts for preset ${presetId}`, {draftId});
                        }
                    } else {
                        logger.info(`Invalid presetId set: ${presetId}. Not adding draftId to preset drafts`, {draftId});
                    }
                } else {
                    logger.info(`No presetId set, not adding draftId to preset drafts`, {draftId});
                }
                draftsStore.finishDraft(draftId);
            });
        }
    }
}
