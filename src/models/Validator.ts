import {DraftsStore} from "./DraftsStore";
import {DraftEvent} from "../types/DraftEvent";
import {ValidationId} from "../constants/ValidationId";
import {Validation} from "./Validation";
import {Util} from "../util/Util";
import PlayerEvent from "./PlayerEvent";
import Draft from "./Draft";
import Preset from "./Preset";
import {PresetValidation} from "./PresetValidation";
import {logger} from "../util/Logger";

export class Validator {
    private readonly draftsStore: DraftsStore;

    constructor(draftsStore: DraftsStore) {
        this.draftsStore = draftsStore;
    }

    public validateAndApply(draftId: string, message: DraftEvent): ValidationId[] {
        let validationErrors: ValidationId[] = [];

        if (Util.isPlayerEvent(message)) {
            const playerEvent: PlayerEvent = message as PlayerEvent;

            validationErrors = Validator.checkAllValidations(draftId, this.draftsStore, playerEvent);
        }

        if (validationErrors.length === 0) {
            logger.info('Applying DraftEvent', message, {draftId});
            this.draftsStore.addDraftEvent(draftId, message);
        }

        return validationErrors;
    }

    public static checkAllValidations(draftId: string, draftsStore: DraftsStore, playerEvent: PlayerEvent) {
        if (!draftsStore.has(draftId)) {
            return [ValidationId.VLD_000];
        }
        const draft: Draft = draftsStore.getDraftOrThrow(draftId);
        const validationErrors: ValidationId[] = [];
        for (const validation of Validation.ALL) {
            const validationResult = validation.apply(draft, playerEvent);
            if (validationResult !== undefined) {
                if (!validationErrors.includes(validationResult)) {
                    validationErrors.push(validationResult);
                }
            }
        }
        return validationErrors;
    }

    public static validatePreset(preset: Preset | undefined) {
        if (preset === undefined) {
            return [ValidationId.VLD_900];
        }
        const validationErrors: ValidationId[] = [];
        for (let validation of PresetValidation.ALL) {
            const validationResult = validation.apply(preset);
            if (validationResult !== undefined) {
                if (!validationErrors.includes(validationResult)) {
                    validationErrors.push(validationResult);
                }
            }
        }
        return validationErrors;
    }
}
