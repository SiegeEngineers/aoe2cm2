import * as React from "react";
import {ISetEditorDraftOptions} from "../../actions";
import {WithTranslation, withTranslation} from "react-i18next";
import DraftOption from "../../models/DraftOption";

interface IProps extends WithTranslation {
    presetOptions: DraftOption[],
    value: DraftOption,
    disabled: boolean,
    onPresetDraftOptionsChange?: (value: DraftOption[]) => ISetEditorDraftOptions,
}

export const PresetOptionCheckbox = withTranslation()(({presetOptions, value, onPresetDraftOptionsChange, disabled, t}: IProps) =>
    <label className="checkbox is-inline-block civ-select" style={{width: "20%", padding: 5}}>
        <input type='checkbox'
               checked={presetOptions.includes(value)}
               disabled={disabled}
               onClick={
                   () => {
                       if (onPresetDraftOptionsChange !== undefined) {
                           if (presetOptions.includes(value)) {
                               presetOptions.splice(presetOptions.indexOf(value), 1);
                               onPresetDraftOptionsChange(presetOptions);
                           } else {
                               presetOptions.push(value);
                               onPresetDraftOptionsChange(presetOptions);
                           }
                       }
                   }
               }/>
        &nbsp;{t('civs.' + value.name)}
    </label>
);
