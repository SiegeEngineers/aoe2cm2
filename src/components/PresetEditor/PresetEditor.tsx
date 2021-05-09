import * as React from "react";
import Preset from "../../models/Preset";
import Turn from "../../models/Turn";
import Player from "../../constants/Player";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {
    ISetEditorDraftOptions,
    ISetEditorName,
    ISetEditorPreset,
    ISetEditorTurn,
    ISetEditorTurnOrder
} from "../../actions";
import {connect} from "react-redux";
import {ApplicationState} from "../../types";
import Exclusivity from "../../constants/Exclusivity";
import Action from "../../constants/Action";
import NewDraftButton from "../NewDraftButton";
import TurnRow from "../draft/TurnRow";
import SavePresetButton from "../SavePresetButton";
import {PresetOptionCheckbox} from "./PresetOptionCheckbox";
import TurnExplanation from "./TurnExplanation";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import {ReactSortable} from "react-sortablejs";
import {PresetEditorTurn} from "./PresetEditorTurn";
import Civilisation from "../../models/Civilisation";
import DraftOption from "../../models/DraftOption";

interface Props extends WithTranslation{
    preset: Preset | null,
    onSetEditorPreset: (preset: Preset) => ISetEditorPreset,
    onValueChange: (turn: Turn | null, index: number) => ISetEditorTurn,
    onTurnOrderChange: (turns: Turn[]) => ISetEditorTurnOrder,
    onPresetNameChange: (value: string) => ISetEditorName,
    onPresetDraftOptionsChange: (value: DraftOption[]) => ISetEditorDraftOptions
}

class PresetEditor extends React.Component<Props, object> {

    componentDidMount(): void {
        if (this.props.preset === null || this.props.preset === undefined) {
            this.props.onSetEditorPreset(Preset.NEW);
        }
        document.title = 'Preset Editor – AoE2 Captains Mode';
    }

    public render() {
        if (this.props.preset === null || this.props.preset === undefined) {
            return null;
        }

        const turns = this.props.preset.turns.map((turn: Turn, index: number) =>
            <PresetEditorTurn index={index}
                              turn={turn}
                              className="columns is-mobile preset-editor-row"
                              onValueChange={this.props.onValueChange} key={turn.id}/>);

        const presetOptions = this.props.preset.options;

        const civs = Civilisation.ALL.map((value: Civilisation, index: number) =>
            <PresetOptionCheckbox presetOptions={presetOptions} value={value}
                                  key={index}
                                  disabled={false}
                                  onPresetDraftOptionsChange={this.props.onPresetDraftOptionsChange}/>);

        return (
            <React.Fragment>
                <div className={'content box'}>
                    <h3>1. <Trans i18nKey="presetEditor.availableCivs">Available Civilisations</Trans></h3>
                    <div className="is-flex" style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        {civs}
                    </div>

                    <h3>2. <Trans i18nKey="presetEditor.turns">Turns</Trans></h3>
                    <TurnRow turns={this.props.preset.turns}/>
                    <div>
                        <div className="columns is-mobile has-text-weight-bold table-header">
                            <div className="column is-1 has-text-centered">#</div>
                            <div className="column has-text-centered"><Trans i18nKey="presetEditor.host">Host</Trans></div>
                            <div className="column has-text-centered"><Trans i18nKey="presetEditor.admin">Admin</Trans></div>
                            <div className="column has-text-centered"><Trans i18nKey="presetEditor.guest">Guest</Trans></div>
                            <div className="column is-1"/>
                        </div>

                        <ReactSortable<Turn> list={this.props.preset.turns}
                                             setList={(newState: Turn[]) => this.props.onTurnOrderChange(newState)}
                                             handle=".is-drag-handle"
                                             animation={150}>
                            {turns}
                        </ReactSortable>

                        <div className="columns is-mobile pt-3">
                            <div className="column is-1"/>
                            <div className="column has-text-centered">
                                <button className="button" onClick={() => {
                                    if (this.props.preset === undefined || this.props.preset === null) {
                                        return;
                                    }
                                    const newTurn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false);
                                    this.props.onValueChange(newTurn, this.props.preset.turns.length);
                                }}>+ <Trans i18nKey="presetEditor.new">New</Trans>
                                </button>
                            </div>
                            <div className="column has-text-centered">
                                <button className="button" onClick={() => {
                                    if (this.props.preset === undefined || this.props.preset === null) {
                                        return;
                                    }
                                    const newTurn = new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL, false, false);
                                    this.props.onValueChange(newTurn, this.props.preset.turns.length);
                                }}>+ <Trans i18nKey="presetEditor.new">New</Trans>
                                </button>
                            </div>
                            <div className="column has-text-centered">
                                <button className="button" onClick={() => {
                                    if (this.props.preset === undefined || this.props.preset === null) {
                                        return;
                                    }
                                    const newTurn = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false);
                                    this.props.onValueChange(newTurn, this.props.preset.turns.length);
                                }}>+ <Trans i18nKey="presetEditor.new">New</Trans>
                                </button>
                            </div>
                            <div className="column is-1"/>
                        </div>
                    </div>
                    <hr/>
                    <h3>3. <Trans i18nKey="presetEditor.createSaveDraft">Create Draft or Save</Trans></h3>
                    <div className="field is-grouped">
                        <p className="control">
                            <input type={'text'} value={this.props.preset.name} className="input"
                                   placeholder={this.props.t("presetEditor.presetName")} required
                                   onChange={(event) => {
                                       if (!event.target.value.trim()) {
                                           event.target.classList.add('is-danger');
                                       } else {
                                           event.target.classList.remove('is-danger');
                                       }
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
        onTurnOrderChange: (turns: Turn[]) => dispatch(actions.setEditorTurnOrder(turns)),
        onPresetDraftOptionsChange: (value: DraftOption[]) => dispatch(actions.setEditorDraftOptions(value)),
        onPresetNameChange: (value: string) => dispatch(actions.setEditorName(value)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PresetEditor));
