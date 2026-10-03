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
import DraftOption from "../../models/DraftOption";
import Pool from "../../models/Pool";
import PresetEditorCivSelection from "./PresetEditorCivSelection";
import PresetEditorCustomOptions from "./PresetEditorCustomOptions";
import PresetEditorPools from "./PresetEditorPools";
import {EditorPools} from "../../util/EditorPools";
import Civilisation from "../../models/Civilisation";
import Aoe3Civilisation from "../../models/Aoe3Civilisation";
import Aoe4Civilisation from "../../models/Aoe4Civilisation";
import {RouteComponentProps} from "react-router";
import CivilisationSet from "../../models/CivilisationSet";
import Aoe2Map from "../../models/Aoe2Map";
import Aoe1Civilisation from "../../models/Aoe1Civilisation";
import Aoe4Map from "../../models/Aoe4Map";
import AomGod from "../../models/AomGod";

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
    activePool: number,
    poolOptions: DraftOption[],
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
            case CivilisationSet.AOE4MAPS:
                this.setState({defaultDraftOptions: Aoe4Map.ALL, activeCivilisationSet: CivilisationSet.AOE4MAPS});
                break;
            case CivilisationSet.AOMGODS:
                this.setState({defaultDraftOptions: AomGod.ALL, activeCivilisationSet: CivilisationSet.AOMGODS});
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
                case CivilisationSet.AOE4MAPS:
                    this.props.onPresetDraftOptionsChange([]);
                    break;
                case CivilisationSet.AOMGODS:
                    this.props.onPresetDraftOptionsChange([...AomGod.ALL]);
                    break;
                case CivilisationSet.CUSTOM:
                    this.configureSampleDraftOption();
                    break;
            }
        }
    }

    /** The option list behind each tab of the editor, in the order the tabs offer them. */
    private static readonly OPTION_SETS: Array<[CivilisationSet, DraftOption[]]> = [
        [CivilisationSet.AOE1, Aoe1Civilisation.ALL],
        [CivilisationSet.AOE2, Civilisation.ALL],
        [CivilisationSet.AOE2MAPS, Aoe2Map.ALL],
        [CivilisationSet.AOE3, Aoe3Civilisation.ALL],
        [CivilisationSet.AOE4, Aoe4Civilisation.ALL],
        [CivilisationSet.AOE4MAPS, Aoe4Map.ALL],
        [CivilisationSet.AOMGODS, AomGod.ALL],
    ];

    componentDidUpdate(prevProps: Props): void {
        // Removing the pool on show leaves the index where it was, and the first pool always
        // carries the default id, so neither the index nor the id alone says the pool has changed.
        if (PresetEditor.shownPoolKey(prevProps) === PresetEditor.shownPoolKey(this.props)) {
            return;
        }
        const set = this.civilisationSetFor(this.props.poolOptions);
        const match = PresetEditor.OPTION_SETS.find(([name]) => name === set);
        this.setState({
            activeCivilisationSet: set,
            defaultDraftOptions: match === undefined ? [] : match[1],
        });
    }

    private static shownPoolKey(props: Props): string {
        const pool = PresetEditor.shownPool(props);
        return (pool === undefined ? '' : pool.id) + '/' + (props.preset === null ? 0 : props.preset.pools.length);
    }

    private static shownPool(props: Props): Pool | undefined {
        return props.preset === null ? undefined : props.preset.pools[props.activePool];
    }

    /** A pool name fits on the new-turn button up to this many characters. */
    private static readonly POOL_NAME_ON_BUTTON = 18;

    /** Which pool a new turn joins is decided a section further up the page, so the button says it. */
    private newTurnLabel() {
        const pool = PresetEditor.shownPool(this.props);
        if (pool === undefined || this.props.preset === null || !this.props.preset.hasSeveralPools()) {
            return <Trans i18nKey="presetEditor.new">New</Trans>;
        }
        const limit = PresetEditor.POOL_NAME_ON_BUTTON;
        const name = pool.name.length > limit ? pool.name.substring(0, limit) + '…' : pool.name;
        return this.props.t('presetEditor.newInPool', {defaultValue: 'New in {{pool}}', pool: name});
    }

    /** A new turn is a pick, and it belongs to the pool the editor is showing. */
    private addPlayerTurn(player: Player) {
        const pool = PresetEditor.shownPool(this.props);
        if (this.props.preset === null || pool === undefined) {
            return;
        }
        const turn = new Turn(player, Action.PICK, Exclusivity.GLOBAL, false, false);
        this.props.onValueChange(Turn.withPoolId(turn, pool.id), this.props.preset.turns.length);
    }

    /** The tab a pool belongs to, or the custom one if its options are not all from a single set. */
    private civilisationSetFor(draftOptions: DraftOption[]): CivilisationSet {
        if (draftOptions.length === 0) {
            return CivilisationSet.AOE2;
        }
        const match = PresetEditor.OPTION_SETS.find(([, known]) => draftOptions.every(
            draftOption => known.some(value => DraftOption.equals(draftOption, value))));
        return match === undefined ? CivilisationSet.CUSTOM : match[0];
    }

    private getInitialCivilisationSet() {
        if (this.props.location.hash) {
            return this.props.location.hash.replace("#", '');
        }
        return this.civilisationSetFor(this.props.poolOptions);
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

                    <PresetEditorPools/>

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
                                    this.props.onPresetDraftOptionsChange([...Aoe4Civilisation.ALL_ACTIVE]);
                                }}>
                                    <Trans i18nKey="presetEditor.aoe4Civs">AoE4 civs</Trans>
                                </a>
                            </li>
                            <li className={this.state.activeCivilisationSet === CivilisationSet.AOE4MAPS ? "is-active" : ""}>
                                <a href="#aoe4maps" onClick={() => {
                                    this.setState({
                                        defaultDraftOptions: Aoe4Map.ALL,
                                        activeCivilisationSet: CivilisationSet.AOE4MAPS
                                    });
                                    this.props.onPresetDraftOptionsChange([]);
                                }}>
                                    <Trans i18nKey="presetEditor.aoe4Maps">AoE4 Maps</Trans>
                                </a>
                            </li>
                            <li className={this.state.activeCivilisationSet === CivilisationSet.AOMGODS ? "is-active" : ""}>
                                <a href="#aomgods" onClick={() => {
                                    this.setState({
                                        defaultDraftOptions: AomGod.ALL,
                                        activeCivilisationSet: CivilisationSet.AOMGODS
                                    });
                                    this.props.onPresetDraftOptionsChange([...AomGod.ALL]);
                                }}>
                                    <Trans i18nKey="presetEditor.aomgods">AoM Gods</Trans>
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
                                <button className="button" onClick={() => this.addPlayerTurn(Player.HOST)}>
                                    + {this.newTurnLabel()}
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
                                <button className="button" onClick={() => this.addPlayerTurn(Player.GUEST)}>
                                    + {this.newTurnLabel()}
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
                            <NewDraftButton preset={this.props.preset} private={false}/>
                        </p>
                        <p className="control">
                            <SavePresetButton preset={this.props.preset}/>
                        </p>
                        <p className="control">
                            <NewDraftButton preset={this.props.preset} private={true}/>
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
            draftOption.imageUrls[imageUrlsKey] = 'https://aoe2cm.net' + draftOption.imageUrls[imageUrlsKey];
        }
        this.props.onPresetDraftOptionsChange([draftOption]);
    }
}

export function mapStateToProps(state: ApplicationState) {
    return {
        preset: state.presetEditor.editorPreset,
        activePool: EditorPools.activeIndex(state.presetEditor),
        poolOptions: EditorPools.activeOptions(state.presetEditor),
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
