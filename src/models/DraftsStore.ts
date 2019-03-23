import Draft from "./Draft";
import {DraftEvent} from "./DraftEvent";
import Preset from "./Preset";
import Player from "./Player";
import Turn from "./Turn";
import Civilisation from "./Civilisation";
import PlayerEvent from "./PlayerEvent";
import Action from "./Action";
import {Util} from "./Util";

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
        if (!Draft.playersAreReady(draft)) {
            return null;
        }
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

    public draftCanBeStarted(draftId: string): boolean {
        const draft: Draft = this.getDraftOrThrow(draftId);
        return draft.hostReady && draft.guestReady;
    }

    public getGlobalBans(draftId: string): Civilisation[] {
        const draft: Draft = this.getDraftOrThrow(draftId);
        const globalBanTurns: boolean[] = draft.preset.turns
            .map((turn): boolean => {
                return turn.action === Action.GLOBAL_BAN
            });
        const globalBans: Civilisation[] = [];
        draft.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (globalBanTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                globalBans.push(playerEvent.civilisation);
            }
        });
        return globalBans;
    }

    public getBansForPlayer(draftId: string, player: Player): Civilisation[] {
        const draft: Draft = this.getDraftOrThrow(draftId);
        if (player === Player.NONE) {
            return [];
        }
        const opponent = player === Player.HOST ? Player.GUEST : Player.HOST;
        const opponentBanTurns: boolean[] = draft.preset.turns
            .map((turn): boolean => {
                return turn.player === opponent && (turn.action === Action.BAN || turn.action === Action.EXCLUSIVE_BAN);
            });

        const opponentBans: Civilisation[] = [];
        draft.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (opponentBanTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                opponentBans.push(playerEvent.civilisation);
            }
        });
        return opponentBans;
    }

    public getGlobalPicks(draftId: string): Civilisation[] {
        const draft: Draft = this.getDraftOrThrow(draftId);
        const globalPickTurns: boolean[] = draft.preset.turns
            .map((turn): boolean => {
                return turn.action === Action.GLOBAL_PICK;
            });

        const globalPicks: Civilisation[] = [];
        draft.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (globalPickTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                globalPicks.push(playerEvent.civilisation);
            }
        });
        return globalPicks;
    }

    public getExclusivePicks(draftId: string, player: Player): Civilisation[] {
        const draft: Draft = this.getDraftOrThrow(draftId);
        const exclusivePickTurns: boolean[] = draft.preset.turns
            .map((turn): boolean => {
                return turn.player === player && turn.action === Action.EXCLUSIVE_PICK;
            });

        const exclusivePicks: Civilisation[] = [];
        draft.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (exclusivePickTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                exclusivePicks.push(playerEvent.civilisation);
            }
        });
        return exclusivePicks;
    }


    public getExclusiveBansByPlayer(draftId: string, player: Player): Civilisation[] {
        const draft: Draft = this.getDraftOrThrow(draftId);
        if (player === Player.NONE) {
            return [];
        }
        const exclusiveBanTurns: boolean[] = draft.preset.turns
            .map((turn): boolean => {
                return turn.player === player && turn.action === Action.EXCLUSIVE_BAN;
            });

        const exclusiveBans: Civilisation[] = [];
        draft.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (exclusiveBanTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                exclusiveBans.push(playerEvent.civilisation);
            }
        });
        return exclusiveBans;
    }

    public getPicks(draftId: string, player: Player):Civilisation[] {
        const draft: Draft = this.getDraftOrThrow(draftId);
        const pickTurns: boolean[] = draft.preset.turns
            .map((turn): boolean => {
                return turn.player === player && Util.isPick(turn.action);
            });

        const picks: Civilisation[] = [];
        draft.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (pickTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                picks.push(playerEvent.civilisation);
            }
        });
        return picks;
    }

    getSnipes(draftId: string, player: Player):Civilisation[] {
        const draft: Draft = this.getDraftOrThrow(draftId);
        const snipeTurns: boolean[] = draft.preset.turns
            .map((turn): boolean => {
                return turn.player === player && Util.isSnipe(turn.action);
            });

        const snipes: Civilisation[] = [];
        draft.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (snipeTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                snipes.push(playerEvent.civilisation);
            }
        });
        return snipes;
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