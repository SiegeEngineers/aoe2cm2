import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import Turn from "../components/draft/Turn";


export function mapStateToProps(state: ApplicationState) {
    return {
        nextAction: state.ownProperties.nextAction
    };
}

export function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Turn);