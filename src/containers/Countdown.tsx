import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import Countdown from "../components/draft/Countdown";


export function mapStateToProps(state: ApplicationState) {
    return {
        seconds: state.countdown.countdownValue,
        visible: state.countdown.countdownVisible
    };
}

export function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Countdown);
