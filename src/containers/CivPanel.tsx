import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import CivPanel from "../components/draft/CivPanel";
import ActionType, {actionTypeFromAction} from "../constants/ActionType";
import PlayerEvent from "../models/PlayerEvent";
import {Dispatch} from "redux";
import * as actions from "../actions";


export function mapStateToProps(state: ApplicationState) {
    let triggerAction: ActionType = ActionType.NOTHING;
    if (state.draft.preset && state.ownProperties.nextAction < state.draft.preset.turns.length) {
        triggerAction = actionTypeFromAction(state.draft.preset.turns[state.ownProperties.nextAction].action);
    }
    return {
        triggerAction,
        whoAmI: state.ownProperties.whoAmI,
        nextAction: state.ownProperties.nextAction,
        draft: state.draft
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onClickCivilisation: (playerEvent:PlayerEvent, callback:any) => dispatch(actions.clickOnCiv(playerEvent, callback))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CivPanel);
