import {IStoreState} from '../types';
import {connect} from 'react-redux';
import Messages from "../components/Messages";


export function mapStateToProps(state: IStoreState) {
    let message = 'Finished.';
    if (state.nextAction < state.preset.turns.length) {
        const turn = state.preset.turns[state.nextAction];
        message = turn.player.toString() + ': ' + turn.action.toString();
    }
    return {
        message
    };
}

export function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);