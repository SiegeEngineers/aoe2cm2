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

interface State {
    searchQuery: string;
}

class PresetEditorCivSelection extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {searchQuery: ''};
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.availableOptions !== this.props.availableOptions) {
            this.setState({searchQuery: ''});
        }
    }

    public render() {
        if (this.props.preset === null || this.props.preset === undefined) {
            return null;
        }

        const presetOptions = this.props.preset.options;

        const query = this.state.searchQuery.toLowerCase();
        const filtered = query
            ? this.props.availableOptions.filter(opt => opt.name.toLowerCase().includes(query))
            : this.props.availableOptions;

        const civs = filtered.map((value: DraftOption, index: number) =>
            <PresetOptionCheckbox presetOptions={presetOptions} value={value}
                                  key={index}
                                  disabled={false}
                                  onPresetDraftOptionsChange={this.props.onPresetDraftOptionsChange}/>);

        return (
            <div>
                <div className="control has-icons-right mb-2" style={{maxWidth: '20rem'}}>
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
