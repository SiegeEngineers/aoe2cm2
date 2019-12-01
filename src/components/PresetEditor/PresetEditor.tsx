import * as React from "react";
import {Link} from "react-router-dom";
import Preset from "../../models/Preset";
import Turn from "../../models/Turn";
import Player from "../../models/Player";
import PlayerTurnSettings from "./PlayerTurnSettings";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {ISetEditorCivilisations, ISetEditorName, ISetEditorPreset, ISetEditorTurn} from "../../actions";
import {connect} from "react-redux";
import {ApplicationState} from "../../types";
import Exclusivity from "../../models/Exclusivity";
import Action from "../../models/Action";
import NewDraftButton from "../NewDraftButton";
import Civilisation from "../../models/Civilisation";
import {CivilisationEncoder} from "../../models/CivilisationEncoder";
import TurnRow from "../draft/TurnRow";

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
        const preset = this.props.preset.turns.map((turn: Turn, index: number) => {
            let host = <PlayerTurnSettings player={Player.HOST} turn={turn} key={'host-' + index} index={index}/>;
            let guest = <PlayerTurnSettings player={Player.GUEST} turn={turn} key={'guest-' + index} index={index}/>;
            let none = <PlayerTurnSettings player={Player.NONE} turn={turn} key={'none-' + index} index={index}/>;

            return <div className="pure-g" key={'turn-' + index} style={{margin: '.2rem 0 .2rem 0', padding: '0.2rem', backgroundColor: 'rgba(100,100,100,0.3)'}}>
                <div className="pure-u-1-24">{index}</div>
                <div className="pure-u-8-24">{host}</div>
                <div className="pure-u-5-24">{none}</div>
                <div className="pure-u-8-24">{guest}</div>
                <div className="pure-u-2-24">
                    <button className="pure-button" onClick={() => {
                        this.props.onValueChange(null, index);
                    }}>X
                    </button>
                </div>
            </div>;
        });
        const presetCivilisations = this.props.preset.civilisations;
        const civs = Civilisation.ALL.map((value: Civilisation, index: number) => {
            return <div className="pure-u-1-4">
                <label><input type='checkbox' checked={presetCivilisations.includes(value)} onClick={() => {
                    if (presetCivilisations.includes(value)) {
                        presetCivilisations.splice(presetCivilisations.indexOf(value), 1);
                        this.props.onPresetCivilisationsChange(CivilisationEncoder.encodeCivilisationArray(presetCivilisations));
                    } else {
                        presetCivilisations.push(value);
                        this.props.onPresetCivilisationsChange(CivilisationEncoder.encodeCivilisationArray(presetCivilisations));
                    }
                }
                }/> {value.name}</label>
            </div>;
        });

        return (
            <div>
                <p>Preset Editor</p>
                <Link to='/'>Go to index</Link>

                <NewDraftButton preset={this.props.preset}/>

                <input type={'text'} value={this.props.preset.name} onChange={(event) => {
                    this.props.onPresetNameChange(event.target.value);
                }}/>

                <TurnRow turns={this.props.preset.turns}/>

                <div className="pure-g">
                    {civs}
                </div>

                <div className="pure-g">
                    <div className="pure-u-1-24">#</div>
                    <div className="pure-u-1-3 centered">Host</div>
                    <div className="pure-u-1-4 centered">Admin</div>
                    <div className="pure-u-1-3 centered">Guest</div>
                    <div className="pure-u-1-24"/>
                </div>
                {preset}

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