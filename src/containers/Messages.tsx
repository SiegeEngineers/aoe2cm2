import {IStoreState} from '../types';
import {connect} from 'react-redux';
import Messages from "../components/Messages";


export function mapStateToProps(state: IStoreState) {
    let message = 'messages.finished';
    let nextTurn = null;
    if (state.preset && state.nextAction < state.preset.turns.length) {
        nextTurn = state.preset.turns[state.nextAction];
    }
    return {
        whoAmI: state.whoAmI,
        hostReady: state.hostReady,
        guestReady: state.guestReady,
        nextTurn,
        message
    };
}

export function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
