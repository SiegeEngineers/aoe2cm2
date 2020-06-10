import * as React from "react";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import {Redirect} from "react-router";
import Preset from "../../models/Preset";
import CustomisePresetButton from "../../containers/CustomisePresetButton";
import PresetList from "./PresetList";

interface IState {
    draftId: string | null;
    items: any[];
}

class Presets extends React.Component<WithTranslation, IState> {

    constructor(props: WithTranslation) {
        super(props);
        this.state = {draftId: null, items: []};
    }

    componentDidMount() {
        this.loadPresetList();
    }

    public render() {
        if (this.state.draftId !== null) {
            const target = '/draft/' + this.state.draftId;
            return (<Redirect to={target}/>);
        }

        return (
            <div className="container">
                <div id="join_game" className="content box">
                    <h3><Trans i18nKey='presets.joinTitle'>Join existing draft</Trans></h3>
                    <div className="field is-grouped">
                        <div className="control">
                            <div className="field has-addons">
                                <div className="control">
                                    <label className="button is-static">
                                        <Trans i18nKey='spectate.code'>code:</Trans>
                                    </label>
                                </div>
                                <div className="control">
                                    <input id="input-code" type="text" name="code" className="input"/>
                                </div>
                            </div>
                        </div>
                        <div className="control">
                            <button className="button is-link" id="join-game-button" onClick={this.joinDraft}>
                                <Trans i18nKey='presets.join'>Join</Trans>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="content box">
                    <h3>
                        <Trans i18nKey='presets.useTitle'>Use Preset</Trans>
                        <span className="is-pulled-right"><CustomisePresetButton preset={Preset.NEW}
                                                                                 i18nKey='createNewPreset'/></span>
                    </h3>
                    <PresetList items={this.state.items}/>
                </div>
            </div>
        );
    }

    private joinDraft = () => {
        const draftIdInput = document.getElementById('input-code') as HTMLInputElement;
        const draftId: string | null = draftIdInput.value;
        this.setState({...this.state, draftId});
    };


    private loadPresetList = () => {
        const request = new XMLHttpRequest();
        request.open('GET', '/api/preset/list', true);
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                const result = JSON.parse(request.responseText);
                this.setState({items: result});
            } else if (request.readyState === XMLHttpRequest.DONE && request.status === 404) {
                alert('Loading presets failed :-(');
            }
        };
        request.send();
    };
}

export default withTranslation()(Presets);