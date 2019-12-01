import {IStoreState} from '../types';
import {connect} from 'react-redux';
import PlayerDraftState from "../components/draft/PlayerDraftState";


export function mapStateToProps(state: IStoreState) {
    return {
        events: state.events,
        nextAction: (state.hostReady && state.guestReady) ? state.nextAction : -1
    };
}

export function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerDraftState);