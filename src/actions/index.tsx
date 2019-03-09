import {Actions} from '../constants';
import Player from "../models/Player";
import {DraftEvent} from "../models/DraftEvent";
import {IDraftConfig} from "../models/IDraftConfig";

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

export type Action = ISetName | IActionCompleted | IApplyConfig;

export function setName(player: Player, value: string): ISetName {
    return {
        player,
        type: Actions.SET_NAME,
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
