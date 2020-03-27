import * as React from "react";
import {PresetUtil} from "../../util/PresetUtil";
import {default as ModelPreset} from "../../models/Preset"
import TurnRow from "../draft/TurnRow";
import NewDraftButton from "../NewDraftButton";
import CustomisePresetButton from "../../containers/CustomisePresetButton";

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
            return (
                <div className='box centered'>
                    <h3>{this.state.preset.name}</h3>

                    <TurnRow turns={this.state.preset.turns}/>

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