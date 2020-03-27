import * as React from 'react';
import {Redirect} from "react-router";
import Preset from "../models/Preset";
import {Trans} from "react-i18next";
import {Util} from "../util/Util";

interface IProps {
    preset: Preset;
}

interface IState {
    presetId?: string;
}

class NewPresetButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {};
    }


    public render() {

        if (this.state.presetId !== undefined) {
            const presetId = this.state.presetId;
            return (<Redirect to={`/preset/${presetId}`}/>);
        }

        return (
            <button className="shadowbutton text-primary" onClick={this.createPreset}>
                <Trans i18nKey="createNewPreset">Create new Preset</Trans>
            </button>
        );


    }

    private createPreset = () => {
        const request = new XMLHttpRequest();
        request.open('POST', '/preset/new', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                const result = JSON.parse(request.responseText);
                console.log('createPreset', result);
                if (result.hasOwnProperty('status') && result.status === 'error') {
                    if (result.status !== 'ok') {
                        alert(Util.buildValidationErrorMessage(result));
                    }
                } else {
                    this.setState({...this.state, presetId: result.presetId});
                }
            }
        };
        request.send(JSON.stringify({preset: this.props.preset}));
    };
}

export default NewPresetButton;
