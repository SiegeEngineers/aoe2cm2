import * as React from 'react';
import {Redirect} from "react-router";
import Preset from "../models/Preset";
import {Trans} from "react-i18next";
import {IStoreState} from "../types";
import {Dispatch} from "redux";
import * as actions from "../actions";
import {ISetEditorPreset} from "../actions";
import {connect} from "react-redux";

interface IProps {
    preset: Preset,
    onSetEditorPreset: (preset: Preset) => ISetEditorPreset,
    i18nKey?: string
}

interface IState {
    goToEdit: boolean
}

class CustomiseButton extends React.Component<IProps, IState> {
    state = {goToEdit: false};

    public render() {

        if (this.state.goToEdit) {
            return (<Redirect to={'/preset/create'}/>);
        }

        return (
            <button className="shadowbutton text-primary" onClick={() => {
                this.props.onSetEditorPreset(this.props.preset);
                this.setState({goToEdit: true});
            }}>
                <Trans i18nKey={this.props.i18nKey || 'customiseDraft'}>Customise</Trans>
            </button>
        );


    }
}

export function mapStateToProps(state: IStoreState) {
    return {}
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSetEditorPreset: (preset: Preset) => dispatch(actions.setEditorPreset(preset)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomiseButton);