import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import * as actions from "../actions";
import PlayerOnlineStatus from "../components/draft/PlayerOnlineStatus";


export function mapStateToProps(state: ApplicationState) {
    return {
        hostConnected: state.draft.hostConnected,
        guestConnected: state.draft.guestConnected,
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>, ownProps: any) {
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerOnlineStatus);
