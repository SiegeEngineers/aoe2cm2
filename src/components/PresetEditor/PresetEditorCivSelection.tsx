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
}

class PresetEditorCivSelection extends React.Component<Props, State> {

    private static readonly SORT_STORAGE_KEY = 'presetEditor.sortOrder';

    constructor(props: Props) {
        super(props);
        const storedSortOrder = this.getStoredSortOrder();
        this.state = {searchQuery: '', sortOrder: storedSortOrder ?? 'default'};
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevProps.availableOptions !== this.props.availableOptions) {
            this.setState({searchQuery: ''});
        }
        if (prevState.sortOrder !== this.state.sortOrder) {
            this.setStoredSortOrder()
        }
    }

    private getStoredSortOrder(): SortOrder | null {
        try {
            return localStorage.getItem(PresetEditorCivSelection.SORT_STORAGE_KEY) as SortOrder | null
        } catch (e) {
            return null;
        }
    }

    private setStoredSortOrder() {
        try {
            localStorage.setItem(PresetEditorCivSelection.SORT_STORAGE_KEY, this.state.sortOrder);
        } catch (e) {
            // pass
        }
    }

    public render() {
        if (this.props.preset === null || this.props.preset === undefined) {
            return null;
        }

        const presetOptions = this.props.preset.options;

        const query = this.state.searchQuery.toLowerCase();
        let filtered = query
            ? this.props.availableOptions.filter(opt => opt.name.toLowerCase().includes(query))
            : [...this.props.availableOptions];

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
                            placeholder={this.props.t('presetEditor.filterOptions', 'Filter options…')}
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
