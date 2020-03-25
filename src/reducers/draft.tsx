import {IDraftState} from "../types";
import {DraftAction} from "../actions";
import {ServerActions} from "../constants";
import Preset from "../models/Preset";
import Player from "../constants/Player";
import AdminEvent from "../models/AdminEvent";

export const initialDraftState: IDraftState = {
    nameHost: "…",
    nameGuest: "…",
    hostReady: false,
    guestReady: false,
    hostConnected: false,
    guestConnected: false,
    preset: Preset.EMPTY,
    events: [],
};

export const draftReducer = (state: IDraftState = initialDraftState, action: DraftAction) => {
    switch (action.type) {
        case ServerActions.ACTION_COMPLETED:
            console.log(ServerActions.ACTION_COMPLETED);
            const eventsCopy = [...state.events];
            eventsCopy.push(action.value);
            return {
                ...state,
                events: eventsCopy
            };
        case ServerActions.CONNECT_PLAYER:
            console.log(ServerActions.CONNECT_PLAYER, action);
            if (action.player === Player.HOST) {
                return {...state, nameHost: action.value, hostConnected: true};
            } else if (action.player === Player.GUEST) {
                return {...state, nameGuest: action.value, guestConnected: true};
            } else {
                return state;
            }
        case ServerActions.SET_READY:
            console.log(ServerActions.SET_READY, action);
            if (action.player === Player.HOST) {
                return {...state, hostReady: true};
            } else if (action.player === Player.GUEST) {
                return {...state, guestReady: true};
            } else {
                return state;
            }
        case ServerActions.APPLY_CONFIG:
            console.log(ServerActions.APPLY_CONFIG, action.value);
            const preset = Preset.fromPojo(action.value.preset);
            return {
                ...state,
                events: action.value.events,
                nameGuest: action.value.nameGuest,
                nameHost: action.value.nameHost,
                hostConnected: action.value.hostConnected,
                guestConnected: action.value.guestConnected,
                hostReady: action.value.hostReady,
                guestReady: action.value.guestReady,
                preset
            };
        case ServerActions.SET_EVENTS:
            console.log(ServerActions.SET_EVENTS, action.value);
            const eventsCopy2 = [...action.value.events];
            eventsCopy2.push(new AdminEvent(action.value.player, action.value.action));
            return {
                ...state,
                events: eventsCopy2,
            };

        case ServerActions.REPLAY:
            console.log(ServerActions.REPLAY, action.value);
            const draft = action.value;
            draft.preset = Preset.fromPojo(draft.preset);
            return {
                ...state,
                ...draft
            };
    }
    return state;
};