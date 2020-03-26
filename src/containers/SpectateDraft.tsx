import * as actions from '../actions/';
import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import Player from "../constants/Player";
import DraftSpectate from "../components/draft/SpectateDraft";

export function mapStateToProps(state: ApplicationState) {
    return {}
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        setOwnRole: (role: Player) => dispatch(actions.setOwnRole(role)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DraftSpectate);
