import Preset from "./Preset";
import {IDraftState} from "../types";
import Player from "../constants/Player";
import {DraftEvent} from "../types/DraftEvent";
import Turn from "./Turn";
import Civilisation from "./Civilisation";
import Action from "../constants/Action";
import PlayerEvent from "./PlayerEvent";
import {Util} from "../util/Util";
import Exclusivity from "../constants/Exclusivity";

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

    constructor(nameHost: string, nameGuest: string, preset: Preset) {
        this.nameHost = nameHost;
        this.nameGuest = nameGuest;
        this.preset = preset;
        this.hostConnected = false;
        this.guestConnected = false;
        this.hostReady = false;
        this.guestReady = false;
    }

    public static from(source: Draft): Draft {
        const draft: Draft = new Draft(source.nameHost, source.nameGuest, source.preset);
        draft.hostConnected = source.hostConnected;
        draft.guestConnected = source.guestConnected;
        draft.hostReady = source.hostReady;
        draft.guestReady = source.guestReady;
        draft.nextAction = source.nextAction;
        draft.events = source.events;
        return draft;
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
                    if (lastEvent.player === lastTurn.player) {
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

    public getGlobalBans(): Civilisation[] {
        const globalBanTurns: boolean[] = this.preset.turns
            .map((turn): boolean => {
                return turn.action === Action.BAN && turn.exclusivity === Exclusivity.GLOBAL;
            });
        const globalBans: Civilisation[] = [];
        this.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (globalBanTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                globalBans.push(playerEvent.civilisation);
            }
        });
        return globalBans;
    }

    public getBansForPlayer(player: Player): Civilisation[] {
        if (player === Player.NONE) {
            return [];
        }
        const opponent = player === Player.HOST ? Player.GUEST : Player.HOST;
        const opponentBanTurns: boolean[] = this.preset.turns
            .map((turn): boolean => {
                return turn.player === opponent && Util.isNonglobalBan(turn);
            });

        const opponentBans: Civilisation[] = [];
        this.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (opponentBanTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                opponentBans.push(playerEvent.civilisation);
            }
        });
        return opponentBans;
    }

    public getExclusivePicks(player: Player): Civilisation[] {
        const exclusivePickTurns: boolean[] = this.preset.turns
            .map((turn): boolean => {
                return turn.player === player && turn.action === Action.PICK && turn.exclusivity === Exclusivity.EXCLUSIVE;
            });

        const exclusivePicks: Civilisation[] = [];
        this.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (exclusivePickTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                exclusivePicks.push(playerEvent.civilisation);
            }
        });
        return exclusivePicks;
    }

    public getGlobalPicks(): Civilisation[] {
        const globalPickTurns: boolean[] = this.preset.turns
            .map((turn): boolean => {
                return turn.action === Action.PICK && turn.exclusivity === Exclusivity.GLOBAL;
            });

        const globalPicks: Civilisation[] = [];
        this.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (globalPickTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                globalPicks.push(playerEvent.civilisation);
            }
        });
        return globalPicks;
    }

    public getExclusiveBansByPlayer(player: Player): Civilisation[] {
        if (player === Player.NONE) {
            return [];
        }
        const exclusiveBanTurns: boolean[] = this.preset.turns
            .map((turn): boolean => {
                return turn.player === player && turn.action === Action.BAN && turn.exclusivity === Exclusivity.EXCLUSIVE;
            });

        const exclusiveBans: Civilisation[] = [];
        this.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (exclusiveBanTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                exclusiveBans.push(playerEvent.civilisation);
            }
        });
        return exclusiveBans;
    }

    public getPicks(player: Player): Civilisation[] {
        const pickTurns: boolean[] = this.preset.turns
            .map((turn): boolean => {
                return turn.player === player && Util.isPick(turn.action);
            });

        const picks: Civilisation[] = [];
        this.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (pickTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                picks.push(playerEvent.civilisation);
            }
        });
        return picks;
    }

    getSnipes(player: Player): Civilisation[] {
        const snipeTurns: boolean[] = this.preset.turns
            .map((turn): boolean => {
                return turn.player === player && Util.isSnipe(turn.action);
            });

        const snipes: Civilisation[] = [];
        this.events.forEach((draftEvent: DraftEvent, index: number) => {
            if (snipeTurns[index]) {
                const playerEvent = draftEvent as PlayerEvent;
                snipes.push(playerEvent.civilisation);
            }
        });
        return snipes;
    }


}

export default Draft