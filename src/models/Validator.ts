import {DraftsStore} from "./DraftsStore";
import {DraftEvent} from "./DraftEvent";
import {ValidationId} from "./ValidationId";
import {Validation} from "./Validation";
import {Util} from "./Util";
import PlayerEvent from "./PlayerEvent";

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
            console.log('Applying DraftEvent', message);
            this.draftsStore.addDraftEvent(draftId, message);
        }

        return validationErrors;
    }

    public static checkAllValidations(draftId: string, draftsStore: DraftsStore, playerEvent: PlayerEvent) {
        const validationErrors: ValidationId[] = [];
        for (const validation of Validation.ALL) {
            const validationResult = validation.apply(draftId, draftsStore, playerEvent);
            if (validationResult !== undefined) {
                if (!validationErrors.includes(validationResult)) {
                    validationErrors.push(validationResult);
                }
            }
        }
        return validationErrors;
    }
}