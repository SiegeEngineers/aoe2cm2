import {IStoreState} from '../types';
import {connect} from 'react-redux';
import Messages from "../components/Messages";
import {Dispatch} from "react";
import * as actions from "../actions";


export function mapStateToProps(state: IStoreState) {
    let nextTurn = null;
    if (state.preset && state.nextAction < state.preset.turns.length) {
        nextTurn = state.preset.turns[state.nextAction];
    }
    return {
        whoAmI: state.whoAmI,
        hostReady: state.hostReady,
        guestReady: state.guestReady,
        nameHost: state.nameHost,
        nameGuest: state.nameGuest,
        nextTurn
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        sendReady: () => dispatch(actions.sendReady())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
