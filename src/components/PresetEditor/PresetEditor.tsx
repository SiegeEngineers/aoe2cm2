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
            <div className={'box'}>
                <h2 className={'centered'}>Preset Editor</h2>

                <NewDraftButton preset={this.props.preset}/>
                <SavePresetButton preset={this.props.preset}/>

                <h3>Preset Title</h3>

                <input type={'text'} value={this.props.preset.name} onChange={(event) => {
                    this.props.onPresetNameChange(event.target.value);
                }}/>

                <TurnRow turns={this.props.preset.turns}/>

                <h3>Available Civilisations</h3>

                <div className="pure-g">
                    {civs}
                </div>

                <h3>Turns</h3>

                <div className="pure-g">
                    <div className="pure-u-1-24">#</div>
                    <div className="pure-u-1-3 centered">Host</div>
                    <div className="pure-u-1-4 centered">Admin</div>
                    <div className="pure-u-1-3 centered">Guest</div>
                    <div className="pure-u-1-24"/>
                </div>

                {turns}

                <div className="pure-g">
                    <div className="pure-u-1-24">new</div>
                    <div className="pure-u-1-3 centered">
                        <button className="pure-button" onClick={() => {
                            if (this.props.preset === undefined || this.props.preset === null) {
                                return;
                            }
                            const newTurn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false);
                            this.props.onValueChange(newTurn, this.props.preset.turns.length);
                        }}>+
                        </button>
                    </div>
                    <div className="pure-u-1-4 centered">
                        <button className="pure-button" onClick={() => {
                            if (this.props.preset === undefined || this.props.preset === null) {
                                return;
                            }
                            const newTurn = new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL, false, false);
                            this.props.onValueChange(newTurn, this.props.preset.turns.length);
                        }}>+
                        </button>
                    </div>
                    <div className="pure-u-1-3 centered">
                        <button className="pure-button" onClick={() => {
                            if (this.props.preset === undefined || this.props.preset === null) {
                                return;
                            }
                            const newTurn = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false);
                            this.props.onValueChange(newTurn, this.props.preset.turns.length);
                        }}>+
                        </button>
                    </div>
                    <div className="pure-u-1-24"/>
                </div>
                <hr/>
                <TurnExplanation/>
            </div>
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