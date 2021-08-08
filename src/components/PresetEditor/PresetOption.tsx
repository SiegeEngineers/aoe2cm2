import * as React from "react";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import DraftOption from "../../models/DraftOption";
import {ApplicationState} from "../../types";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {ISetEditorDraftOptions} from "../../actions";
import {connect} from "react-redux";
import Preset from "../../models/Preset";
import DragIcon from "mdi-react/DragIcon";
import DraftOptionPanel from "../draft/DraftOptionPanel";
import DraftOptionPanelType from "../../constants/DraftOptionPanelType";
import Player from "../../constants/Player";

interface IProps extends WithTranslation {
    draftOptionIndex: number,
    preset: Preset | null,
    onPresetDraftOptionsChange: (value: DraftOption[]) => ISetEditorDraftOptions
}

class PresetOption extends React.Component<IProps, object> {

    public render() {
        if (this.props.preset === null || this.props.preset === undefined || this.props.preset.draftOptions === undefined) {
            return null;
        }
        const draftOption = this.props.preset.draftOptions[this.props.draftOptionIndex];
        return (
            <div className={'columns'}>
                <div className="column is-1 has-text-vcentered is-size-5 has-text-grey has-text-left">
                    <DragIcon className="has-text-grey has-cursor-grab is-drag-handle is-size-3"/>
                    {this.props.draftOptionIndex + 1}</div>
                <div className="column box">
                    <div>
                        <div className="field is-horizontal">
                            <div className={'field-label is-small'}>
                                <label className="label">
                                    <Trans i18nKey="presetEditor.option.name">Name</Trans>
                                </label>
                            </div>
                            <div className={'field-body'}>
                                <input className="input is-small" type="text" placeholder="The name of the option"
                                       value={draftOption.name}
                                       onChange={(event) => {
                                           this.updateName(event.target.value);
                                       }}/>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className={'field-label is-small'}>
                                <label className="label is-small">
                                    <Trans i18nKey="presetEditor.option.unitImageUrl">Unit image url</Trans>
                                </label>
                            </div>
                            <div className={'field-body'}>
                                <input className="input is-small" type="text" placeholder="https://example.org/unit.png"
                                       value={draftOption.imageUrls.unit}
                                       onChange={(event) => {
                                           this.updateImageUrlUnit(event.target.value);
                                       }}/>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className={'field-label is-small'}>
                                <label className="label is-small">
                                    <Trans i18nKey="presetEditor.option.emblemImageUrl">Emblem image url</Trans>
                                </label>
                            </div>
                            <div className={'field-body'}>
                                <input className="input is-small" type="text"
                                       placeholder="https://example.org/emblem.png"
                                       value={draftOption.imageUrls.emblem}
                                       onChange={(event) => {
                                           this.updateImageUrlEmblem(event.target.value);
                                       }}/>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className={'field-label is-small'}>
                                <label className="label is-small">
                                    <Trans i18nKey="presetEditor.option.animatedUnitImageUrlLeft">Animated unit image url (left)</Trans>
                                </label>
                            </div>
                            <div className={'field-body'}>
                                <input className="input is-small" type="text"
                                       placeholder="https://example.org/unit-animated-left.apng"
                                       value={draftOption.imageUrls.animated_left}
                                       onChange={(event) => {
                                           this.updateImageUrlAnimatedLeft(event.target.value);
                                       }}/>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className={'field-label is-small'}>
                                <label className="label is-small">
                                    <Trans i18nKey="presetEditor.option.animatedUnitImageUrlRight">Animated unit image url (right)</Trans>
                                </label>
                            </div>
                            <div className={'field-body'}>
                                <input className="input is-small" type="text"
                                       placeholder="https://example.org/unit-animated-right.png"
                                       value={draftOption.imageUrls.animated_right}
                                       onChange={(event) => {
                                           this.updateImageUrlAnimatedRight(event.target.value);
                                       }}/>
                            </div>
                        </div>
                        <div className={'columns options-preview'}>
                            <div className={'column has-text-centered'}>
                                <DraftOptionPanel draftOption={draftOption} active={false}
                                                  draftOptionPanelType={DraftOptionPanelType.CHOICE} nextAction={0}
                                                  displayOnly={true} iconStyle={'units'}/>
                            </div>
                            <div className={'column has-text-centered'}>
                                <DraftOptionPanel draftOption={draftOption} active={false}
                                                  draftOptionPanelType={DraftOptionPanelType.CHOICE} nextAction={0}
                                                  displayOnly={true} iconStyle={'emblems'}/>
                            </div>
                            <div className={'column has-text-centered'}>
                                <DraftOptionPanel draftOption={draftOption} active={false}
                                                  draftOptionPanelType={DraftOptionPanelType.CHOICE} nextAction={0}
                                                  displayOnly={true} smooch={true} side={Player.HOST}
                                                  iconStyle={'units-animated'}/>
                            </div>
                            <div className={'column has-text-centered'}>
                                <DraftOptionPanel draftOption={draftOption} active={false}
                                                  draftOptionPanelType={DraftOptionPanelType.CHOICE} nextAction={0}
                                                  displayOnly={true} smooch={true} side={Player.GUEST}
                                                  iconStyle={'units-animated'}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="column is-1 has-text-vcentered flex-justify-center">
                    <button className="delete is-medium" onClick={() => {
                        if (this.props.preset === undefined || this.props.preset === null || this.props.preset.draftOptions === undefined) {
                            return;
                        }
                        const draftOptions = [...this.props.preset.draftOptions];
                        draftOptions.splice(this.props.draftOptionIndex, 1);
                        this.props.onPresetDraftOptionsChange(draftOptions);
                    }}/>
                </div>
            </div>
        );
    }

