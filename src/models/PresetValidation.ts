import {ValidationId} from "../constants/ValidationId";
import Preset from "./Preset";
import Player from "../constants/Player";
import Action from "../constants/Action";
import {Util} from "../util/Util";

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
            if (lastTurnHadParallelMarker && lastTurnPlayer === turn.executingPlayer) {
                return false;
            }
            lastTurnHadParallelMarker = turn.parallel;
            lastTurnPlayer = turn.executingPlayer;
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

    public static readonly VLD_907: PresetValidation = new PresetValidation(ValidationId.VLD_907, (preset: Preset) => {
        let needsPickReveal = false;
        let needsBanReveal = false;
        let needsSnipeReveal = false;
        for (let turn of preset.turns) {
            if (turn.action === Action.PICK && turn.hidden) {
                needsPickReveal = true;
            } else if (turn.action === Action.BAN && turn.hidden) {
                needsBanReveal = true;
            } else if (turn.action === Action.SNIPE && turn.hidden) {
                needsSnipeReveal = true;
            } else if (turn.action === Action.STEAL && turn.hidden) {
                needsPickReveal = true;
                needsSnipeReveal = true;
            }

            if (turn.action === Action.REVEAL_ALL || turn.action === Action.REVEAL_PICKS) {
                needsPickReveal = false;
            }
            if (turn.action === Action.REVEAL_ALL || turn.action === Action.REVEAL_BANS) {
                needsBanReveal = false;
            }
            if (turn.action === Action.REVEAL_ALL || turn.action === Action.REVEAL_SNIPES) {
                needsSnipeReveal = false;
            }
        }
        return !needsPickReveal && !needsBanReveal && !needsSnipeReveal;
    });

    public static readonly VLD_908: PresetValidation = new PresetValidation(ValidationId.VLD_908, (preset: Preset) => {
        return preset.turns.length > 0;
    });

    public static readonly VLD_909: PresetValidation = new PresetValidation(ValidationId.VLD_909, (preset: Preset) => {
        if (preset.presetId) {
            return Util.isValidPresetId(preset.presetId);
        }
        return true;
    });

    public static readonly VLD_910: PresetValidation = new PresetValidation(ValidationId.VLD_910, (preset: Preset) => {
        if (preset.draftOptions) {
            for (let draftOption of preset.draftOptions) {
                if (!draftOption.id) {
                    return false;
                }
            }
        }
        return true;
    });

    public static readonly VLD_911: PresetValidation = new PresetValidation(ValidationId.VLD_911, (preset: Preset) => {
        if (preset.draftOptions) {
            const ids = new Set();
            for (let draftOption of preset.draftOptions) {
                if (ids.has(draftOption.id)) {
                    return false;
                }
                ids.add(draftOption.id);
            }
        }
        return true;
    });

    public static readonly VLD_912: PresetValidation = new PresetValidation(ValidationId.VLD_912, (preset: Preset) => {
        for (let turn of preset.turns) {
            if (turn.player === Player.NONE) {
                if (turn.action === Action.STEAL || turn.action === Action.SNIPE) {
                    return false;
                }
            }
        }
        return true;
    });

    public static readonly VLD_913: PresetValidation = new PresetValidation(ValidationId.VLD_913, (preset: Preset) => {
        for (let turn of preset.turns) {
            if (turn.player === Player.NONE) {
                if (turn.hidden) {
                    return false;
                }
            }
        }
        return true;
    });

    public static readonly VLD_914: PresetValidation = new PresetValidation(ValidationId.VLD_914, (preset: Preset) => {
        for (let turn of preset.turns) {
            if ([Action.REVEAL_ALL, Action.REVEAL_PICKS, Action.REVEAL_BANS, Action.REVEAL_SNIPES].includes(turn.action)) {
                if (turn.player !== Player.NONE) {
                    return false;
                }
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
        PresetValidation.VLD_907,
        PresetValidation.VLD_908,
        PresetValidation.VLD_909,
        PresetValidation.VLD_910,
        PresetValidation.VLD_911,
        PresetValidation.VLD_912,
        PresetValidation.VLD_913,
        PresetValidation.VLD_914,
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