import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import * as actions from "../actions";
import UsernameSelector from "../components/menu/UsernameSelector";


export function mapStateToProps(state: ApplicationState) {
    return {
        visible: state.modal.showModal,
        currentName: state.ownProperties.ownName
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>, ownProps: any) {
    const setNameCallback = () => {
        dispatch(actions.showNameModal());
    };
    return {
        setNameCallback
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsernameSelector);
