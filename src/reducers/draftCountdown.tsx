import {ICountdownState} from "../types";
import {DraftCountdownAction} from "../actions";
import {ServerActions} from "../constants";

export const initialDraftCountdownState: ICountdownState = {
    countdownValue: 0,
    countdownVisible: false
};

export const draftCountdownReducer = (state: ICountdownState = initialDraftCountdownState, action: DraftCountdownAction) => {
    if (action.type === ServerActions.COUNTDOWN) {
        console.log(ServerActions.COUNTDOWN, action.value);
        return {
            ...state,
            countdownValue: action.value.value,
            countdownVisible: action.value.display
        };

    } else {
        return state;
    }
};