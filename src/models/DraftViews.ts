import Draft from "./Draft";
import Player from "../constants/Player";
import {DraftEvent} from "../types/DraftEvent";
import {Util} from "../util/Util";
import PlayerEvent from "./PlayerEvent";
import Action from "../constants/Action";
import ActionType from "../constants/ActionType";
import {logger} from "../util/Logger";

class DraftViews {
    public hostEvents: DraftEvent[];
    public guestEvents: DraftEvent[];
    public specEvents: DraftEvent[];
    public actualDraft: Draft;

    constructor(initial: Draft) {
        this.hostEvents = [...initial.events];
        this.guestEvents = [...initial.events];
        this.specEvents = [...initial.events];
        this.actualDraft = initial;
    }

    public getDraftForPlayer(player: Player) {
        switch (player) {
            case Player.HOST:
                return this.getHostDraft();
            case Player.GUEST:
                return this.getGuestDraft();
            default:
                return this.getSpecDraft();
        }
    }

    public getHostDraft(): Draft {
        const copy = Draft.from(this.actualDraft);
        copy.events = this.hostEvents;
        return copy;
    }

    public getGuestDraft(): Draft {
        const copy = Draft.from(this.actualDraft);
        copy.events = this.guestEvents;
        return copy;
    }

    public getSpecDraft(): Draft {
        const copy = Draft.from(this.actualDraft)
        copy.events = this.specEvents;
        return copy;
    }

    public getActualDraft(): Draft {
        return this.actualDraft;
    }

    addDraftEvent(draftEvent: DraftEvent) {
        draftEvent.offset = this.actualDraft.getOffset();
        this.actualDraft.events.push(draftEvent);
        this.actualDraft.nextAction++;

        if (Util.isPlayerEvent(draftEvent)) {
            let specMessage = draftEvent;
            if (this.isLastActionHidden()) {
                const hiddenCivilisation = Util.getHiddenCivilisationForActionType(draftEvent.actionType);
                specMessage = new PlayerEvent(draftEvent.player, draftEvent.actionType, hiddenCivilisation);
            }
            this.specEvents.push(specMessage);
            if (draftEvent.player === Player.HOST) {
                this.hostEvents.push(draftEvent);
                this.guestEvents.push(specMessage);
            }
            if (draftEvent.player === Player.GUEST) {
                this.guestEvents.push(draftEvent);
                this.hostEvents.push(specMessage);
            }
        } else {
            this.hostEvents.push(draftEvent);
            this.guestEvents.push(draftEvent);
            this.specEvents.push(draftEvent);
        }
    }

    getLastEventForHost(): DraftEvent {
        const draft = this.getHostDraft();
        let draftEvent = draft.events[draft.events.length - 1];
        logger.debug('getLastEventForHost: returning ', draftEvent);
        return draftEvent;
    }

    getLastEventForGuest(): DraftEvent {
        const draft = this.getGuestDraft();
        let draftEvent = draft.events[draft.events.length - 1];
        logger.debug('getLastEventForGuest: returning ', draftEvent);
        return draftEvent;
    }

    getLastEventForSpec(): DraftEvent {
        const draft = this.getSpecDraft();
        let draftEvent = draft.events[draft.events.length - 1];
        logger.debug('getLastEventForSpec: returning ', draftEvent);
        return draftEvent;
    }

    reveal(action: Action) {
        switch (action) {
            case Action.REVEAL_ALL:
                this.hostEvents = [...this.actualDraft.events];
                this.guestEvents = [...this.actualDraft.events];
                this.specEvents = [...this.actualDraft.events];
                break;
            case Action.REVEAL_PICKS:
                this.doReveal(ActionType.PICK);
                break;
            case Action.REVEAL_BANS:
                this.doReveal(ActionType.BAN);
                break;
            case Action.REVEAL_SNIPES:
                this.doReveal(ActionType.SNIPE);
                break;
            default:
                throw new Error('Illegal/Unknown Action: ' + action);
        }
    }

    private doReveal(actionType: ActionType) {
        for (const view of [this.hostEvents, this.guestEvents, this.specEvents]) {
            for (let i = 0; i < view.length; i++) {
                let currentEvent = view[i];
                if (Util.isPlayerEvent(currentEvent)
                    && (currentEvent as PlayerEvent).actionType === actionType) {
                    view[i] = this.actualDraft.events[i];
                }
            }
        }
    }

    private isLastActionHidden(): boolean {
        const lastAction = this.actualDraft.nextAction - 1;
        if (lastAction < 0 || lastAction >= this.actualDraft.preset.turns.length) {
            return false;
        }
        return Util.isHidden(this.actualDraft.preset.turns[lastAction]);
    }

    shouldRestartOrCancelCountdown() {
        if (this.actualDraft.nextAction > 0) {
            return !this.actualDraft.preset.turns[this.actualDraft.nextAction - 1].parallel;
        }
        return true;
    }
}

export default DraftViews