    private updateName(value: string) {
        if (this.props.preset === null || this.props.preset === undefined || this.props.preset.draftOptions === undefined) {
            return;
        }
        const draftOptions = [...this.props.preset?.draftOptions];
        const oldDraftOption = draftOptions[this.props.draftOptionIndex];
        draftOptions[this.props.draftOptionIndex] = new DraftOption(value, value, oldDraftOption.imageUrls);
        this.props.onPresetDraftOptionsChange(draftOptions);
    }

    private updateImageUrlUnit(value: string) {
        if (this.props.preset === null || this.props.preset === undefined || this.props.preset.draftOptions === undefined) {
            return;
        }
        const draftOptions = [...this.props.preset?.draftOptions];
        const oldDraftOption = draftOptions[this.props.draftOptionIndex];
        draftOptions[this.props.draftOptionIndex] = new DraftOption(oldDraftOption.id, oldDraftOption.name, {
            unit: value,
            emblem: oldDraftOption.imageUrls.emblem,
            animated_left: oldDraftOption.imageUrls.animated_left,
            animated_right: oldDraftOption.imageUrls.animated_right,
        });
        this.props.onPresetDraftOptionsChange(draftOptions);
    }

    private updateImageUrlEmblem(value: string) {
        if (this.props.preset === null || this.props.preset === undefined || this.props.preset.draftOptions === undefined) {
            return;
        }
        const draftOptions = [...this.props.preset?.draftOptions];
        const oldDraftOption = draftOptions[this.props.draftOptionIndex];
        draftOptions[this.props.draftOptionIndex] = new DraftOption(oldDraftOption.id, oldDraftOption.name, {
            unit: oldDraftOption.imageUrls.unit,
            emblem: value,
            animated_left: oldDraftOption.imageUrls.animated_left,
            animated_right: oldDraftOption.imageUrls.animated_right,
        });
        this.props.onPresetDraftOptionsChange(draftOptions);
    }

    private updateImageUrlAnimatedLeft(value: string) {
        if (this.props.preset === null || this.props.preset === undefined || this.props.preset.draftOptions === undefined) {
            return;
        }
        const draftOptions = [...this.props.preset?.draftOptions];
        const oldDraftOption = draftOptions[this.props.draftOptionIndex];
        draftOptions[this.props.draftOptionIndex] = new DraftOption(oldDraftOption.id, oldDraftOption.name, {
            unit: oldDraftOption.imageUrls.unit,
            emblem: oldDraftOption.imageUrls.emblem,
            animated_left: value,
            animated_right: oldDraftOption.imageUrls.animated_right,
        });
        this.props.onPresetDraftOptionsChange(draftOptions);
    }

    private updateImageUrlAnimatedRight(value: string) {
        if (this.props.preset === null || this.props.preset === undefined || this.props.preset.draftOptions === undefined) {
            return;
        }
        const draftOptions = [...this.props.preset?.draftOptions];
        const oldDraftOption = draftOptions[this.props.draftOptionIndex];
        draftOptions[this.props.draftOptionIndex] = new DraftOption(oldDraftOption.id, oldDraftOption.name, {
            unit: oldDraftOption.imageUrls.unit,
            emblem: oldDraftOption.imageUrls.emblem,
            animated_left: oldDraftOption.imageUrls.animated_left,
            animated_right: value,
        });
        this.props.onPresetDraftOptionsChange(draftOptions);
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PresetOption));