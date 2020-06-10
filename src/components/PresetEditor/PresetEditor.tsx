import * as React from "react";
import Preset from "../../models/Preset";
import Turn from "../../models/Turn";
import Player from "../../constants/Player";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {ISetEditorCivilisations, ISetEditorName, ISetEditorPreset, ISetEditorTurn} from "../../actions";
import {connect} from "react-redux";
import {ApplicationState} from "../../types";
import Exclusivity from "../../constants/Exclusivity";
import Action from "../../constants/Action";
import NewDraftButton from "../NewDraftButton";
import Civilisation from "../../models/Civilisation";
import TurnRow from "../draft/TurnRow";
import SavePresetButton from "../SavePresetButton";
import {PresetEditorTurn} from "./PresetEditorTurn";
import {PresetCivilisationCheckbox} from "./PresetCivilisationCheckbox";
import TurnExplanation from "./TurnExplanation";

interface Props {
    preset: Preset | null,
    onSetEditorPreset: (preset: Preset) => ISetEditorPreset,
    onValueChange: (turn: Turn | null, index: number) => ISetEditorTurn,
    onPresetNameChange: (value: string) => ISetEditorName,
    onPresetCivilisationsChange: (value: string) => ISetEditorCivilisations
}

class PresetEditor extends React.Component<Props, object> {

    componentDidMount(): void {
        if (this.props.preset === null || this.props.preset === undefined) {
            this.props.onSetEditorPreset(Preset.NEW);
        }
    }

    public render() {
        if (this.props.preset === null || this.props.preset === undefined) {
            return null;
        }
        const turns = this.props.preset.turns.map((turn: Turn, index: number) =>
            <PresetEditorTurn index={index} turn={turn} onValueChange={this.props.onValueChange}/>);
        const presetCivilisations = this.props.preset.civilisations;
        const civs = Civilisation.ALL.map((value: Civilisation, index: number) =>
            <PresetCivilisationCheckbox presetCivilisations={presetCivilisations} value={value}
                                        onPresetCivilisationsChange={this.props.onPresetCivilisationsChange}/>);

        return (
            <React.Fragment>
                <div className={'content box'}>
                    <h3>1. Available Civilisations</h3>
                    <div className="is-flex" style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        {civs}
                    </div>

                    <h3>2. Turns</h3>
                    <TurnRow turns={this.props.preset.turns}/>
                    <div>
                        <div className="columns has-text-weight-bold has-background-grey-lighter">
                            <div className="column is-1 has-text-centered">#</div>
                            <div className="column has-text-centered">Host</div>
                            <div className="column has-text-centered">Admin</div>
                            <div className="column has-text-centered">Guest</div>
                            <div className="column is-1"/>
                        </div>

                        {turns}

                        <div className="columns">
                            <div className="column is-1"/>
                            <div className="column has-text-centered">
                                <button className="button" onClick={() => {
                                    if (this.props.preset === undefined || this.props.preset === null) {
                                        return;
                                    }
                                    const newTurn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false);
                                    this.props.onValueChange(newTurn, this.props.preset.turns.length);
                                }}>+ New
                                </button>
                            </div>
                            <div className="column has-text-centered">
                                <button className="button" onClick={() => {
                                    if (this.props.preset === undefined || this.props.preset === null) {
                                        return;
                                    }
                                    const newTurn = new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL, false, false);
                                    this.props.onValueChange(newTurn, this.props.preset.turns.length);
                                }}>+ New
                                </button>
                            </div>
                            <div className="column has-text-centered">
                                <button className="button" onClick={() => {
                                    if (this.props.preset === undefined || this.props.preset === null) {
                                        return;
                                    }
                                    const newTurn = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false);
                                    this.props.onValueChange(newTurn, this.props.preset.turns.length);
                                }}>+ New
                                </button>
                            </div>
                            <div className="column is-1"/>
                        </div>
                    </div>
                    <hr/>
                    <h3>3. Create Draft or Save</h3>
                    <div className="field is-grouped">
                        <p className="control">
                            <input type={'text'} value={this.props.preset.name} className="input"
                                   placeholder="Preset Name" required onChange={(event) => {
                                this.props.onPresetNameChange(event.target.value);
                            }}/>
                        </p>
                        <p className="control">
                            <NewDraftButton preset={this.props.preset}/>
                        </p>
                        <p className="control">
                            <SavePresetButton preset={this.props.preset}/>
                        </p>
                    </div>
                </div>
                <div className="content box">
                    <TurnExplanation/>
                </div>
            </React.Fragment>
        );
    }
}

export function mapStateToProps(state: ApplicationState) {
    return {
        preset: state.presetEditor.editorPreset
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSetEditorPreset: (preset: Preset) => dispatch(actions.setEditorPreset(preset)),
        onValueChange: (turn: Turn | null, index: number) => dispatch(actions.setEditorTurn(turn, index)),
        onPresetCivilisationsChange: (value: string) => dispatch(actions.setEditorCivilisations(value)),
        onPresetNameChange: (value: string) => dispatch(actions.setEditorName(value)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresetEditor);