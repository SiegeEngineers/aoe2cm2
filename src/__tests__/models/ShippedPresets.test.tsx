import * as fs from "fs";
import * as path from "path";
import Preset from "../../models/Preset";
import {Validator} from "../../models/Validator";

const shipped = ['simple', 'pools', 'tournament'];

it.each(shipped)('the shipped preset %s loads, validates and survives a round trip', (id) => {
    const pojo = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '..', 'presets', `${id}.json`), 'utf8'));
    const preset = Preset.fromPojo(pojo) as Preset;
    expect(Validator.validatePreset(preset)).toEqual([]);
    const again = Preset.fromPojo(JSON.parse(JSON.stringify(preset))) as Preset;
    expect(JSON.stringify(again)).toEqual(JSON.stringify(preset));
});
