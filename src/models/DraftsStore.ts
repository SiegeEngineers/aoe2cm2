import Draft from "./Draft";
import {DraftEvent} from "./DraftEvent";
import Preset from "./Preset";
import Player from "./Player";
import Turn from "./Turn";

export class DraftsStore {
    private drafts: Map<string, Draft> = new Map<string, Draft>();

    public createDraft(draftId: string, draft: Draft) {
        this.assertDraftDoesNotExist(draftId);
        this.drafts.set(draftId, draft);
    }

    public initDraft(draftId: string) {
        this.assertDraftDoesNotExist(draftId);
        this.drafts.set(draftId, new Draft('…', '…', Preset.SIMPLE));
    }

    public addDraftEvent(draftId: string, draftEvent: DraftEvent) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        draft.events.push(draftEvent);
        draft.nextAction++;
    }

    public hasNextAction(draftId: string): boolean {
        const draft: Draft = this.getDraftOrThrow(draftId);
        return draft.preset.turns.length > draft.events.length;
    }

    public getExpectedAction(draftId: string): Turn | null {
        const draft: Draft = this.getDraftOrThrow(draftId);
        if (draft.events.length < draft.preset.turns.length) {
            return draft.preset.turns[draft.events.length];
        }
        return null;
    }

    public getDraftIds(): string[] {
        return Array.from(this.drafts.keys());
    }

    public has(draftId: string): boolean {
        return this.drafts.has(draftId);
    }

    public setPlayerName(draftId: string, player: Player, name: string) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        switch (player) {
            case Player.HOST:
                draft.nameHost = name;
                break;
            case Player.GUEST:
                draft.nameGuest = name;
                break;
        }
    }

    public setPlayerReady(draftId: string, player: Player) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        switch (player) {
            case Player.HOST:
                draft.hostReady = true;
                break;
            case Player.GUEST:
                draft.guestReady = true;
                break;
        }
    }

    public getPlayerNames(draftId: string) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        return {nameHost: draft.nameHost, nameGuest: draft.nameGuest};
    }

    public getEvents(draftId: string): DraftEvent[] {
        const draft: Draft = this.getDraftOrThrow(draftId);
        return draft.events;
    }

    public getNextAction(draftId: string): number {
        const draft: Draft = this.getDraftOrThrow(draftId);
        return draft.nextAction;
    }

    public draftCanBeStarted(draftId: string) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        return draft.hostReady && draft.guestReady;
    }

    private getDraftOrThrow(draftId: string): Draft {
        if (!this.has(draftId)) {
            throw new Error(`Draft with id ${draftId} not found`);
        }
        return this.drafts.get(draftId) as Draft;
    }

    private assertDraftDoesNotExist(draftId: string) {
        if (this.has(draftId)) {
            throw new Error(`Draft with id ${draftId} already exists`);
        }
    }
}