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
    type: ServerActions.EXECUTE_ACTION,
    value: DraftEvent
}

export interface IApplyConfig {
    type: ServerActions.APPLY_CONFIG,
    value: IDraftConfig
}

export interface IConnectPlayer {
    player: Player,
    type: ServerActions.SET_PLAYER_CONNECTED,
    value: string
}

export interface ISetPlayerName {
    player: Player,
    type: ServerActions.SET_PLAYER_NAME,
    value: string
}

export interface ISetReady {
    player: Player,
    type: ServerActions.SET_READY
}

export interface IChangeOwnName {
    type: Actions.SET_OWN_NAME,
    value: string
}

export interface ISetOwnRole {
    type: Actions.SET_OWN_ROLE,
    value: Player
}

export interface ISetRole {
    type: ClientActions.SEND_SET_ROLE,
    name: string,
    role: Player
}

export interface ISetName {
    type: ClientActions.SEND_SET_NAME,
    name: string
}

export interface ISendReady {
    type: ClientActions.SEND_READY
}

export interface IClickOnCiv {
    type: ClientActions.SEND_CLICK_PANEL,
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
    type: ServerActions.SET_COUNTDOWN_VALUE,
    value: ICountdownValues
}

export interface IConnect {
    type: ClientActions.CONNECT_TO_SERVER
}

export interface IDisconnect {
    type: ClientActions.DISCONNECT_FROM_SERVER
}

export interface IShowNameModal {
    type: Actions.SHOW_NAME_MODAL
}

export interface IShowRoleModal {
    type: Actions.SHOW_ROLE_MODAL
}

export interface IReplayEvent {
    type: ServerActions.APPLY_REPLAY
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
    | ISetPlayerName
    | ISetReady
    | IActionCompleted
    | IApplyConfig
    | ISetRole
    | ISetName
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
        type: ServerActions.SET_PLAYER_CONNECTED,
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
        type: Actions.SET_OWN_NAME,
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
        type: ServerActions.EXECUTE_ACTION,
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
        type: ClientActions.SEND_SET_ROLE
    }
}

export function setName(name: string): ISetName {
    return {
        name,
        type: ClientActions.SEND_SET_NAME
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
        type: ClientActions.SEND_CLICK_PANEL
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
        type: ClientActions.CONNECT_TO_SERVER
    }
}

export function disconnect(): IDisconnect {
    return {
        type: ClientActions.DISCONNECT_FROM_SERVER
    }
}

export function replay(value: IDraftState): IReplayEvent {
    return {
        value,
        type: ServerActions.APPLY_REPLAY
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
