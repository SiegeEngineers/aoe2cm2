import * as actions from '../actions/';
import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import Player from "../constants/Player";
import DraftGuest from "../components/draft/GuestDraft";

export function mapStateToProps(state: ApplicationState) {
    return {}
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        setOwnRole: (role: Player) => dispatch(actions.setOwnRole(role)),
        triggerConnect: () => dispatch(actions.connect()),
        triggerSetRole: (name: string, role: Player) => dispatch(actions.setRole(name, role)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DraftGuest);
