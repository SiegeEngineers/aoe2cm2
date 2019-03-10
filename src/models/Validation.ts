import {ValidationId} from "./ValidationId";
import {DraftEvent} from "./DraftEvent";
import {DraftsStore} from "./DraftsStore";
import {fromAction} from "./ActionType";
import PlayerEvent from "./PlayerEvent";

export class Validation {
    public static readonly VLD_000: Validation = new Validation(ValidationId.VLD_000, (draftId: string, draftsStore: DraftsStore, draftEvent: DraftEvent) => {
        if (!draftsStore.has(draftId)) {
            return false;
        }
        if (!draftsStore.hasNextAction(draftId)) {
            return false;
        }
        // TODO both players must be ready
        return true;
    });
    public static readonly VLD_001: Validation = new Validation(ValidationId.VLD_001, (draftId: string, draftsStore: DraftsStore, draftEvent: DraftEvent) => {
        const expectedAction = draftsStore.getExpectedAction(draftId);
        if (expectedAction !== null) {
            return expectedAction.player === draftEvent.player;
        }
        return true;
    });
    public static readonly VLD_002: Validation = new Validation(ValidationId.VLD_002, (draftId: string, draftsStore: DraftsStore, draftEvent: DraftEvent) => {
        const expectedAction = draftsStore.getExpectedAction(draftId);
        if (expectedAction !== null) {
            if (draftEvent.hasOwnProperty('actionType')) {
                const playerEvent = draftEvent as PlayerEvent;
                const expectedActionType = fromAction(expectedAction.action);
                return playerEvent.actionType === expectedActionType;
            }
        }
        return true;
    });
    public static readonly VLD_100: Validation = new Validation(ValidationId.VLD_100, (draftId: string, draftsStore: DraftsStore, draftEvent: DraftEvent) => {
        return true;
    });
    public static readonly VLD_101: Validation = new Validation(ValidationId.VLD_101, (draftId: string, draftsStore: DraftsStore, draftEvent: DraftEvent) => {
        return true;
    });
    public static readonly VLD_102: Validation = new Validation(ValidationId.VLD_102, (draftId: string, draftsStore: DraftsStore, draftEvent: DraftEvent) => {
        return true;
    });
    public static readonly VLD_103: Validation = new Validation(ValidationId.VLD_103, (draftId: string, draftsStore: DraftsStore, draftEvent: DraftEvent) => {
        return true;
    });
    public static readonly VLD_200: Validation = new Validation(ValidationId.VLD_200, (draftId: string, draftsStore: DraftsStore, draftEvent: DraftEvent) => {
        return true;
    });
    public static readonly VLD_300: Validation = new Validation(ValidationId.VLD_300, (draftId: string, draftsStore: DraftsStore, draftEvent: DraftEvent) => {
        return true;
    });
    public static readonly VLD_301: Validation = new Validation(ValidationId.VLD_301, (draftId: string, draftsStore: DraftsStore, draftEvent: DraftEvent) => {
        return true;
    });

    public static readonly ALL: Validation[] = [
        Validation.VLD_000,
        Validation.VLD_001,
        Validation.VLD_002,

        Validation.VLD_100,
        Validation.VLD_101,
        Validation.VLD_102,
        Validation.VLD_103,

        Validation.VLD_200,

        Validation.VLD_300,
        Validation.VLD_301
    ];

    private readonly validationId: ValidationId;
    private readonly validate: (draftId: string, draftsStore: DraftsStore, draftEvent: DraftEvent) => boolean;

    constructor(validationId: ValidationId, validate: (draftId: string, draftsStore: DraftsStore, draftEvent: DraftEvent) => boolean) {
        this.validationId = validationId;
        this.validate = validate;
    }

    public apply(draftId: string, draftsStore: DraftsStore, draftEvent: DraftEvent): ValidationId | undefined {
        if (!this.validate(draftId, draftsStore, draftEvent)) {
            return this.validationId;
        }
        return undefined;
    }
}