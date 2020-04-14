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

export const Listeners = {

    actListener(draftsStore: DraftsStore, draftId: string, validateAndApply: (draftId: string, message: DraftEvent) => ValidationId[], socket: SocketIO.Socket, roomHost: string, roomGuest: string, roomSpec: string) {
        return (message: PlayerEvent, fn: (retval: any) => void) => {
            logger.info("Got act message: %s", JSON.stringify(message), {draftId});

            const civilisationsList = draftsStore.getDraftOrThrow(draftId).preset.civilisations.slice();
            message = Util.setRandomCivilisationIfNeeded(message, draftId, draftsStore, civilisationsList);
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
                while (this.nextActionIsAdminEvent(draftsStore, draftId, adminEventCounter)) {
                    adminEventCounter++;
                    this.scheduleAdminEvent(adminEventCounter, draftsStore, draftId, draftViews, socket, roomHost, roomGuest, roomSpec);
                }
                if (draftViews.shouldRestartOrCancelCountdown()) {
                    draftsStore.restartOrCancelCountdown(draftId);
                }
                this.finishDraftIfNoFurtherActions(draftViews, socket, draftsStore, draftId, roomHost, roomGuest, roomSpec);
            } else {
                logger.info("Validation yielded errors: %s", JSON.stringify(validationErrors), {draftId});
                fn({status: 'error', validationErrors});
            }
        };
    },
    nextActionIsAdminEvent: function (draftsStore: DraftsStore, draftId: string, offset: number) {
        const expectedActions = draftsStore.getExpectedActions(draftId, offset);
        if (expectedActions.length == 1) {
            return expectedActions[0].player === Player.NONE;
        }
        return false;
    },
    scheduleAdminEvent: function (adminEventCounter: number, draftsStore: DraftsStore, draftId: string, draftViews: DraftViews, socket: SocketIO.Socket, roomHost: string, roomGuest: string, roomSpec: string) {
        const expectedActions = draftsStore.getExpectedActions(draftId, adminEventCounter - 1);
        const expectedAction = expectedActions[0];
        if (expectedAction.player === Player.NONE) { // Admin Event
            if (actionTypeFromAction(expectedAction.action) === ActionType.REVEAL) {
                const draftEvent = new AdminEvent(expectedAction.player, expectedAction.action);
                setTimeout(() => {
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
                    draftsStore.restartOrCancelCountdown(draftId);
                    this.finishDraftIfNoFurtherActions(draftViews, socket, draftsStore, draftId, roomHost, roomGuest, roomSpec);
                }, adminEventCounter * 2000);
            } else {
                throw new Error("Unknown expected action! " + expectedAction);
            }
        }
    },
    finishDraftIfNoFurtherActions: function (draftViews: DraftViews, socket: SocketIO.Socket, draftsStore: DraftsStore,
                                             draftId: string, roomHost: string, roomGuest: string, roomSpec: string) {
        if (!draftViews.getActualDraft().hasNextAction()) {
            logger.info("No further action expected. Disconnecting clients.", {draftId});
            for (let room of [roomHost, roomGuest, roomSpec]) {
                socket.nsp.in(room).clients((error: any, clientIds: string[]) => {
                    if (error) throw error;
                    for (let clientId of clientIds) {
                        socket.nsp.connected[clientId].disconnect(true);
                    }
                });
            }
            const draft = draftsStore.getDraftOrThrow(draftId);
            draft.startTimestamp = 0;
            draft.hostConnected = false;
            draft.guestConnected = false;
            logger.info("Saving draft: %s", JSON.stringify(draft), {draftId});
            fs.writeFile(`data/${draftId}.json`, JSON.stringify(draft), (err) => {
                if (err) throw err;
                logger.info( `Draft saved to data/${draftId}.json`, {draftId});
                draftsStore.finishDraft(draftId);
            });
        }
    }
};
