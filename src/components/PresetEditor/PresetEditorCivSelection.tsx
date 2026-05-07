import * as React from "react";
import Preset from "../../models/Preset";
import * as actions from "../../actions";
import {ISetEditorDraftOptions} from "../../actions";
import {PresetOptionCheckbox} from "./PresetOptionCheckbox";
import {withTranslation, WithTranslation} from "react-i18next";
import DraftOption from "../../models/DraftOption";
import {ApplicationState} from "../../types";
import {Dispatch} from "redux";
import {connect} from "react-redux";

interface Props extends WithTranslation {
    preset: Preset | null,
    availableOptions: DraftOption[],
    onPresetDraftOptionsChange: (value: DraftOption[]) => ISetEditorDraftOptions,
}

type SortOrder = 'default' | 'az' | 'za';

interface State {
    searchQuery: string;
    sortOrder: SortOrder;
    deselectedTags: string[];
    tagDropdownOpen: boolean;
}

class PresetEditorCivSelection extends React.Component<Props, State> {

    private static readonly SORT_STORAGE_KEY = 'presetEditor.sortOrder';
    private dropdownRef = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
        const stored = localStorage.getItem(PresetEditorCivSelection.SORT_STORAGE_KEY) as SortOrder | null;
        this.state = {searchQuery: '', sortOrder: stored ?? 'default', deselectedTags: [], tagDropdownOpen: false};
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleOutsideClick);
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevProps.availableOptions !== this.props.availableOptions) {
            this.setState({searchQuery: '', deselectedTags: [], tagDropdownOpen: false});
        }
        if (prevState.sortOrder !== this.state.sortOrder) {
            localStorage.setItem(PresetEditorCivSelection.SORT_STORAGE_KEY, this.state.sortOrder);
        }
    }

    private handleOutsideClick(e: MouseEvent) {
        if (this.state.tagDropdownOpen && this.dropdownRef.current && !this.dropdownRef.current.contains(e.target as Node)) {
            this.setState({tagDropdownOpen: false});
        }
    }

    public render() {
        if (this.props.preset === null || this.props.preset === undefined) {
            return null;
        }

        const presetOptions = this.props.preset.options;

        const allTags = [...new Set(this.props.availableOptions.reduce<string[]>((acc, opt) => acc.concat(opt.tags), []))].sort();

        const query = this.state.searchQuery.toLowerCase();
        let filtered = [...this.props.availableOptions];

        if (query) {
            filtered = filtered.filter(opt => opt.name.toLowerCase().includes(query));
        }
        if (this.state.deselectedTags.length > 0) {
            filtered = filtered.filter(opt =>
                opt.tags.length === 0 || opt.tags.some(tag => !this.state.deselectedTags.includes(tag))
            );
        }

        if (this.state.sortOrder === 'az') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (this.state.sortOrder === 'za') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        }

        const civs = filtered.map((value: DraftOption, index: number) =>
            <PresetOptionCheckbox presetOptions={presetOptions} value={value}
                                  key={index}
                                  disabled={false}
                                  onPresetDraftOptionsChange={this.props.onPresetDraftOptionsChange}/>);

        return (
            <div>
                <div className="is-flex mb-2" style={{gap: '0.5rem', alignItems: 'center'}}>
                    <div className="control has-icons-right" style={{maxWidth: '20rem'}}>
                        <input
                            className="input is-small"
                            type="text"
                            placeholder={this.props.t('presetEditor.searchOptions', 'Search options…')}
                            value={this.state.searchQuery}
                            onChange={e => this.setState({searchQuery: e.target.value})}
                        />
                        {this.state.searchQuery && (
                            <span className="icon is-right"
                                  style={{pointerEvents: 'all', cursor: 'pointer', color: 'white'}}
                                  onClick={() => this.setState({searchQuery: ''})}>
                                <i>×</i>
                            </span>
                        )}
                    </div>
                    <div className="select is-small">
                        <select value={this.state.sortOrder}
                                onChange={e => this.setState({sortOrder: e.target.value as SortOrder})}>
                            <option value="default">{this.props.t('presetEditor.sortDefault', 'Default')}</option>
                            <option value="az">A → Z</option>
                            <option value="za">Z → A</option>
                        </select>
                    </div>
                    {allTags.length > 0 && (
                        <div ref={this.dropdownRef}
                             className={`dropdown${this.state.tagDropdownOpen ? ' is-active' : ''}`}>
                            <div className="dropdown-trigger">
                                <button className="button is-small"
                                        onClick={() => this.setState({tagDropdownOpen: !this.state.tagDropdownOpen})}>
                                    <span>{this.props.t('presetEditor.filterByTag', 'Filter by tag')}</span>
                                    {this.state.deselectedTags.length > 0 && (
                                        <span className="tag is-warning is-small ml-1">
                                            {allTags.length - this.state.deselectedTags.length}/{allTags.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                            <div className="dropdown-menu">
                                <div className="dropdown-content">
                                    {allTags.map(tag => {
                                        const checked = !this.state.deselectedTags.includes(tag);
                                        return (
                                            <label key={tag} className="dropdown-item" style={{cursor: 'pointer'}}>
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => {
                                                        const next = checked
                                                            ? [...this.state.deselectedTags, tag]
                                                            : this.state.deselectedTags.filter(t => t !== tag);
                                                        this.setState({deselectedTags: next});
                                                    }}
                                                />
                                                {' '}{tag}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="is-flex" style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {civs}
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
        onPresetDraftOptionsChange: (value: DraftOption[]) => dispatch(actions.setEditorDraftOptions(value)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PresetEditorCivSelection));
