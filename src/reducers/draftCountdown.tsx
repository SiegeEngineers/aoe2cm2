import {ICountdownState} from "../types";
import {DraftCountdownAction} from "../actions";
import {ServerActions} from "../constants";

export const initialDraftCountdownState: ICountdownState = {
    countdownValue: 0,
    countdownVisible: false
};

export const draftCountdownReducer = (state: ICountdownState = initialDraftCountdownState, action: DraftCountdownAction) => {
    if (action.type === ServerActions.SET_COUNTDOWN_VALUE) {
        console.log(ServerActions.SET_COUNTDOWN_VALUE, action.value);
        return {
            ...state,
            countdownValue: action.value.value,
            countdownVisible: action.value.display
        };

    } else {
        return state;
    }
};