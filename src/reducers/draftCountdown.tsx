import {ICountdownState} from "../types";
import {DraftCountdownAction} from "../actions";
import {ClientActions, ServerActions} from "../constants";

export const initialDraftCountdownState: ICountdownState = {
    countdownValue: 0,
    countdownVisible: false
};

export const draftCountdownReducer = (state: ICountdownState = initialDraftCountdownState, action: DraftCountdownAction) => {
    switch (action.type) {
        case ServerActions.SET_COUNTDOWN_VALUE:
            console.log(ServerActions.SET_COUNTDOWN_VALUE, action.value);
            return {
                ...state,
                countdownValue: action.value.value,
                countdownVisible: action.value.display
            };
        case ClientActions.DISCONNECT_FROM_SERVER:
            console.log(ClientActions.DISCONNECT_FROM_SERVER, action);
            return {...initialDraftCountdownState};
    }
    return state;
};