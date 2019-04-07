import {Action} from '../actions';
import {IStoreState} from '../types';
import Player from "../models/Player";
import {Actions} from "../constants";
import {default as i18n} from "../i18n";
import NameGenerator from "../models/NameGenerator";
import AdminEvent from "../models/AdminEvent";

const initialState: IStoreState = {
    nameHost: "…",
    nameGuest: "…",
    hostReady: false,
    guestReady: false,
    whoAmI: undefined,
    ownName: NameGenerator.getNameFromLocalStorage(),
    preset: undefined,
    nextAction: 0,
    events: [],
    language: i18n.language,
    showModal: (NameGenerator.getNameFromLocalStorage() === null)
};

export function updateState(state: IStoreState = initialState, action?: Action): IStoreState {
    if (!action) return state;
    switch (action.type) {
        case Actions.ACTION_COMPLETED:
            console.log(Actions.ACTION_COMPLETED, state.nextAction + 1);
            const eventsCopy = [...state.events];
            eventsCopy.push(action.value);
            return {...state, nextAction: state.nextAction + 1, events: eventsCopy};
        case Actions.SET_NAME:
            console.log(Actions.SET_NAME, action);
            if (action.player === Player.HOST) {
                return {...state, nameHost: action.value, hostReady: true};
            } else if (action.player === Player.GUEST) {
                return {...state, nameGuest: action.value, guestReady: true};
            } else {
                return state;
            }
        case Actions.CHANGE_OWN_NAME:
            console.log(Actions.CHANGE_OWN_NAME, action);
            NameGenerator.writeNameToLocalStorage(action.value);
            return {...state, ownName: action.value, showModal: action.value === null};
        case Actions.APPLY_CONFIG:
            console.log(Actions.APPLY_CONFIG, action.value);
            return {
                ...state,
                events: action.value.events,
                nameGuest: action.value.nameGuest,
                nameHost: action.value.nameHost,
                nextAction: action.value.events.length,
                whoAmI: action.value.yourPlayerType,
                hostReady: action.value.hostReady,
                guestReady: action.value.guestReady
            };
        case Actions.SET_EVENTS:
            console.log(Actions.SET_EVENTS, action.value);
            const eventsCopy2 = [...action.value.events];
            eventsCopy2.push(new AdminEvent(action.value.player, action.value.action));
            return {...state, nextAction: state.nextAction + 1, events: eventsCopy2};

        case Actions.SET_LANGUAGE:
            console.log(Actions.SET_LANGUAGE, action.language);
            i18n.changeLanguage(action.language);
            return {
                ...state,
                language: action.language
            }
    }
    return state;
}
