import Draft from "./Draft";
import Player from "./Player";
import {DraftEvent} from "./DraftEvent";
import {Util} from "./Util";
import PlayerEvent from "./PlayerEvent";

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

    public getHostDraft():Draft {
        const copy = {...this.actualDraft} as Draft;
        copy.events = this.hostEvents;
        return copy;
    }

    public getGuestDraft():Draft {
        const copy = {...this.actualDraft} as Draft;
        copy.events = this.guestEvents;
        return copy;
    }

    public getSpecDraft():Draft {
        const copy = {...this.actualDraft} as Draft;
        copy.events = this.specEvents;
        return copy;
    }

    public getActualDraft(): Draft {
        return this.actualDraft;
    }

    addDraftEvent(draftEvent: DraftEvent) {
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
        console.log(draft);
        let draftEvent = draft.events[draft.events.length - 1];
        console.log('getLastEventForHost: returning ', draftEvent);
        return draftEvent;
    }

    getLastEventForGuest(): DraftEvent {
        const draft = this.getGuestDraft();
        let draftEvent = draft.events[draft.events.length - 1];
        console.log('getLastEventForGuest: returning ', draftEvent);
        return draftEvent;
    }

    getLastEventForSpec(): DraftEvent {
        const draft = this.getSpecDraft();
        let draftEvent = draft.events[draft.events.length - 1];
        console.log('getLastEventForSpec: returning ', draftEvent);
        return draftEvent;
    }

    revealAll() {
        this.hostEvents = [...this.actualDraft.events];
        this.guestEvents = [...this.actualDraft.events];
        this.specEvents = [...this.actualDraft.events];
    }

    private isLastActionHidden(): boolean {
        const lastAction = this.actualDraft.nextAction - 1;
        if (lastAction < 0 || lastAction >= this.actualDraft.preset.turns.length) {
            return false;
        }
        return Util.isHidden(this.actualDraft.preset.turns[lastAction]);
    }
}

export default DraftViews
