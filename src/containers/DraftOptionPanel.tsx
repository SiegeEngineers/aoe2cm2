import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import ActionType, {actionTypeFromAction} from "../constants/ActionType";
import PlayerEvent from "../models/PlayerEvent";
import {Dispatch} from "redux";
import * as actions from "../actions";
import DraftOptionPanel from "../components/draft/DraftOptionPanel";


export function mapStateToProps(state: ApplicationState) {
    let triggerAction: ActionType = ActionType.NOTHING;
    const index = state.ownProperties.nextAction;
    let player = undefined;
    if (state.draft.preset && index < state.draft.preset.turns.length) {

        let turn = state.draft.preset.turns[index];
        if (turn.executingPlayer !== state.ownProperties.whoAmI) {
            if (turn.parallel && (index + 1) < state.draft.preset.turns.length) {
                turn = state.draft.preset.turns[index + 1];
            } else if((index - 1) >= 0 && state.draft.preset.turns[index - 1].parallel) {
                turn = state.draft.preset.turns[index - 1];
            }
        }
        if (turn.executingPlayer === state.ownProperties.whoAmI) {
            triggerAction = actionTypeFromAction(turn.action);
            player = turn.player;
        }
    }
    return {
        triggerAction,
        player: player,
        whoAmI: state.ownProperties.whoAmI,
        nextAction: state.ownProperties.nextAction,
        draft: state.draft,
        iconStyle: state.iconStyle.iconStyle,
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onClickCivilisation: (playerEvent: PlayerEvent, callback: any) => dispatch(actions.clickOnCiv(playerEvent, callback)),
        onHighlightedActionChanged: (value: number | null) => dispatch(actions.setHighlightedAction(value)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DraftOptionPanel);
