import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import * as actions from "../actions";
import Modal from "../components/menu/Modal";
import Player from "../constants/Player";


export function mapStateToProps(state: ApplicationState) {
    return {
        visible: state.modal.showModal,
        currentName: state.ownProperties.ownName,
        role: state.ownProperties.whoAmI
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>, ownProps: any) {
    console.log('ownProps', ownProps);
    const changeNameCallback = ownProps.inDraft ? (name: string, role: Player) => {
        if (role === Player.HOST || role === Player.GUEST) {
            dispatch(actions.setName(name));
        } else if (role === undefined) {
            dispatch(actions.setRole(name, role));
        }
        dispatch(actions.changeOwnName(name));
    } : (name: string, role: Player) => dispatch(actions.changeOwnName(name));
    return {
        changeNameCallback
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
