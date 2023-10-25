import * as React from "react";
import Preset from "../../models/Preset";
import Turn from "../../models/Turn";
import Player from "../../constants/Player";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {
    IDuplicateEditorTurn,
    ISetEditorCategoryLimitBan,
    ISetEditorCategoryLimitPick,
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
import TurnExplanation from "./TurnExplanation";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import {ReactSortable} from "react-sortablejs";
import {PresetEditorTurn} from "./PresetEditorTurn";
import DraftOption, {ImageUrls} from "../../models/DraftOption";
import PresetEditorCivSelection from "./PresetEditorCivSelection";
import PresetEditorCustomOptions from "./PresetEditorCustomOptions";
import Civilisation from "../../models/Civilisation";
import Aoe3Civilisation from "../../models/Aoe3Civilisation";
import Aoe4Civilisation from "../../models/Aoe4Civilisation";
import {RouteComponentProps} from "react-router";
import CivilisationSet from "../../models/CivilisationSet";
import Aoe2Map from "../../models/Aoe2Map";
import Aoe1Civilisation from "../../models/Aoe1Civilisation";

interface Props extends WithTranslation, RouteComponentProps<any> {
    preset: Preset | null,
    onSetEditorPreset: (preset: Preset) => ISetEditorPreset,
    onValueChange: (turn: Turn | null, index: number) => ISetEditorTurn,
    onDuplicateTurn: (index: number) => IDuplicateEditorTurn,
    onTurnOrderChange: (turns: Turn[]) => ISetEditorTurnOrder,
    onPresetNameChange: (value: string) => ISetEditorName,
    onPresetDraftOptionsChange: (value: DraftOption[]) => ISetEditorDraftOptions
    onSetCategoryLimitPick: (key: string, value: number | null) => ISetEditorCategoryLimitPick
    onSetCategoryLimitBan: (key: string, value: number | null) => ISetEditorCategoryLimitBan
}

interface State {
    defaultDraftOptions: DraftOption[],
    activeCivilisationSet: String
}

class PresetEditor extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {defaultDraftOptions: Civilisation.ALL, activeCivilisationSet: CivilisationSet.AOE2};
    }

    componentDidMount(): void {
        document.title = 'Preset Editor – AoE Captains Mode';
        const civs = this.getInitialCivilisationSet();
        switch (civs) {
            case CivilisationSet.AOE1:
                this.setState({defaultDraftOptions: Aoe1Civilisation.ALL, activeCivilisationSet: CivilisationSet.AOE1});
                break;
            default:
            case CivilisationSet.AOE2:
                this.setState({defaultDraftOptions: Civilisation.ALL, activeCivilisationSet: CivilisationSet.AOE2});
                break;
            case CivilisationSet.AOE2MAPS:
                this.setState({defaultDraftOptions: Aoe2Map.ALL, activeCivilisationSet: CivilisationSet.AOE2MAPS});
                break;
            case CivilisationSet.AOE3:
                this.setState({defaultDraftOptions: Aoe3Civilisation.ALL, activeCivilisationSet: CivilisationSet.AOE3});
                break;
            case CivilisationSet.AOE4:
                this.setState({defaultDraftOptions: Aoe4Civilisation.ALL, activeCivilisationSet: CivilisationSet.AOE4});
                break;
            case CivilisationSet.CUSTOM:
                this.setState({defaultDraftOptions: [], activeCivilisationSet: CivilisationSet.CUSTOM});
                break;
        }
        if (this.props.preset === null || this.props.preset === undefined) {
            this.props.onSetEditorPreset(Preset.NEW);
            switch (civs) {
                case CivilisationSet.AOE1:
                    this.props.onPresetDraftOptionsChange([...Aoe1Civilisation.ALL]);
                    break;
                default:
                case CivilisationSet.AOE2:
                    this.props.onPresetDraftOptionsChange([...Civilisation.ALL_ACTIVE]);
                    break;
                case CivilisationSet.AOE2MAPS:
                    this.props.onPresetDraftOptionsChange([]);
                    break;
                case CivilisationSet.AOE3:
                    this.props.onPresetDraftOptionsChange([...Aoe3Civilisation.ALL]);
                    break;
                case CivilisationSet.AOE4:
                    this.props.onPresetDraftOptionsChange([...Aoe4Civilisation.ALL]);
                    break;
                case CivilisationSet.CUSTOM:
                    this.configureSampleDraftOption();
                    break;
            }
        }
    }

    private getInitialCivilisationSet() {
        if (this.props.location.hash) {
            return this.props.location.hash.replace("#", '');
        }
        if (this.props.preset) {
            if (this.props.preset.encodedCivilisations) {
                return CivilisationSet.AOE2;
            }
            if (this.props.preset.draftOptions) {
                const draftOptions = this.props.preset.draftOptions;
                if (draftOptions.every(draftOption => Aoe1Civilisation.ALL.some(aoe1civ => DraftOption.equals(draftOption, aoe1civ)))) {
                    return CivilisationSet.AOE1;
                } else if (draftOptions.every(draftOption => Civilisation.ALL.some(aoe2civ => DraftOption.equals(draftOption, aoe2civ)))) {
                    return CivilisationSet.AOE2;
                } else if (draftOptions.every(draftOption => Aoe2Map.ALL.some(aoe2map => DraftOption.equals(draftOption, aoe2map)))) {
                    return CivilisationSet.AOE2MAPS;
                } else if (draftOptions.every(draftOption => Aoe3Civilisation.ALL.some(aoe3civ => DraftOption.equals(draftOption, aoe3civ)))) {
                    return CivilisationSet.AOE3;
                } else if (draftOptions.every(draftOption => Aoe4Civilisation.ALL.some(aoe4civ => DraftOption.equals(draftOption, aoe4civ)))) {
                    return CivilisationSet.AOE4;
                } else {
                    return CivilisationSet.CUSTOM;
                }
            }
        }
        return CivilisationSet.AOE2;
    }

    public render() {
        if (this.props.preset === null || this.props.preset === undefined) {
            return null;
        }

        const turns = this.props.preset.turns.map((turn: Turn, index: number) =>
            <PresetEditorTurn index={index}
                              turn={turn}
                              className="columns is-mobile preset-editor-row"
                              onValueChange={this.props.onValueChange}
                              onDuplicateTurn={this.props.onDuplicateTurn}
                              key={turn.id}/>);

        const customOptions: boolean = this.state.defaultDraftOptions.length === 0;
        let optionsSelection = customOptions ? <PresetEditorCustomOptions/> : <PresetEditorCivSelection availableOptions={this.state.defaultDraftOptions}/>;

        const categories = [...new Set(this.props.preset.options.map(value => value.category))].sort();
        const categoryInputsPick = categories.map(category => <li>{category}: <input type="number"
                                                                                     value={this.props.preset?.categoryLimits.pick[category]}
                                                                                     onChange={event => this.props.onSetCategoryLimitPick(category, parseInt(event.target.value) || null)}
                                                                                     key={'categoryInputsBan-' + category}/>
        </li>);
        const categoryInputsBan = categories.map(category => <li>{category}: <input type="number"
                                                                                    value={this.props.preset?.categoryLimits.ban[category]}
                                                                                    onChange={event => this.props.onSetCategoryLimitBan(category, parseInt(event.target.value) || null)}
                                                                                    key={'categoryInputsBan-' + category}/>
        </li>);

        return (
            <React.Fragment>
                <div className={'content box'}>
                    <h3>1. <Trans i18nKey="presetEditor.availableDraftOptions">Available Draft Options</Trans></h3>

                    <div className="tabs is-boxed is-small civ-selector-tabs">
                        <ul>
                            <li className={this.state.activeCivilisationSet === CivilisationSet.AOE1 ? "is-active" : ""}>
                                <a href="#aoe1" onClick={() => {
                                    this.setState({
                                        defaultDraftOptions: Aoe1Civilisation.ALL,
                                        activeCivilisationSet: CivilisationSet.AOE1
                                    });
                                    this.props.onPresetDraftOptionsChange([...Aoe1Civilisation.ALL]);
                                }}>
                                    <Trans i18nKey="presetEditor.aoe1Civs">AoE1 civs</Trans>
                                </a>
                            </li>
                            <li className={this.state.activeCivilisationSet === CivilisationSet.AOE2 ? "is-active" : ""}>
                                <a href="#aoe2" onClick={() => {
                                    this.setState({
                                        defaultDraftOptions: Civilisation.ALL,
                                        activeCivilisationSet: CivilisationSet.AOE2
                                    });
                                    this.props.onPresetDraftOptionsChange([...Civilisation.ALL_ACTIVE]);
                                }}>
                                    <Trans i18nKey="presetEditor.aoe2Civs">AoE2 civs</Trans>
                                </a>
                            </li>
                            <li className={this.state.activeCivilisationSet === CivilisationSet.AOE2MAPS ? "is-active" : ""}>
                                <a href="#aoe2maps" onClick={() => {
                                    this.setState({
                                        defaultDraftOptions: Aoe2Map.ALL,
                                        activeCivilisationSet: CivilisationSet.AOE2MAPS
                                    });
                                    this.props.onPresetDraftOptionsChange([]);
                                }}>
                                    <Trans i18nKey="presetEditor.aoe2Maps">AoE2 maps</Trans>
                                </a>
                            </li>
                            <li className={this.state.activeCivilisationSet === CivilisationSet.AOE3 ? "is-active" : ""}>
                                <a href="#aoe3" onClick={() => {
                                    this.setState({
                                        defaultDraftOptions: Aoe3Civilisation.ALL,
                                        activeCivilisationSet: CivilisationSet.AOE3
                                    });
                                    this.props.onPresetDraftOptionsChange([...Aoe3Civilisation.ALL]);
                                }}>
                                    <Trans i18nKey="presetEditor.aoe3Civs">AoE3 civs</Trans>
                                </a>
                            </li>
                            <li className={this.state.activeCivilisationSet === CivilisationSet.AOE4 ? "is-active" : ""}>
                                <a href="#aoe4" onClick={() => {
                                    this.setState({
                                        defaultDraftOptions: Aoe4Civilisation.ALL,
                                        activeCivilisationSet: CivilisationSet.AOE4
                                    });
                                    this.props.onPresetDraftOptionsChange([...Aoe4Civilisation.ALL]);
                                }}>
                                    <Trans i18nKey="presetEditor.aoe4Civs">AoE4 civs</Trans>
                                </a>
                            </li>
                            <li className={this.state.activeCivilisationSet === CivilisationSet.CUSTOM ? "is-active" : ""}>
                                <a href="#custom" onClick={() => {
                                    this.setState({
                                        defaultDraftOptions: [],
                                        activeCivilisationSet: CivilisationSet.CUSTOM
                                    });
                                    this.configureSampleDraftOption();
                                }}>
                                    <Trans i18nKey="presetEditor.customOptions">Custom</Trans>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {optionsSelection}

                    {this.state.activeCivilisationSet !== CivilisationSet.CUSTOM &&
                        <button className="button is-small mt-3" onClick={() => {
                        this.setState({
                            defaultDraftOptions: [],
                            activeCivilisationSet: CivilisationSet.CUSTOM
                        });
                    }}><Trans i18nKey="presetEditor.transform">Transform into individual draft options</Trans>
                    </button>}

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

                    <h3>3. <Trans i18nKey="presetEditor.categoryLimits">Category Limits</Trans></h3>
                    <p><Trans i18nKey="presetEditor.categoryLimitsExplanation">Here you may, for each category,
                        define a maximum number of times Draft Options from it can be picked or banned.
                        Leave the input emtpy to set no limit for a category.</Trans></p>
                    <div className="columns">
                        <div className="column">
                            <h4><Trans i18nKey="presetEditor.categoryLimitsPick">Pick</Trans></h4>
                            <ul>{categoryInputsPick}</ul>
                        </div>
                        <div className="column">
                            <h4><Trans i18nKey="presetEditor.categoryLimitsBan">Ban</Trans></h4>
                            <ul>{categoryInputsBan}</ul>
                        </div>
                    </div>
                    <hr/>

                    <h3>4. <Trans i18nKey="presetEditor.createSaveDraft">Create Draft or Save</Trans></h3>
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

    private configureSampleDraftOption() {
        const draftOption = new DraftOption(Civilisation.AZTECS.id, Civilisation.AZTECS.name);
        for (let imageUrlsKey in draftOption.imageUrls) {
            const key = imageUrlsKey as keyof ImageUrls;
            draftOption.imageUrls[key] = 'https://aoe2cm.net' + draftOption.imageUrls[key];
        }
        this.props.onPresetDraftOptionsChange([draftOption]);
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
        onDuplicateTurn: (index: number) => dispatch(actions.duplicateEditorTurn(index)),
        onTurnOrderChange: (turns: Turn[]) => dispatch(actions.setEditorTurnOrder(turns)),
        onPresetDraftOptionsChange: (value: DraftOption[]) => dispatch(actions.setEditorDraftOptions(value)),
        onPresetNameChange: (value: string) => dispatch(actions.setEditorName(value)),
        onSetCategoryLimitPick: (key: string, value: number | null) => dispatch(actions.setEditorCategoryLimitPick(key, value)),
        onSetCategoryLimitBan: (key: string, value: number | null) => dispatch(actions.setEditorCategoryLimitBan(key, value)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PresetEditor));
