import {IStoreState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import * as actions from "../actions";
import UsernameSelector from "../components/menu/UsernameSelector";


export function mapStateToProps(state: IStoreState) {
    return {
        visible: state.showModal,
        currentName: state.ownName
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
