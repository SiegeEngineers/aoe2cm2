import Preset from "../models/Preset";
import {Util} from "./Util";
import fs from "fs";
import {logger} from "./Logger";
import path from "path";

export const PresetUtil = {
    newPresetId(): string {
        return Util.newDraftId();
    },

    presetExists(presetId: string): boolean {
        const path = `presets/${presetId}.json`;
        return fs.existsSync(path);
    },

    createPreset(preset: Preset, presetDirectory: string) {
        let presetId = PresetUtil.newPresetId();
        while (PresetUtil.presetExists(presetId)) {
            presetId += Util.randomChar();
        }
        preset.presetId = presetId;
        const presetPath = path.join(presetDirectory,`${presetId}.json`);
        fs.writeFile(presetPath, JSON.stringify(preset), (err) => {
            if (err) throw err;
            logger.info(`Preset saved to ${presetPath}`, {presetId});
        });
        return presetId;
    },
};
