import * as React from 'react';
import {Redirect} from "react-router";
import Preset from "../models/Preset";
import {Trans} from "react-i18next";
import {Util} from "../util/Util";

interface IProps {
    preset: Preset;
    private: boolean;
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
            return (<Redirect push to={`/draft/${draftId}`}/>);
        }
        if (this.props.private){
        return (<>
            <button className="button is-text mb-0" onClick={this.createDraft}>
                <Trans i18nKey="createNewPrivateDraft">Create private practice Draft</Trans>
            </button>
            <ul className="is-size-7 mt-0">
                <li><Trans i18nKey="privateDraftInfo1">Will be deleted after completion</Trans></li>
                <li><Trans i18nKey="privateDraftInfo2">Does not show up in Recent Drafts on the Spectate page</Trans></li>
            </ul>
            </>);
        }
        return (
            <button className="button is-link" onClick={this.createDraft}>
                <Trans i18nKey="createNewDraft">Create new Draft</Trans>
            </button>
        );


    }

    private createDraft = () => {
        if (!this.props.preset.name.trim()) {
            return;
        }
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
        request.send(JSON.stringify({preset: this.props.preset, private: this.props.private}));
    };
}

export default NewDraftButton;
