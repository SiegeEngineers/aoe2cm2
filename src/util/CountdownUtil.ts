import {Action} from "../actions";
import {ServerActions} from "../constants";
import PlayerEvent from "../models/PlayerEvent";
import {ApplicationState} from "../types";
import {CountdownProperties} from "../models/CountdownProperties";
import AdminEvent from "../models/AdminEvent";
import DraftViews from "../models/DraftViews";
import {DraftEvent} from "../types/DraftEvent";
import {Util} from "./Util";

export const CountdownUtil = {

    scheduleDraftEvent(countdownProperties: CountdownProperties, storeAPI: { dispatch: (action: Action) => void; getState: () => ApplicationState }, draftViews: DraftViews, event: PlayerEvent | AdminEvent) {
        setTimeout(() => {
            CountdownUtil.startCountdown(countdownProperties, storeAPI);
            if (Util.isAdminEvent(event)) {
                draftViews.reveal(event.action);
                storeAPI.dispatch({
                    type: ServerActions.SET_EVENTS,
                    value: {player: event.player, action: event.action, events: draftViews.specEvents}
                });
                draftViews.addDraftEvent(event);
            } else {
                draftViews.addDraftEvent(event);
                storeAPI.dispatch({type: ServerActions.EXECUTE_ACTION, value: draftViews.getLastEventForSpec()});
            }
        }, event.offset);
    },

    startCountdown(countdownProperties: CountdownProperties, storeAPI: { dispatch: (action: Action) => void; getState: () => ApplicationState }) {
        if (countdownProperties.interval !== null) {
            clearInterval(countdownProperties.interval);
        }
        countdownProperties.resetValue();
        CountdownUtil.setCountdownValue(storeAPI, countdownProperties);
        countdownProperties.interval = setInterval(() => {
            countdownProperties.decrement();
            CountdownUtil.setCountdownValue(storeAPI, countdownProperties);
        }, 1000);
    },

    setCountdownValue(storeAPI: { dispatch: (action: Action) => void; getState: () => ApplicationState }, countdownValue: CountdownProperties) {
        storeAPI.dispatch({
            type: ServerActions.SET_COUNTDOWN_VALUE,
            value: {display: true, value: countdownValue.value}
        });
    },

    scheduleStopCountdown(storeAPI: { dispatch: (action: Action) => void; getState: () => ApplicationState }, countdownProperties: CountdownProperties, events: DraftEvent[]) {
        setTimeout(() => {
            storeAPI.dispatch({
                type: ServerActions.SET_COUNTDOWN_VALUE,
                value: {display: false, value: 0}
            });
            clearInterval(countdownProperties.interval as NodeJS.Timeout);
        }, events[events.length - 1].offset);
    }
};
