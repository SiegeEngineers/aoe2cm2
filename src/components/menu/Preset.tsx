import * as React from "react";
import {PresetUtil} from "../../util/PresetUtil";
import {default as ModelPreset} from "../../models/Preset"
import TurnRow from "../draft/TurnRow";
import NewDraftButton from "../NewDraftButton";
import CustomisePresetButton from "../../containers/CustomisePresetButton";
import Civilisation from "../../models/Civilisation";
import CopyableInput from "../draft/CopyableInput";
import {PresetCivilisationCheckbox} from "../PresetEditor/PresetCivilisationCheckbox";

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
                <div className="content box">
                    <p>Could not find this preset, sorry :-(</p>
                </div>
            );
        }
        if (this.state.preset !== undefined) {

            const presetCivilisations = this.state.preset.civilisations;
            const civs = Civilisation.ALL.map((value: Civilisation, index: number) =>
                <PresetCivilisationCheckbox presetCivilisations={presetCivilisations} value={value}
                                            key={index}
                                            disabled={true}/>);

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
            <div className="content box">
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
                const preset = ModelPreset.fromPojo(result);
                this.setState({preset});
                document.title = `Preset "${preset?.name}" – AoE2 Captains Mode`;
            } else if (request.readyState === XMLHttpRequest.DONE && request.status === 404) {
                this.setState({presetExists: false});
                document.title = 'Preset not found – AoE2 Captains Mode';
            }
        };
        request.send();
    };
}

export default Preset;