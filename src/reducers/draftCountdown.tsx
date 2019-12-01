import {ICountdownState} from "../types";
import {DraftCountdownAction} from "../actions";
import {Actions} from "../constants";

export const initialDraftCountdownState: ICountdownState = {
    countdownValue: 0,
    countdownVisible: false
};

export const draftCountdownReducer = (state: ICountdownState = initialDraftCountdownState, action: DraftCountdownAction) => {
    if (action.type === Actions.COUNTDOWN) {
        console.log(Actions.COUNTDOWN, action.value);
        return {
            ...state,
            countdownValue: action.value.value,
            countdownVisible: action.value.display
        };

    } else {
        return state;
    }
};