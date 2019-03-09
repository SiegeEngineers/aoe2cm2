import {Action} from '../actions';
import {IStoreState} from '../types';
import PlayerEvent from "../models/PlayerEvent";
import Player from "../models/Player";
import ActionType from "../models/ActionType";
import Civilisation from "../models/Civilisation";
import {Actions} from "../constants";

export function updateState(state: IStoreState, action: Action): IStoreState {
    switch (action.type) {
        case Actions.ACTION_COMPLETED:
            console.log(Actions.ACTION_COMPLETED, state.nextAction + 1);

            const events = [new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS),
                new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.BERBERS),
                new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.CELTS),
                new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.INDIANS),
            ];
            return {...state, nextAction: state.nextAction + 1, events};
        case Actions.SET_NAME:
            console.log(Actions.SET_NAME, action.value);
            if (action.player === Player.HOST) {
                return {...state, nameHost: action.value};
            } else if (action.player === Player.GUEST) {
                return {...state, nameGuest: action.value};
            } else {
                return state;
            }
    }
    return state;
}