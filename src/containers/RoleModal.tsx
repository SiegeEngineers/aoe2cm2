import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import * as actions from "../actions";
import Player from "../constants/Player";
import RoleModal from "../components/draft/RoleModal";


export function mapStateToProps(state: ApplicationState) {
    return {
        visible: state.modal.showRoleModal,
        hostConnected: state.draft.hostConnected,
        guestConnected: state.draft.guestConnected,
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>, ownProps: any) {
    return {
        setRoleCallback: (role: Player) => dispatch(actions.setOwnRole(role))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleModal);
