import Draft from "./Draft";
import Player from "./Player";
import {DraftEvent} from "./DraftEvent";

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
        this.hostEvents.push(draftEvent);
        this.guestEvents.push(draftEvent);
        this.specEvents.push(draftEvent);
        this.actualDraft.nextAction++;
    }
}

export default DraftViews