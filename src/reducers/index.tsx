import {Action} from '../actions';
import {IStoreState} from '../types';
import Player from "../models/Player";
import {Actions} from "../constants";

export function updateState(state: IStoreState, action: Action): IStoreState {
    switch (action.type) {
        case Actions.ACTION_COMPLETED:
            console.log(Actions.ACTION_COMPLETED, state.nextAction + 1);
            const eventsCopy = [...state.events];
            eventsCopy.push(action.value);
            return {...state, nextAction: state.nextAction + 1, events: eventsCopy};
        case Actions.SET_NAME:
            console.log(Actions.SET_NAME, action.value);
            if (action.player === Player.HOST) {
                return {...state, nameHost: action.value};
            } else if (action.player === Player.GUEST) {
                return {...state, nameGuest: action.value};
            } else {
                return state;
            }
        case Actions.APPLY_CONFIG:
            console.log(Actions.APPLY_CONFIG, action.value);
            return {
                ...state,
                events: action.value.events,
                nameGuest: action.value.nameGuest,
                nameHost: action.value.nameHost,
                nextAction: action.value.nextAction,
                whoAmI: action.value.yourPlayerType
            };

    }
    return state;
}