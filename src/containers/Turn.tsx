import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import * as actions from "../actions";
import Turn from "../components/draft/Turn";
import {Dispatch} from 'redux';


export function mapStateToProps(state: ApplicationState) {
    return {
        nextAction: state.ownProperties.nextAction,
        highlightedAction: state.ownProperties.highlightedAction,
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onHighlightedActionChanged: (value: number | null) => dispatch(actions.setHighlightedAction(value)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Turn);