import {IStoreState} from '../types';
import {connect} from 'react-redux';
import CivPanel from "../components/CivPanel";
import ActionType, {actionTypeFromAction} from "../models/ActionType";
import PlayerEvent from "../models/PlayerEvent";
import {Dispatch} from "redux";
import * as actions from "../actions";


export function mapStateToProps(state: IStoreState) {
    let triggerAction: ActionType = ActionType.NOTHING;
    if (state.nextAction < state.preset.turns.length) {
        triggerAction = actionTypeFromAction(state.preset.turns[state.nextAction].action);
    }
    return {
        triggerAction,
        whoAmI: state.whoAmI
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onClickCivilisation: (playerEvent:PlayerEvent, callback:any) => dispatch(actions.clickOnCiv(playerEvent, callback))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CivPanel);