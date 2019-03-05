import * as constants from '../constants';

export interface IActionCompleted {
    type: constants.ACTION_COMPLETED;
}

export interface ISetNameHost {
    type: constants.SET_NAME_HOST;
    value: string;
}

export interface ISetNameGuest {
    type: constants.SET_NAME_GUEST;
    value: string;
}

export type SetNameAction = ISetNameGuest | ISetNameHost;
export type Action = ISetNameGuest | ISetNameHost | IActionCompleted | SetNameAction;

export function completeAction(): IActionCompleted {
    return {
        type: constants.ACTION_COMPLETED
    }
}

export function setNameHost(value: string): SetNameAction {
    return {
        type: constants.SET_NAME_HOST,
        value
    }
}

export function setNameGuest(value: string): SetNameAction {
    return {
        type: constants.SET_NAME_GUEST,
        value
    }
}
