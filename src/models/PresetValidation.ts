import {ValidationId} from "../constants/ValidationId";
import Preset from "./Preset";
import Player from "../constants/Player";
import Action from "../constants/Action";

export class PresetValidation {
    public static readonly VLD_901: PresetValidation = new PresetValidation(ValidationId.VLD_901, (preset: Preset) => {
        let lastTurnHadParallelMarker = false;
        for (let turn of preset.turns) {
            if (turn.parallel) {
                if (lastTurnHadParallelMarker) {
                    return false;
                }
                lastTurnHadParallelMarker = true;
            } else {
                lastTurnHadParallelMarker = false;
            }
        }
        return true;
    });

    public static readonly VLD_902: PresetValidation = new PresetValidation(ValidationId.VLD_902, (preset: Preset) => {
        for (let turn of preset.turns) {
            if (turn.parallel) {
                if (turn.player === Player.NONE) {
                    return false;
                }
            }
        }
        return true;
    });

    public static readonly VLD_903: PresetValidation = new PresetValidation(ValidationId.VLD_903, (preset: Preset) => {
        let lastTurnHadParallelMarker = false;
        for (let turn of preset.turns) {
            if (lastTurnHadParallelMarker && turn.player === Player.NONE) {
                return false;
            }
            lastTurnHadParallelMarker = turn.parallel;
        }
        return true;
    });

    public static readonly VLD_904: PresetValidation = new PresetValidation(ValidationId.VLD_904, (preset: Preset) => {
        return !(preset.turns.length > 0 && preset.turns[preset.turns.length - 1].parallel);
    });

    public static readonly VLD_905: PresetValidation = new PresetValidation(ValidationId.VLD_905, (preset: Preset) => {
        let lastTurnHadParallelMarker = false;
        let lastTurnPlayer = Player.NONE;
        for (let turn of preset.turns) {
            if (lastTurnHadParallelMarker && lastTurnPlayer === turn.player) {
                return false;
            }
            lastTurnHadParallelMarker = turn.parallel;
            lastTurnPlayer = turn.player;
        }
        return true;
    });

    public static readonly VLD_906: PresetValidation = new PresetValidation(ValidationId.VLD_906, (preset: Preset) => {
        let needsReveal = false;
        for (let turn of preset.turns) {
            if (turn.action === Action.BAN && turn.hidden) {
                needsReveal = true;
            } else if (turn.action === Action.REVEAL_ALL || turn.action === Action.REVEAL_BANS) {
                needsReveal = false;
            } else if (turn.action === Action.PICK && needsReveal) {
                return false;
            }
        }
        return true;
    });

    public static readonly ALL: PresetValidation[] = [
        PresetValidation.VLD_901,
        PresetValidation.VLD_902,
        PresetValidation.VLD_903,
        PresetValidation.VLD_904,
        PresetValidation.VLD_905,
        PresetValidation.VLD_906,
    ];

    private readonly validationId: ValidationId;

    private readonly validate: (preset: Preset) => boolean;

    constructor(validationId: ValidationId, validate: (preset: Preset) => boolean) {
        this.validationId = validationId;
        this.validate = validate;
    }

    public apply(preset: Preset): ValidationId | undefined {
        if (!this.validate(preset)) {
            return this.validationId;
        }
        return undefined;
    }

}