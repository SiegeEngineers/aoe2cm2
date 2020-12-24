import {ValidationId} from "../constants/ValidationId";
import {DraftEvent} from "../types/DraftEvent";
import {actionTypeFromAction} from "../constants/ActionType";
import PlayerEvent from "./PlayerEvent";
import Player from "../constants/Player";
import {Util} from "../util/Util";
import Draft from "./Draft";
import DraftViews from "./DraftViews";
import ValidCivs from "./ValidCivs";

export class Validation {
    public static readonly VLD_000: Validation = new Validation(ValidationId.VLD_000, (draft: Draft, draftEvent: DraftEvent) => {
        if (!draft.draftCanBeStarted()) {
            return false;
        }
        if (!draft.hasNextAction()) {
            return false;
        }
        return true;
    });

    public static readonly VLD_001: Validation = new Validation(ValidationId.VLD_001, (draft: Draft, draftEvent: DraftEvent) => {
        const expectedActions = draft.getExpectedActions();
        if (expectedActions.length > 0) {
            for (let expectedAction of expectedActions) {
                if (expectedAction.player === draftEvent.player) {
                    return true;
                }
            }
            return false;
        }
        return true;
    });

    public static readonly VLD_002: Validation = new Validation(ValidationId.VLD_002, (draft: Draft, draftEvent: DraftEvent) => {
        const expectedActions = draft.getExpectedActions();
        if (expectedActions.length > 0) {
            for (let expectedAction of expectedActions) {
                if (Util.isPlayerEvent(draftEvent)) {
                    const playerEvent = draftEvent as PlayerEvent;
                    const expectedActionType = actionTypeFromAction(expectedAction.action);
                    if (playerEvent.actionType === expectedActionType) {
                        return true;
                    }
                }
            }
            return false;
        }
        return true;
    });

    public static toDraftViews: (draft: Draft) => DraftViews = (draft: Draft) => {
        const draftCopy = Draft.from(draft);
        draftCopy.events.length = 0;
        draftCopy.nextAction = 0;
        const draftViews = new DraftViews(draftCopy);
        for (let event of draft.events) {
            if (Util.isAdminEvent(event)) {
                draftViews.reveal(event.action);
            }
            draftViews.addDraftEvent(event);
        }
        return draftViews;
    }

    public static readonly VLD_010: Validation = new Validation(ValidationId.VLD_010, (draft: Draft, draftEvent: DraftEvent) => {
        if (!draft.hasNextAction()) {
            return true;
        }

        if (Util.isPlayerEvent(draftEvent)) {
            const draftViews = Validation.toDraftViews(draft);
            let draftCopy = (draftEvent.player === Player.HOST) ? draftViews.getHostDraft() : draftViews.getGuestDraft();
            const validCivs = new ValidCivs(draftCopy);
            return validCivs.validateDraftEvent(draftEvent);
        }
        return true;
    });

    public static readonly ALL: Validation[] = [
        Validation.VLD_000,
        Validation.VLD_001,
        Validation.VLD_002,
        Validation.VLD_010
    ];

    private readonly validationId: ValidationId;

    private readonly validate: (draft: Draft, draftEvent: DraftEvent) => boolean;

    constructor(validationId: ValidationId, validate: (draft: Draft, draftEvent: DraftEvent) => boolean) {
        this.validationId = validationId;
        this.validate = validate;
    }

    public apply(draft: Draft, draftEvent: DraftEvent): ValidationId | undefined {
        if (!this.validate(draft, draftEvent)) {
            return this.validationId;
        }
        return undefined;
    }
}