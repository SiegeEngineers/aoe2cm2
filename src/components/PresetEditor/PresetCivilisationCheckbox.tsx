import * as React from "react";
import {CivilisationEncoder} from "../../util/CivilisationEncoder";
import Civilisation from "../../models/Civilisation";
import {ISetEditorCivilisations} from "../../actions";
import {WithTranslation, withTranslation} from "react-i18next";

interface IProps extends WithTranslation{
    presetCivilisations: Civilisation[],
    value: Civilisation,
    onPresetCivilisationsChange: (value: string) => ISetEditorCivilisations,
}

export const PresetCivilisationCheckbox = withTranslation()(({presetCivilisations, value, onPresetCivilisationsChange, t}: IProps) =>
    <label className="checkbox is-inline-block civ-select" style={{width: "20%", padding: 5}}>
        <input type='checkbox'
               defaultChecked={presetCivilisations.includes(value)}
               onClick={
                   () => {
                       if (presetCivilisations.includes(value)) {
                           presetCivilisations.splice(presetCivilisations.indexOf(value), 1);
                           onPresetCivilisationsChange(CivilisationEncoder.encodeCivilisationArray(presetCivilisations));
                       } else {
                           presetCivilisations.push(value);
                           onPresetCivilisationsChange(CivilisationEncoder.encodeCivilisationArray(presetCivilisations));
                       }
                   }
               }/>
        &nbsp;{t('civs.' + value.name)}
    </label>
);
