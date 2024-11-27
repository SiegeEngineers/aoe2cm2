import Preset from "./Preset";
import {IDraftState} from "../types";
import {DraftEvent} from "../types/DraftEvent";
import Turn from "./Turn";
import PlayerEvent from "./PlayerEvent";
import {Util} from "../util/Util";
import AdminEvent from "./AdminEvent";

class Draft implements IDraftState {
    public nameHost: string;
    public nameGuest: string;
    public hostConnected: boolean;
    public guestConnected: boolean;
    public hostReady: boolean;
    public guestReady: boolean;
    public readonly preset: Preset;
    public nextAction: number = 0;
    public events: DraftEvent[] = [];
    public startTimestamp: number;

    constructor(nameHost: string, nameGuest: string, preset: Preset) {
        this.nameHost = nameHost;
        this.nameGuest = nameGuest;
        this.preset = preset;
        this.hostConnected = false;
        this.guestConnected = false;
        this.hostReady = false;
        this.guestReady = false;
        this.startTimestamp = Date.now();
    }

    public static from(source: Draft): Draft {
        const draft: Draft = Draft.fromDraftState(source);
        draft.nextAction = source.nextAction;
        return draft;
    }

    public static fromDraftState(source: IDraftState): Draft {
        const draft: Draft = new Draft(source.nameHost, source.nameGuest, source.preset as Preset);
        draft.hostConnected = source.hostConnected;
        draft.guestConnected = source.guestConnected;
        draft.hostReady = source.hostReady;
        draft.guestReady = source.guestReady;
        draft.events = this.copyEvents(source.events);
        draft.startTimestamp = source.startTimestamp;
        draft.nextAction = source.events.length;
        return draft;
    }

    static copyEvents(events: DraftEvent[]) {
        return events.map(draftEvent => {
            return Draft.copyEvent(draftEvent);
        });
    }

    static copyEvent(draftEvent: DraftEvent): DraftEvent {
        if (Util.isPlayerEvent(draftEvent)) {
            return PlayerEvent.from(draftEvent);
        } else {
            return AdminEvent.from(draftEvent);
        }
    }

    public static playersAreReady(draft: IDraftState) {
        return draft.hostReady && draft.guestReady;
    }

    public hasNextAction(offset: number = 0): boolean {
        return this.events.length + offset < this.preset.turns.length;
    }

    public draftCanBeStarted(): boolean {
        return this.hostReady && this.guestReady;
    }

    public getExpectedActions(offset: number = 0): Turn[] {
        if (!Draft.playersAreReady(this)) {
            return [];
        }
        if (this.hasNextAction(offset)) {
            const expectedActions = [];
            const nextIndex = this.events.length + offset;
            const nextTurn = this.preset.turns[nextIndex];

            if (nextIndex > 0) {
                const lastTurn = this.preset.turns[nextIndex - 1];
                if (lastTurn.parallel) {
                    const lastEvent = this.events[nextIndex - 1];
                    if (Util.isPlayerEvent(lastEvent) && lastEvent.executingPlayer === lastTurn.executingPlayer) {
                        expectedActions.push(this.preset.turns[nextIndex]);
                    } else {
                        expectedActions.push(this.preset.turns[nextIndex - 1]);
                    }
                    return expectedActions;
                }
            }

            expectedActions.push(nextTurn);
            if (nextTurn.parallel) {
                expectedActions.push(this.preset.turns[nextIndex + 1]);
            }
            return expectedActions;
        }
        return [];
    }

    public getOffset() {
        return Date.now() - this.startTimestamp;
    }


}

export default Draft