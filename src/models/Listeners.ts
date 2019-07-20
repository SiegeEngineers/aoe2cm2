import {DraftEvent} from "./DraftEvent";
import PlayerEvent from "./PlayerEvent";
import {DraftsStore} from "./DraftsStore";
import {ValidationId} from "./ValidationId";
import socketio from "socket.io";
import {Util} from "./Util";
import Player from "./Player";
import ActionType, {actionTypeFromAction} from "./ActionType";
import DraftViews from "./DraftViews";
import fs from "fs";

export const Listeners = {

    actListener(draftsStore: DraftsStore, draftId: string, validateAndApply: (draftId: string, message: DraftEvent) => ValidationId[], socket: socketio.Socket, roomHost: string, roomGuest: string, roomSpec: string) {
        return (message: PlayerEvent, fn: (retval: any) => void) => {
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

                let adminEventCounter = 0;
                while (this.nextActionIsAdminEvent(draftsStore, draftId, adminEventCounter)) {
                    adminEventCounter++;
                    this.scheduleAdminEvent(adminEventCounter, draftsStore, draftId, draftViews, socket, roomHost, roomGuest, roomSpec);
                }
                if (draftViews.shouldRestartOrCancelCountdown()) {
                    draftsStore.restartOrCancelCountdown(draftId);
                }
                if (!draftViews.getActualDraft().hasNextAction()) {
                    console.log('disconnecting clients');
                    for (let room of [roomHost, roomGuest, roomSpec]) {
                        socket.nsp.in(room).clients((error: any, clientIds: string[]) => {
                            if (error) throw error;
                            for (let clientId of clientIds) {
                                socket.nsp.connected[clientId].disconnect(true);
                            }
                        });
                    }
                    console.log('saving draft', draftId, draftsStore.getDraftOrThrow(draftId));
                    fs.writeFile(`data/${draftId}.json`, JSON.stringify(draftsStore.getDraftOrThrow(draftId)), (err) => {
                        if (err) throw err;
                        console.log(`Draft saved to data/${draftId}.json`);
                        draftsStore.removeDraft(draftId);
                    });
                }
            } else {
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
    scheduleAdminEvent: function (adminEventCounter: number, draftsStore: DraftsStore, draftId: string, draftViews: DraftViews, socket: socketio.Socket, roomHost: string, roomGuest: string, roomSpec: string) {
        const expectedActions = draftsStore.getExpectedActions(draftId, adminEventCounter - 1);
        const expectedAction = expectedActions[0];
        if (expectedAction.player === Player.NONE) { // Admin Event
            if (actionTypeFromAction(expectedAction.action) === ActionType.REVEAL) {
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
                    draftsStore.addDraftEvent(draftId, expectedAction);
                    draftsStore.restartOrCancelCountdown(draftId);
                }, adminEventCounter * 2000);
            } else {
                throw new Error("Unknown expected action! " + expectedAction);
            }
        }
    }
};
