import Draft from "./Draft";
import {DraftEvent} from "./DraftEvent";
import Preset from "./Preset";
import Player from "./Player";

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
        this.assertDraftExists(draftId);
        const draft: Draft = this.drafts.get(draftId) as Draft;
        draft.events.push(draftEvent);
    }

    public getDraftIds(): string[] {
        return Array.from(this.drafts.keys());
    }

    public has(draftId: string): boolean {
        return this.drafts.has(draftId);
    }

    public setPlayerName(draftId: string, player: Player, name: string) {
        this.assertDraftExists(draftId);
        const draft: Draft = this.drafts.get(draftId) as Draft;
        switch (player) {
            case Player.HOST:
                draft.nameHost = name;
                break;
            case Player.GUEST:
                draft.nameGuest = name;
                break;
        }
    }

    public getPlayerNames(draftId: string) {
        this.assertDraftExists(draftId);
        const draft: Draft = this.drafts.get(draftId) as Draft;
        return {nameHost: draft.nameHost, nameGuest: draft.nameGuest};
    }

    private assertDraftExists(draftId: string) {
        if (!this.has(draftId)) {
            throw new Error(`Draft with id ${draftId} not found`);
        }
    }

    private assertDraftDoesNotExist(draftId: string) {
        if (this.has(draftId)) {
            throw new Error(`Draft with id ${draftId} already exists`);
        }
    }

}