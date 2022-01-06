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

class PresetEditorCivSelection extends React.Component<Props, object> {

    public render() {
        if (this.props.preset === null || this.props.preset === undefined) {
            return null;
        }

        const presetOptions = this.props.preset.options;

        const civs = this.props.availableOptions.map((value: DraftOption, index: number) =>
            <PresetOptionCheckbox presetOptions={presetOptions} value={value}
                                  key={index}
                                  disabled={false}
                                  onPresetDraftOptionsChange={this.props.onPresetDraftOptionsChange}/>);

        return (
            <div className="is-flex" style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {civs}
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
