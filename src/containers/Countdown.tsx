import {IStoreState} from '../types';
import {connect} from 'react-redux';
import Countdown from "../components/Countdown";


export function mapStateToProps(state: IStoreState) {
    return {
        seconds: state.countdownValue,
        visible: state.countdownVisible
    };
}

export function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Countdown);
