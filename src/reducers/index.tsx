import {Action} from '../actions';
import {IStoreState} from '../types';
import Player from "../models/Player";
import {Actions} from "../constants";
import {default as i18n} from "../i18n";
import NameGenerator from "../models/NameGenerator";
import AdminEvent from "../models/AdminEvent";
import Preset from "../models/Preset";
import {CivilisationEncoder} from "../models/CivilisationEncoder";

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
    showModal: false,
    countdownValue: 0,
    countdownVisible: false,
    editorPreset: null
};

export function updateState(state: IStoreState = initialState, action?: Action): IStoreState {
    if (!action) return state;
    switch (action.type) {
        case Actions.ACTION_COMPLETED:
            console.log(Actions.ACTION_COMPLETED, state.nextAction + 1);
            const eventsCopy = [...state.events];
            eventsCopy.push(action.value);
            return {
                ...state,
                nextAction: state.nextAction + 1,
                events: eventsCopy
            };
        case Actions.SET_NAME:
            console.log(Actions.SET_NAME, action);
            if (action.player === Player.HOST) {
                return {...state, nameHost: action.value};
            } else if (action.player === Player.GUEST) {
                return {...state, nameGuest: action.value};
            } else {
                return state;
            }
        case Actions.SET_READY:
            console.log(Actions.SET_READY, action);
            if (action.player === Player.HOST) {
                return {...state, hostReady: true};
            } else if (action.player === Player.GUEST) {
                return {...state, guestReady: true};
            } else {
                return state;
            }
        case Actions.CHANGE_OWN_NAME:
            console.log(Actions.CHANGE_OWN_NAME, action);
            NameGenerator.writeNameToLocalStorage(action.value);
            return {...state, ownName: action.value, showModal: action.value === null};
        case Actions.APPLY_CONFIG:
            console.log(Actions.APPLY_CONFIG, action.value);
            const preset = Preset.fromPojo(action.value.preset);
            return {
                ...state,
                events: action.value.events,
                nameGuest: action.value.nameGuest,
                nameHost: action.value.nameHost,
                nextAction: action.value.events.length,
                whoAmI: action.value.yourPlayerType,
                hostReady: action.value.hostReady,
                guestReady: action.value.guestReady,
                preset
            };
        case Actions.SET_EVENTS:
            console.log(Actions.SET_EVENTS, action.value);
            const eventsCopy2 = [...action.value.events];
            eventsCopy2.push(new AdminEvent(action.value.player, action.value.action));
            return {
                ...state,
                nextAction: state.nextAction + 1,
                events: eventsCopy2,
            };

        case Actions.SET_LANGUAGE:
            console.log(Actions.SET_LANGUAGE, action.language);
            i18n.changeLanguage(action.language);
            return {
                ...state,
                language: action.language
            };

        case Actions.COUNTDOWN:
            console.log(Actions.COUNTDOWN, action.value);
            return {
                ...state,
                countdownValue: action.value.value,
                countdownVisible: action.value.display
            };

        case Actions.SHOW_NAME_MODAL:
            console.log(Actions.SHOW_NAME_MODAL);
            return {
                ...state,
                showModal: true
            };

        case Actions.REPLAY:
            console.log(Actions.REPLAY, action.value);
            const draft = action.value;
            draft.preset = Preset.fromPojo(draft.preset);
            return {
                ...state,
                ...draft
            };

        case Actions.SET_EDITOR_PRESET:
            console.log(Actions.SET_EDITOR_PRESET, action.value);
            return {
                ...state,
                editorPreset: action.value
            };

        case Actions.SET_EDITOR_TURN:
            console.log(Actions.SET_EDITOR_TURN, action.value, action.index);
            const editorPreset = state.editorPreset;
            if (editorPreset === null) {
                return state;
            } else {
                if (action.value === null) {
                    if (editorPreset.turns.length > action.index) {
                        editorPreset.turns.splice(action.index, 1);
                    }
                } else if (editorPreset.turns.length <= action.index) {
                    editorPreset.turns.push(action.value);
                } else {
                    editorPreset.turns[action.index] = action.value;
                }
                return {
                    ...state,
                    editorPreset: Preset.fromPojo(editorPreset) as Preset
                };
            }

        case Actions.SET_EDITOR_NAME:
            console.log(Actions.SET_EDITOR_NAME, action.value);
            if (state.editorPreset === null) {
                return state;
            } else {
                return {
                    ...state,
                    editorPreset: new Preset(action.value, state.editorPreset.civilisations, state.editorPreset.turns)
                };
            }

        case Actions.SET_EDITOR_CIVILISATIONS:
            console.log(Actions.SET_EDITOR_CIVILISATIONS, action.value);
            if (state.editorPreset === null) {
                return state;
            } else {
                return {
                    ...state,
                    editorPreset: new Preset(state.editorPreset.name, CivilisationEncoder.decodeCivilisationArray(action.value), state.editorPreset.turns)
                };
            }

    }
    return state;
}
