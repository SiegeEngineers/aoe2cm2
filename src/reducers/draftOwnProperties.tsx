import {IDraftOwnPropertiesState} from "../types";
import {DraftOwnPropertiesAction} from "../actions";
import {Actions, ServerActions} from "../constants";
import NameGenerator from "../util/NameGenerator";
import Player from "../constants/Player";

export const initialDraftOwnPropertiesState: IDraftOwnPropertiesState = {
    whoAmI: undefined,
    ownName: NameGenerator.getNameFromLocalStorage(),
    nextAction: 0,
};

export const draftOwnPropertiesReducer = (state: IDraftOwnPropertiesState = initialDraftOwnPropertiesState, action: DraftOwnPropertiesAction) => {
    switch (action.type) {
        case ServerActions.APPLY_CONFIG:
            console.log(ServerActions.APPLY_CONFIG, action.value);
            const whoAmIValue = (state.whoAmI === undefined) ? undefined : action.value.yourPlayerType;
            return {
                ...state,
                nextAction: action.value.events.length,
                whoAmI: whoAmIValue,
            };
        case ServerActions.ACTION_COMPLETED:
            console.log(ServerActions.ACTION_COMPLETED, state.nextAction + 1);
            return {
                ...state,
                nextAction: state.nextAction + 1,
            };
        case ServerActions.SET_EVENTS:
            console.log(ServerActions.SET_EVENTS, action.value);
            return {
                ...state,
                nextAction: state.nextAction + 1,
            };
        case Actions.CHANGE_OWN_NAME:
            console.log(Actions.CHANGE_OWN_NAME, action);
            NameGenerator.writeNameToLocalStorage(action.value);
            return {...state, ownName: action.value};
        case Actions.SET_OWN_ROLE:
            console.log(Actions.SET_OWN_ROLE, action);
            return {...state, whoAmI: action.value};

        case ServerActions.REPLAY:
            console.log(ServerActions.REPLAY, action.value);
            return {
                ...state,
                whoAmI: Player.NONE,
                nextAction: action.value.events.length
            };
    }
    return state;
};