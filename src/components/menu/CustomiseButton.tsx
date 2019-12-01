import * as React from 'react';
import {Redirect} from "react-router";
import Preset from "../../models/Preset";
import {Trans, WithTranslation, withTranslation} from "react-i18next";

interface IProps extends WithTranslation {
    preset: Preset,
    onSetEditorPreset: (preset: Preset) => void,
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

export default withTranslation()(CustomiseButton);