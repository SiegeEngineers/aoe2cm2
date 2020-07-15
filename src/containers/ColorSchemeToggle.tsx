import {ApplicationState} from "../types";
import * as actions from '../actions/';
import {connect} from 'react-redux';
import ColorSchemeToggle from "../components/menu/ColorSchemeToggle";
import {Dispatch} from "redux";
import {ColorScheme} from "../constants/ColorScheme";

export function mapStateToProps(state: ApplicationState) {
    return {
        activeColorScheme: state.colorScheme.colorScheme
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onToggleColorScheme: (colorScheme: ColorScheme) => dispatch(actions.setColorScheme(colorScheme))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ColorSchemeToggle);
