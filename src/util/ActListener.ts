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

export class ActListener {
    readonly dataDirectory: string;
    private static readonly adminTurnDelay = 2000;

    constructor(dataDirectory: string) {
        this.dataDirectory = dataDirectory;
    }

    actListener(draftsStore: DraftsStore, draftId: string, validateAndApply: (draftId: string, message: DraftEvent) => ValidationId[], socket: Socket, roomHost: string, roomGuest: string, roomSpec: string, skipSourceValidation = false) {
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
                    ActListener.scheduleAdminEvent(adminEventCounter, draftsStore, draftId, draftViews, socket, roomHost, roomGuest, roomSpec, this.dataDirectory);
                }
                if (draftViews.shouldRestartOrCancelCountdown()) {
                    draftsStore.restartOrCancelCountdown(draftId, this.dataDirectory);
                }
                ActListener.finishDraftIfNoFurtherActions(draftViews, socket, draftsStore, draftId, roomHost, roomGuest, roomSpec, this.dataDirectory);
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


    static scheduleAdminEvent(adminEventCounter: number, draftsStore: DraftsStore, draftId: string, draftViews: DraftViews, socket: Socket, roomHost: string, roomGuest: string, roomSpec: string, dataDirectory: string) {
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
                    draftsStore.restartOrCancelCountdown(draftId, dataDirectory);
                    ActListener.finishDraftIfNoFurtherActions(draftViews, socket, draftsStore, draftId, roomHost, roomGuest, roomSpec, dataDirectory);
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

                    draftsStore.restartOrCancelCountdown(draftId, dataDirectory);
                    ActListener.finishDraftIfNoFurtherActions(draftViews, socket, draftsStore, draftId, roomHost, roomGuest, roomSpec, dataDirectory);
                }, adminEventCounter * this.adminTurnDelay);
            } else {
                throw new Error("Unknown expected action! " + expectedAction);
            }
        }
    }

    static finishDraftIfNoFurtherActions(draftViews: DraftViews, socket: Socket, draftsStore: DraftsStore,
                                  draftId: string, roomHost: string, roomGuest: string, roomSpec: string, dataDirectory: string) {
        if (!draftViews.getActualDraft().hasNextAction()) {
            const draft = draftsStore.getDraftOrThrow(draftId);
            draft.startTimestamp = 0;
            draft.hostConnected = false;
            draft.guestConnected = false;
            logger.info("Saving draft: %s", JSON.stringify(draft), {draftId});
            const draftPath = path.join(dataDirectory, `${draftId}.json`);
            fs.writeFile(draftPath, JSON.stringify(draft), (err) => {
                logger.info("No further action expected. Disconnecting clients.", {draftId});
                for (let room of [roomHost, roomGuest, roomSpec]) {
                    socket.nsp.in(room).allSockets().then(
                        value => value.forEach(
                            socketId => socket.nsp.sockets.get(socketId)?.disconnect(true)
                        )
                    )
                }
                if (err) throw err;
                logger.info(`Draft saved to ${draftPath}`, {draftId});
                draftsStore.finishDraft(draftId);
            });
        }
    }
}
