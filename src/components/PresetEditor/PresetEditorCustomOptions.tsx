import * as React from "react";
import Preset from "../../models/Preset";
import * as actions from "../../actions";
import {ISetEditorDraftOptions} from "../../actions";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import DraftOption from "../../models/DraftOption";
import {ApplicationState} from "../../types";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import PresetOption from "./PresetOption";
import {ReactSortable} from "react-sortablejs";

interface Props extends WithTranslation {
    preset: Preset | null,
    onPresetDraftOptionsChange: (value: DraftOption[]) => ISetEditorDraftOptions
}

class PresetEditorCustomOptions extends React.Component<Props, object> {

    public render() {
        if (this.props.preset === null || this.props.preset === undefined) {
            return null;
        }

        const presetOptions = this.props.preset.options;

        const options = presetOptions.map((value: DraftOption, index: number) => <PresetOption draftOptionIndex={index}
                                                                                               key={index}/>);
        return (
            <>
                <div className="message is-warning">
                    <div className="message-body">
                        <Trans i18nKey="presetEditor.warning">
                        <strong>Attention!</strong><br/>
                        This is advanced stuff, and you probably do not need it if you just want to create a regular old civilisation draft.<br/>
                        <strong>Please use image urls which you expect to still be working in about ten years or more!</strong>
                        </Trans>
                    </div>
                </div>
                <div>
                    <ReactSortable<DraftOption> list={presetOptions}
                                                setList={(newState: DraftOption[]) => this.props.onPresetDraftOptionsChange(newState)}
                                                handle=".is-drag-handle"
                                                animation={150}>
                        {options}
                    </ReactSortable>
                </div>
                <div className="is-flex is-justify-content-center pt-4"
                     style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    <button className={'button'} onClick={() => this.addNewDraftOption()}>+ <Trans i18nKey="presetEditor.new">New</Trans></button>
                </div>
            </>
        );
    }

    private addNewDraftOption() {
        if (this.props.preset === null || this.props.preset === undefined || this.props.preset.draftOptions === undefined) {
            return;
        }
        this.props.onPresetDraftOptionsChange(
            [
                ...this.props.preset.draftOptions,
                new DraftOption('', '', {
                    unit: '',
                    emblem: '',
                    animated_left: '',
                    animated_right: '',
                })
            ]
        )
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PresetEditorCustomOptions));
