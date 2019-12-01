import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import CustomiseButton from "../components/menu/CustomiseButton";
import Preset from "../models/Preset";
import * as actions from "../actions";
import {Dispatch} from "react";


export function mapStateToProps(state: ApplicationState) {
    return {
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSetEditorPreset: (preset: Preset) => dispatch(actions.setEditorPreset(preset)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomiseButton);