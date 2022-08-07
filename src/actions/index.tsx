import {Actions, ClientActions, ReplayActions, ServerActions} from '../constants';
import Player from "../constants/Player";
import {default as ModelAction} from "../constants/Action";
import {DraftEvent} from "../types/DraftEvent";
import {IDraftConfig} from "../types/IDraftConfig";
import PlayerEvent from "../models/PlayerEvent";
import {ICountdownValues, IDraftState} from "../types";
import Preset from "../models/Preset";
import Turn from "../models/Turn";
import {ColorScheme} from "../constants/ColorScheme";
import DraftOption from "../models/DraftOption";

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

export interface ISetIconStyle {
    type: Actions.SET_ICON_STYLE,
    iconStyle: string
}

export interface ISetColorScheme {
    type: Actions.SET_COLOR_SCHEME,
    colorScheme: ColorScheme
}

export interface ISetEvents {
    type: ServerActions.SET_EVENTS,
    value: { player: Player, action: ModelAction, events: DraftEvent[] }
}

export interface ISetDraftEvents {
    type: Actions.SET_DRAFT_EVENTS,
    value: DraftEvent[]
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

export interface ISetCountdownInterval {
    type: ReplayActions.SET_COUNTDOWN_INTERVAL
    value: NodeJS.Timeout | null
}

export interface ISetEventTimeouts {
    type: ReplayActions.SET_EVENT_TIMEOUTS
    value: NodeJS.Timeout[]
}

export interface ISetStopCountdown {
    type: ReplayActions.SET_STOP_COUNTDOWN
    value: NodeJS.Timeout | null
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

export interface ISetEditorTurnOrder {
    type: Actions.SET_EDITOR_TURN_ORDER
    turns: Turn[]
}

export interface ISetEditorName {
    type: Actions.SET_EDITOR_NAME
    value: string
}

export interface ISetEditorDraftOptions {
    type: Actions.SET_EDITOR_DRAFT_OPTIONS
    value: DraftOption[]
}

export interface ISetHighlightedAction {
    type: Actions.SET_HIGHLIGHTED_ACTION,
    value: number | null;
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
    | ISetDraftEvents
    | IConnect
    | IDisconnect
    | IReplayEvent;

export type ReplayAction = IDisconnect
    | IReplayEvent
    | ISetCountdownInterval
    | ISetEventTimeouts
    | ISetStopCountdown;

export type DraftCountdownAction = ICountdownEvent
    | IDisconnect;

export type DraftOwnPropertiesAction = IApplyConfig
    | IChangeOwnName
    | ISetOwnRole
    | IActionCompleted
    | ISetEvents
    | ISetDraftEvents
    | IReplayEvent
    | IDisconnect
    | ISetHighlightedAction;

export type LanguageAction = ISetLanguage;

export type IconStyleAction = ISetIconStyle;

export type ColorSchemeAction = ISetColorScheme;

export type ModalAction = IShowNameModal
    | IShowRoleModal
    | IChangeOwnName
    | ISetOwnRole;

export type PresetEditorAction = ISetEditorPreset
    | ISetEditorTurn
    | ISetEditorTurnOrder
    | ISetEditorName
    | ISetEditorDraftOptions;

export type Action = DraftAction
    | ReplayAction
    | DraftCountdownAction
    | DraftOwnPropertiesAction
    | LanguageAction
    | IconStyleAction
    | ColorSchemeAction
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

export function setIconStyle(iconStyle: string): ISetIconStyle {
    return {
        iconStyle,
        type: Actions.SET_ICON_STYLE
    }
}

export function setColorScheme(colorScheme: ColorScheme): ISetColorScheme {
    return {
        colorScheme,
        type: Actions.SET_COLOR_SCHEME
    }
}
export function setEvents(value: { player: Player, action: ModelAction, events: DraftEvent[] }): ISetEvents {
    return {
        value,
        type: ServerActions.SET_EVENTS
    }
}

export function setDraftEvents(value: DraftEvent[]): ISetDraftEvents {
    return {
        value,
        type: Actions.SET_DRAFT_EVENTS
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

export function setCountdownInterval(value: NodeJS.Timeout | null): ISetCountdownInterval {
    return {
        type: ReplayActions.SET_COUNTDOWN_INTERVAL,
        value
    }
}

export function setEventTimeouts(value: NodeJS.Timeout[]): ISetEventTimeouts {
    return {
        type: ReplayActions.SET_EVENT_TIMEOUTS,
        value
    }
}

export function setStopCountdown(value: NodeJS.Timeout | null): ISetStopCountdown {
    return {
        type: ReplayActions.SET_STOP_COUNTDOWN,
        value
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

export function setEditorTurnOrder(turns: Turn[]): ISetEditorTurnOrder {
    return {
        turns,
        type: Actions.SET_EDITOR_TURN_ORDER
    }
}

export function setEditorName(value: string): ISetEditorName {
    return {
        value,
        type: Actions.SET_EDITOR_NAME
    }
}

export function setEditorDraftOptions(value: DraftOption[]): ISetEditorDraftOptions {
    return {
        value,
        type: Actions.SET_EDITOR_DRAFT_OPTIONS
    }
}

export function setCountdownValue(value: ICountdownValues): ICountdownEvent {
    return {
        type: ServerActions.SET_COUNTDOWN_VALUE,
        value
    }
}

export function setHighlightedAction(value: number | null): ISetHighlightedAction {
    return {
        value,
        type: Actions.SET_HIGHLIGHTED_ACTION
    }
}
