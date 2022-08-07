import {IDraftOwnPropertiesState} from "../types";
import {DraftOwnPropertiesAction} from "../actions";
import {Actions, ClientActions, ServerActions} from "../constants";
import NameGenerator from "../util/NameGenerator";
import Player from "../constants/Player";

export const initialDraftOwnPropertiesState: IDraftOwnPropertiesState = {
    whoAmI: undefined,
    ownName: NameGenerator.getNameFromLocalStorage(),
    nextAction: 0,
    highlightedAction: null,
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
        case ServerActions.EXECUTE_ACTION:
            console.log(ServerActions.EXECUTE_ACTION, state.nextAction + 1);
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
        case Actions.SET_DRAFT_EVENTS:
            console.log(Actions.SET_DRAFT_EVENTS, action.value);
            return {
                ...state,
                nextAction: action.value.length,
            };
        case Actions.SET_OWN_NAME:
            console.log(Actions.SET_OWN_NAME, action);
            NameGenerator.writeNameToLocalStorage(action.value);
            return {...state, ownName: action.value};
        case Actions.SET_OWN_ROLE:
            console.log(Actions.SET_OWN_ROLE, action);
            return {...state, whoAmI: action.value};
        case ClientActions.DISCONNECT_FROM_SERVER:
            console.log(ClientActions.DISCONNECT_FROM_SERVER, action);
            return {...initialDraftOwnPropertiesState};
        case ServerActions.APPLY_REPLAY:
            console.log(ServerActions.APPLY_REPLAY, action.value);
            return {
                ...state,
                whoAmI: Player.NONE,
                nextAction: action.value.events.length
            };
        case Actions.SET_HIGHLIGHTED_ACTION:
            console.log(Actions.SET_HIGHLIGHTED_ACTION, action.value);
            return {
                ...state,
                highlightedAction: action.value,
            };
    }
    return state;
};