import {Action} from '../actions';
import {IStoreState} from '../types';
import {ACTION_COMPLETED, SET_NAME_GUEST, SET_NAME_HOST} from '../constants';

export function updateState(state: IStoreState, action: Action): IStoreState {
    switch (action.type) {
        case ACTION_COMPLETED:
            console.log(ACTION_COMPLETED, state.nextAction + 1);
            return {...state, nextAction: state.nextAction + 1};
        case SET_NAME_HOST:
            console.log(SET_NAME_HOST, action.value);
            return {...state, nameHost: action.value};
        case SET_NAME_GUEST:
            console.log(SET_NAME_GUEST, action.value);
            return {...state, nameGuest: action.value};
    }
    return state;
}