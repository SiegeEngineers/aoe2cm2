import {IStoreState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import * as actions from "../actions";
import Modal from "../components/menu/Modal";


export function mapStateToProps(state: IStoreState) {
    return {
        visible: state.showModal,
        currentName: state.ownName
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>, ownProps: any) {
    console.log('ownProps', ownProps);
    const changeNameCallback = ownProps.inDraft ? (name: string) => {
        dispatch(actions.sendJoin(name));
        dispatch(actions.changeOwnName(name));
    } : (name: string) => dispatch(actions.changeOwnName(name));
    return {
        changeNameCallback
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
