import {IStoreState} from '../types';
import {connect} from 'react-redux';
import Countdown from "../components/Countdown";


export function mapStateToProps(state: IStoreState) {
    return {
        countdownUntil: state.countdownUntil
    };
}

export function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Countdown);
