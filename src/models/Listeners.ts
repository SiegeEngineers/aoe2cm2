import Action from "./Action";
import {DraftEvent} from "./DraftEvent";
import PlayerEvent from "./PlayerEvent";
import {DraftsStore} from "./DraftsStore";
import {ValidationId} from "./ValidationId";
import socketio from "socket.io";
import {Util} from "./Util";
import Player from "./Player";

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

                const expectedActions = draftsStore.getExpectedActions(draftId);
                if (expectedActions.length > 0) {
                    for (let expectedAction of expectedActions) {
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
                                    draftsStore.restartOrCancelCountdown(draftId);
                                }, 2000);
                            } else {
                                throw new Error("Unknown expected action! " + expectedAction);
                            }
                        }
                    }
                }
                if (draftViews.shouldRestartOrCancelCountdown()) {
                    draftsStore.restartOrCancelCountdown(draftId);
                }
            } else {
                fn({status: 'error', validationErrors});
            }
        };
    }
};
