import {IStoreState} from '../types';
import {connect} from 'react-redux';
import Turn from "../components/draft/Turn";


export function mapStateToProps(state: IStoreState) {
    return {
        nextAction: state.nextAction
    };
}

export function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Turn);