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
import ActionType from "../constants/ActionType";
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
        draft.events = source.events;
        draft.startTimestamp = source.startTimestamp;
        draft.nextAction = source.events.length;
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
                let playerEvent = draftEvent as PlayerEvent;
                if (playerEvent.player !== opponent) {
                    if (this.preset.turns[index].parallel) {
                        playerEvent = this.events[index + 1] as PlayerEvent;
                    } else {
                        playerEvent = this.events[index - 1] as PlayerEvent;
                    }
                }
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
                let playerEvent = draftEvent as PlayerEvent;
                if (playerEvent.player !== player) {
                    if (this.preset.turns[index].parallel) {
                        if (this.events.length > index + 1) {
                            playerEvent = this.events[index + 1] as PlayerEvent;
                            exclusivePicks.push(playerEvent.civilisation);
                        }
                    } else {
                        playerEvent = this.events[index - 1] as PlayerEvent;
                        exclusivePicks.push(playerEvent.civilisation);
                    }
                } else {
                    exclusivePicks.push(playerEvent.civilisation);
                }
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
                let playerEvent = draftEvent as PlayerEvent;
                if (playerEvent.player !== player) {
                    if (this.preset.turns[index].parallel) {
                        if (this.events.length > index + 1) {
                            playerEvent = this.events[index + 1] as PlayerEvent;
                            exclusiveBans.push(playerEvent.civilisation);
                        }
                    } else {
                        playerEvent = this.events[index - 1] as PlayerEvent;
                        exclusiveBans.push(playerEvent.civilisation);
                    }
                } else {
                    exclusiveBans.push(playerEvent.civilisation);
                }
            }
        });
        return exclusiveBans;
    }

    public getPicks(player: Player): Civilisation[] {
        if (player === Player.NONE) {
            return [];
        }
        return this.events.filter((value) => {
            return Draft.isPick(value, player);
        }).map((value) => {
            const playerEvent = value as PlayerEvent;
            return playerEvent.civilisation;
        });
    }

    getSnipes(player: Player): Civilisation[] {
        if (player === Player.NONE) {
            return [];
        }
        return this.events.filter((value) => {
            return Draft.isSnipe(value, player);
        }).map((value) => {
            const playerEvent = value as PlayerEvent;
            return playerEvent.civilisation;
        });
    }

    private static isPick(event: PlayerEvent | AdminEvent, player: Player) {
        return this.hasPlayerAndActionType(event, player, ActionType.PICK);
    }

    private static isSnipe(value: PlayerEvent | AdminEvent, player: Player) {
        return this.hasPlayerAndActionType(value, player, ActionType.SNIPE);
    }

    private static hasPlayerAndActionType(event: PlayerEvent | AdminEvent, player: Player, actionType: ActionType) {
        if (event.player === player) {
            const playerEvent = event as PlayerEvent;
            return playerEvent.actionType == actionType;
        } else {
            return false;
        }
    }

    public getOffset() {
        return Date.now() - this.startTimestamp;
    }


}

export default Draft