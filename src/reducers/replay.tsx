import {IReplayState} from "../types";
import {ReplayAction} from "../actions";
import {ClientActions, ReplayActions, ServerActions} from "../constants";

export const initialReplayState: IReplayState = {
    events: [],
    countdownInterval: null,
    stopCountdown: null,
    eventTimeouts: [],
};

export const replayReducer = (state: IReplayState = initialReplayState, action: ReplayAction) => {
    switch (action.type) {
        case ServerActions.APPLY_REPLAY:
            console.log(ServerActions.APPLY_REPLAY, action.value);
            const draft = action.value;
            return {
                ...state,
                events: draft.events
            };
        case ClientActions.DISCONNECT_FROM_SERVER:
            console.log(ClientActions.DISCONNECT_FROM_SERVER, action);
            if (state.countdownInterval !== null) {
                clearInterval(state.countdownInterval);
            }
            if (state.stopCountdown !== null) {
                clearTimeout(state.stopCountdown);
            }
            if (state.eventTimeouts.length > 0) {
                for (let eventTimeout of state.eventTimeouts) {
                    clearTimeout(eventTimeout);
                }
            }
            return {...initialReplayState};
        case ReplayActions.SET_COUNTDOWN_INTERVAL:
            console.log(ReplayActions.SET_COUNTDOWN_INTERVAL, action);
            return {...state, countdownInterval: action.value};
        case ReplayActions.SET_EVENT_TIMEOUTS:
            console.log(ReplayActions.SET_EVENT_TIMEOUTS, action);
            return {...state, eventTimeouts: action.value};
        case ReplayActions.SET_STOP_COUNTDOWN:
            console.log(ReplayActions.SET_STOP_COUNTDOWN, action);
            return {...state, stopCountdown: action.value};
    }
    return state;
};