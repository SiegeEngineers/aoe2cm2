import * as React from "react";
import {PresetUtil} from "../../util/PresetUtil";
import {default as ModelPreset} from "../../models/Preset"
import TurnRow from "../draft/TurnRow";
import NewDraftButton from "../NewDraftButton";
import CustomisePresetButton from "../../containers/CustomisePresetButton";
import CopyableInput from "../draft/CopyableInput";
import {PresetOptionCheckbox} from "../PresetEditor/PresetOptionCheckbox";
import Civilisation from "../../models/Civilisation";
import DraftOptionPanelType from "../../constants/DraftOptionPanelType";
import DraftOptionPanel from "../draft/DraftOptionPanel";
import DraftOption from "../../models/DraftOption";
import {ApplicationState} from "../../types";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {connect} from "react-redux";

interface IState {
    preset?: ModelPreset;
    presetExists: boolean;
}

interface IProps {
    iconStyle: string;
}

class Preset extends React.Component<IProps, IState> {

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

            const presetCivilisations = this.state.preset.options;
            let civs;
            let itemAlignment = '';
            if (this.state.preset.encodedCivilisations) {
                civs = Civilisation.ALL.map((value: Civilisation, index: number) =>
                    <PresetOptionCheckbox presetOptions={presetCivilisations} value={value}
                                          key={index}
                                          disabled={true}/>)
            } else {
                civs = presetCivilisations.map((value: DraftOption, index: number) =>
                    <DraftOptionPanel draftOption={value} active={false}
                                      draftOptionPanelType={DraftOptionPanelType.CHOICE} nextAction={0}
                                      displayOnly={true} iconStyle={this.props.iconStyle}/>);
                itemAlignment = ' flex-justify-center';
            }

            return (
                <div className='content box'>
                    <h3 className="has-text-centered">{this.state.preset.name}</h3>

                    <TurnRow turns={this.state.preset.turns}/>

                    <div className={"is-flex" + itemAlignment} style={{flexDirection: 'row', flexWrap: 'wrap'}}>
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


function mapStateToProps(state: ApplicationState) {
    return {
        iconStyle: state.iconStyle.iconStyle,
    };
}

function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Preset);
