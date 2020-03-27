import {ApplicationState} from '../types';
import * as actions from '../actions/';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import IconStyleSelector from "../components/menu/IconStyleSelector";


export function mapStateToProps(state: ApplicationState) {
    return {
        activeIconStyle: state.iconStyle.iconStyle
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSetIconStyle: (iconStyle: string) => dispatch(actions.setIconStyle(iconStyle))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(IconStyleSelector);
