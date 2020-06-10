import * as React from 'react';
import {Redirect} from "react-router";
import Preset from "../models/Preset";
import {Trans} from "react-i18next";
import {Util} from "../util/Util";

interface IProps {
    preset: Preset;
}

interface IState {
    draftId?: string;
}

class NewDraftButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {};
    }


    public render() {

        if (this.state.draftId !== undefined) {
            const draftId = this.state.draftId;
            return (<Redirect to={`/draft/${draftId}`}/>);
        }

        return (
            <button className="button is-link" onClick={this.createDraft}>
                <Trans i18nKey="createNewDraft">Create new Draft</Trans>
            </button>
        );


    }

    private createDraft = () => {
        const request = new XMLHttpRequest();
        request.open('POST', '/api/draft/new', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                const result = JSON.parse(request.responseText);
                console.log('createDraft', result);
                if (result.hasOwnProperty('status') && result.status === 'error') {
                    if (result.status !== 'ok') {
                        alert(Util.buildValidationErrorMessage(result));
                    }
                } else {
                    this.setState({...this.state, draftId: result.draftId});
                }
            }
        };
        request.send(JSON.stringify({preset: this.props.preset}));
    };
}

export default NewDraftButton;
