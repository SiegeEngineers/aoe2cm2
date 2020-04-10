import * as React from "react";
import {CivilisationEncoder} from "../../util/CivilisationEncoder";
import Civilisation from "../../models/Civilisation";
import {ISetEditorCivilisations} from "../../actions";

interface IProps {
    presetCivilisations: Civilisation[],
    value: Civilisation,
    onPresetCivilisationsChange: (value: string) => ISetEditorCivilisations,
}

export const PresetCivilisationCheckbox = ({presetCivilisations, value, onPresetCivilisationsChange}: IProps) =>
    <div className="pure-u-1-4">
        <label><input type='checkbox' checked={presetCivilisations.includes(value)} onClick={() => {
            if (presetCivilisations.includes(value)) {
                presetCivilisations.splice(presetCivilisations.indexOf(value), 1);
                onPresetCivilisationsChange(CivilisationEncoder.encodeCivilisationArray(presetCivilisations));
            } else {
                presetCivilisations.push(value);
                onPresetCivilisationsChange(CivilisationEncoder.encodeCivilisationArray(presetCivilisations));
            }
        }
        }/> {value.name}</label>
    </div>;
