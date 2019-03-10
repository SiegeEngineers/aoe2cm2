import {DraftsStore} from "./DraftsStore";
import {DraftEvent} from "./DraftEvent";
import {ValidationId} from "./ValidationId";
import {Validation} from "./Validation";

export class Validator {
    private readonly draftsStore: DraftsStore;

    constructor(draftsStore: DraftsStore) {
        this.draftsStore = draftsStore;
    }

    public validateAndApply(draftId: string, message: DraftEvent): ValidationId[] {
        const validationErrors: ValidationId[] = [];

        for (const validation of Validation.ALL) {
            const validationResult = validation.apply(draftId, this.draftsStore, message);
            if (validationResult !== undefined) {
                if (!validationErrors.includes(validationResult)) {
                    validationErrors.push(validationResult);
                }
            }
        }

        if (validationErrors.length === 0) {
            console.log('Applying DraftEvent', message);
            this.draftsStore.addDraftEvent(draftId, message);
        }

        return validationErrors;
    }
}