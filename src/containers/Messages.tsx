import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import Messages from "../components/draft/Messages";
import {Dispatch} from "react";
import * as actions from "../actions";


export function mapStateToProps(state: ApplicationState) {
    let nextTurn = null;
    if (state.draft.preset && state.ownProperties.nextAction < state.draft.preset.turns.length) {
        nextTurn = state.draft.preset.turns[state.ownProperties.nextAction];
    }
    return {
        whoAmI: state.ownProperties.whoAmI,
        hostReady: state.draft.hostReady,
        guestReady: state.draft.guestReady,
        nameHost: state.draft.nameHost,
        nameGuest: state.draft.nameGuest,
        nextTurn
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        sendReady: () => dispatch(actions.sendReady())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
