import * as React from "react";
import {PresetUtil} from "../../util/PresetUtil";
import {default as ModelPreset} from "../../models/Preset"
import TurnRow from "../draft/TurnRow";
import NewDraftButton from "../NewDraftButton";
import CustomisePresetButton from "../../containers/CustomisePresetButton";
import Civilisation from "../../models/Civilisation";

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
                return <div className="pure-u-1-4">
                    <label>
                        <input type='checkbox' checked={presetCivilisations.includes(value)} disabled/> {value.name}
                    </label>
                </div>;
            });

            return (
                <div className='box centered'>
                    <h3>{this.state.preset.name}</h3>

                    <TurnRow turns={this.state.preset.turns}/>

                    <div className="pure-g">
                        {civs}
                    </div>
                    <p>
                        <NewDraftButton preset={this.state.preset}/>
                    </p>
                    <p>
                        <CustomisePresetButton preset={this.state.preset}/>
                    </p>
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
        request.open('GET', '/getpreset/' + presetId, true);
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