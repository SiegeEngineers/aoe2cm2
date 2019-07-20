import {Actions} from '../constants';
import Player from "../models/Player";
import {default as ModelAction} from "../models/Action";
import {DraftEvent} from "../models/DraftEvent";
import {IDraftConfig} from "../models/IDraftConfig";
import PlayerEvent from "../models/PlayerEvent";
import {ICountdownValues, IDraftState} from "../types";

export interface IActionCompleted {
    type: Actions.ACTION_COMPLETED,
    value: DraftEvent
}

export interface IApplyConfig {
    type: Actions.APPLY_CONFIG,
    value: IDraftConfig
}

export interface ISetName {
    player: Player,
    type: Actions.SET_NAME,
    value: string
}

export interface IChangeOwnName {
    type: Actions.CHANGE_OWN_NAME,
    value: string
}

export interface ISendJoin {
    type: Actions.SEND_JOIN,
    name: string
}

export interface IClickOnCiv {
    type: Actions.CLICK_CIVILISATION,
    playerEvent: PlayerEvent,
    callback: any
}

export interface ISetLanguage {
    type: Actions.SET_LANGUAGE,
    language: string
}

export interface ISetEvents {
    type: Actions.SET_EVENTS,
    value: { player: Player, action: ModelAction, events: DraftEvent[] }
}

export interface ICountdownEvent {
    type: Actions.COUNTDOWN,
    value: ICountdownValues
}

export interface IDisconnect {
    type: Actions.DISCONNECT
}

export interface IShowNameModal {
    type: Actions.SHOW_NAME_MODAL
}

export interface IReplayEvent {
    type: Actions.REPLAY
    value: IDraftState
}

export type Action =
    ISetName
    | IChangeOwnName
    | IActionCompleted
    | IApplyConfig
    | ISendJoin
    | IClickOnCiv
    | ISetLanguage
    | ISetEvents
    | IDisconnect
    | ICountdownEvent
    | IShowNameModal
    | IReplayEvent;

export function setName(player: Player, value: string): ISetName {
    return {
        player,
        type: Actions.SET_NAME,
        value
    }
}

export function changeOwnName(value: string): IChangeOwnName {
    return {
        type: Actions.CHANGE_OWN_NAME,
        value
    }
}

export function act(value: DraftEvent): IActionCompleted {
    return {
        type: Actions.ACTION_COMPLETED,
        value
    }
}

export function applyConfig(value: IDraftConfig): IApplyConfig {
    return {
        type: Actions.APPLY_CONFIG,
        value
    }
}

export function sendJoin(name: string): ISendJoin {
    return {
        name,
        type: Actions.SEND_JOIN
    }
}

export function showNameModal(): IShowNameModal {
    return {
        type: Actions.SHOW_NAME_MODAL
    }
}

export function clickOnCiv(playerEvent: PlayerEvent, callback: any): IClickOnCiv {
    return {
        callback,
        playerEvent,
        type: Actions.CLICK_CIVILISATION
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
        type: Actions.SET_EVENTS
    }
}

export function disconnect(): IDisconnect {
    return {
        type: Actions.DISCONNECT
    }
}

export function replay(value: IDraftState): IReplayEvent {
    return {
        value,
        type: Actions.REPLAY
    }
}
