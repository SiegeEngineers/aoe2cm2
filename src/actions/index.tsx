import {Actions} from '../constants';
import Player from "../models/Player";

export interface IActionCompleted {
    type: Actions.ACTION_COMPLETED;
}

export interface ISetName {
    player: Player,
    type: Actions.SET_NAME,
    value: string
}

export type Action = ISetName | IActionCompleted;

export function completeAction(): IActionCompleted {
    return {
        type: Actions.ACTION_COMPLETED
    }
}

export function setName(player: Player, value: string): ISetName {
    return {
        player,
        type: Actions.SET_NAME,
        value
    }
}
