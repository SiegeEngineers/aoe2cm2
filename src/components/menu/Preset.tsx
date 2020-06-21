import * as React from "react";
import {PresetUtil} from "../../util/PresetUtil";
import {default as ModelPreset} from "../../models/Preset"
import TurnRow from "../draft/TurnRow";
import NewDraftButton from "../NewDraftButton";
import CustomisePresetButton from "../../containers/CustomisePresetButton";
import Civilisation from "../../models/Civilisation";
import CopyableInput from "../draft/CopyableInput";

interface IState {
    preset?: ModelPreset;
    presetExists: boolean;
}

class Preset extends React.Component<object, IState> {

    state: IState = {presetExists: true};

    componentDidMount() {
        const presetId = PresetUtil.getIdFromUrl();
        if (presetId !== undefined) {
            this.loadPreset(presetId);
        }
    }

    public render() {
        if (!this.state.presetExists) {
            return (
                <div>
                    <p>Could not find this preset, sorry :-(</p>
                </div>
            );
        }
        if (this.state.preset !== undefined) {

            const presetCivilisations = this.state.preset.civilisations;
            const civs = Civilisation.ALL.map((value: Civilisation, index: number) => {
                return <label className="checkbox is-inline-block civ-select" key={index} style={{width: "20%", padding: 5}}>
                    <input type='checkbox' checked={presetCivilisations.includes(value)} disabled/> {value.name}
                </label>;
            });

            return (
                <div className='content box'>
                    <h3 className="has-text-centered">{this.state.preset.name}</h3>

                    <TurnRow turns={this.state.preset.turns}/>

                    <div className="is-flex" style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        {civs}
                    </div>

                    <div className="columns is-mobile mt-4">
                        <div className="column is-7 buttons">
                            <br/>
                            <NewDraftButton preset={this.state.preset}/>
                            <CustomisePresetButton preset={this.state.preset}/>
                        </div>
                        <div className="column is-5">
                            <CopyableInput content={window.location.href} before={'preset.shareThisPreset'}
                                           length={35}/>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <p>Loading…</p>
            </div>
        );
    }


    private loadPreset = (presetId: string) => {
        const request = new XMLHttpRequest();
        request.open('GET', '/api/preset/' + presetId, true);
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                const result = JSON.parse(request.responseText);
                this.setState({preset: ModelPreset.fromPojo(result)});
            } else if (request.readyState === XMLHttpRequest.DONE && request.status === 404) {
                this.setState({presetExists: false});
            }
        };
        request.send();
    };
}

export default Preset;