import {Actions, ClientActions, ServerActions} from '../constants';
import Player from "../constants/Player";
import {default as ModelAction} from "../constants/Action";
import {DraftEvent} from "../types/DraftEvent";
import {IDraftConfig} from "../types/IDraftConfig";
import PlayerEvent from "../models/PlayerEvent";
import {ICountdownValues, IDraftState} from "../types";
import Preset from "../models/Preset";
import Turn from "../models/Turn";

export interface IActionCompleted {
    type: ServerActions.ACTION_COMPLETED,
    value: DraftEvent
}

export interface IApplyConfig {
    type: ServerActions.APPLY_CONFIG,
    value: IDraftConfig
}

export interface IConnectPlayer {
    player: Player,
    type: ServerActions.CONNECT_PLAYER,
    value: string
}

export interface ISetReady {
    player: Player,
    type: ServerActions.SET_READY
}

export interface IChangeOwnName {
    type: Actions.CHANGE_OWN_NAME,
    value: string
}

export interface ISetOwnRole {
    type: Actions.SET_OWN_ROLE,
    value: Player
}

export interface ISetRole {
    type: ClientActions.SET_ROLE,
    name: string,
    role: Player
}

export interface ISendReady {
    type: ClientActions.SEND_READY
}

export interface IClickOnCiv {
    type: ClientActions.CLICK_CIVILISATION,
    playerEvent: PlayerEvent,
    callback: any
}

export interface ISetLanguage {
    type: Actions.SET_LANGUAGE,
    language: string
}

export interface ISetEvents {
    type: ServerActions.SET_EVENTS,
    value: { player: Player, action: ModelAction, events: DraftEvent[] }
}

export interface ICountdownEvent {
    type: ServerActions.COUNTDOWN,
    value: ICountdownValues
}

export interface IConnect {
    type: ClientActions.CONNECT
}

export interface IDisconnect {
    type: ClientActions.DISCONNECT
}

export interface IShowNameModal {
    type: Actions.SHOW_NAME_MODAL
}

export interface IShowRoleModal {
    type: Actions.SHOW_ROLE_MODAL
}

export interface IReplayEvent {
    type: ServerActions.REPLAY
    value: IDraftState
}

export interface ISetEditorPreset {
    type: Actions.SET_EDITOR_PRESET
    value: Preset
}

export interface ISetEditorTurn {
    type: Actions.SET_EDITOR_TURN
    value: Turn | null,
    index: number
}

export interface ISetEditorName {
    type: Actions.SET_EDITOR_NAME
    value: string
}

export interface ISetEditorCivilisations {
    type: Actions.SET_EDITOR_CIVILISATIONS
    value: string
}


export type DraftAction = IConnectPlayer
    | ISetReady
    | IActionCompleted
    | IApplyConfig
    | ISetRole
    | ISendReady
    | IClickOnCiv
    | ISetEvents
    | IConnect
    | IDisconnect
    | IReplayEvent;

export type DraftCountdownAction = ICountdownEvent;

export type DraftOwnPropertiesAction = IApplyConfig
    | IChangeOwnName
    | ISetOwnRole
    | IActionCompleted
    | ISetEvents
    | IReplayEvent;

export type LanguageAction = ISetLanguage;

export type ModalAction = IShowNameModal
    | IShowRoleModal
    | IChangeOwnName
    | ISetOwnRole;

export type PresetEditorAction = ISetEditorPreset
    | ISetEditorTurn
    | ISetEditorName
    | ISetEditorCivilisations;

export type Action = DraftAction
    | DraftCountdownAction
    | DraftOwnPropertiesAction
    | LanguageAction
    | ModalAction
    | PresetEditorAction;

export function connectPlayer(player: Player, value: string): IConnectPlayer {
    return {
        player,
        type: ServerActions.CONNECT_PLAYER,
        value
    }
}

export function setReady(player: Player): ISetReady {
    return {
        player,
        type: ServerActions.SET_READY
    }
}

export function changeOwnName(value: string): IChangeOwnName {
    return {
        type: Actions.CHANGE_OWN_NAME,
        value
    }
}

export function setOwnRole(value: Player): ISetOwnRole {
    return {
        type: Actions.SET_OWN_ROLE,
        value
    }
}

export function act(value: DraftEvent): IActionCompleted {
    return {
        type: ServerActions.ACTION_COMPLETED,
        value
    }
}

export function applyConfig(value: IDraftConfig): IApplyConfig {
    return {
        type: ServerActions.APPLY_CONFIG,
        value
    }
}

export function setRole(name: string, role: Player): ISetRole {
    return {
        name,
        role,
        type: ClientActions.SET_ROLE
    }
}

export function sendReady(): ISendReady {
    return {
        type: ClientActions.SEND_READY
    }
}

export function showNameModal(): IShowNameModal {
    return {
        type: Actions.SHOW_NAME_MODAL
    }
}

export function showRoleModal(): IShowRoleModal {
    return {
        type: Actions.SHOW_ROLE_MODAL
    }
}

export function clickOnCiv(playerEvent: PlayerEvent, callback: any): IClickOnCiv {
    return {
        callback,
        playerEvent,
        type: ClientActions.CLICK_CIVILISATION
    }
}

export function setLanguage(language: string): ISetLanguage {
    return {
        language,
        type: Actions.SET_LANGUAGE
    }
}

export function setEvents(value: { player: Player, action: ModelAction, events: DraftEvent[] }): ISetEvents {
    return {
        value,
        type: ServerActions.SET_EVENTS
    }
}

export function connect(): IConnect {
    return {
        type: ClientActions.CONNECT
    }
}

export function disconnect(): IDisconnect {
    return {
        type: ClientActions.DISCONNECT
    }
}

export function replay(value: IDraftState): IReplayEvent {
    return {
        value,
        type: ServerActions.REPLAY
    }
}

export function setEditorPreset(value: Preset): ISetEditorPreset {
    return {
        value,
        type: Actions.SET_EDITOR_PRESET
    }
}

export function setEditorTurn(value: Turn | null, index: number): ISetEditorTurn {
    return {
        value,
        index,
        type: Actions.SET_EDITOR_TURN
    }
}

export function setEditorName(value: string): ISetEditorName {
    return {
        value,
        type: Actions.SET_EDITOR_NAME
    }
}

export function setEditorCivilisations(value: string): ISetEditorCivilisations {
    return {
        value,
        type: Actions.SET_EDITOR_CIVILISATIONS
    }
}
