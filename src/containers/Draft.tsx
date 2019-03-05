import Draft from '../components/Draft';
import * as actions from '../actions/';
import {IStoreState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';

export function mapStateToProps({nameHost, nameGuest, whoAmI, preset, nextAction, events}: IStoreState) {
    return {
        events,
        nameGuest,
        nameHost,
        nextAction,
        preset,
        whoAmI
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onNextAction: () => dispatch(actions.completeAction()),
        onSetNameGuestAction: () => dispatch(actions.setNameGuest("Eumel Guest")),
        onSetNameHostAction: () => dispatch(actions.setNameHost("Eumel Host")),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Draft);