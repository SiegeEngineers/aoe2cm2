import {IStoreState} from '../types';
import {connect} from 'react-redux';
import Player from "../components/Player";


export function mapStateToProps(state: IStoreState) {
    return {
        events: state.events,
        nextAction: state.nextAction
    };
}

export function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);