import Preset from "./Preset";
import {IStoreState} from "../types";
import Player from "./Player";
import {DraftEvent} from "./DraftEvent";
import NameGenerator from "./NameGenerator";
import Turn from "./Turn";
import Civilisation from "./Civilisation";
import Action from "./Action";
import PlayerEvent from "./PlayerEvent";
import {Util} from "./Util";

class Draft implements IStoreState {
    public nameHost: string;
    public nameGuest: string;
    public hostReady: boolean;
    public guestReady: boolean;
    public whoAmI: Player;
    public ownName: string | null = null;
    public readonly preset: Preset;
    public nextAction: number = 0;
    public events: DraftEvent[] = [];
    public showModal: boolean;


    public language: string = 'en-GB';

    constructor(nameHost: string, nameGuest: string, preset: Preset) {
        this.nameHost = nameHost;
        this.nameGuest = nameGuest;
        this.preset = preset;
        this.whoAmI = Player.HOST;
        this.hostReady = false;
        this.guestReady = false;
        this.ownName = NameGenerator.getNameFromLocalStorage();
        this.showModal = this.ownName === null;
    }

    public static from(source: Draft): Draft {
        const draft: Draft = new Draft(source.nameHost, source.nameGuest, source.preset)
        draft.hostReady = source.hostReady;
        draft.guestReady = source.guestReady;
        draft.whoAmI = source.whoAmI;
        draft.ownName = source.ownName;
        draft.nextAction = source.nextAction;
        draft.events = source.events;
        draft.showModal = source.showModal;
        return draft;
    }

    public setWhoAmI(whoAmI: Player) {
        this.whoAmI = whoAmI;
    }

    public static playersAreReady(draft: IStoreState) {
        return draft.hostReady && draft.guestReady;
    }

    public hasNextAction(): boolean {
        return this.events.length < this.preset.turns.length;
    }

    public draftCanBeStarted(): boolean {
        return this.hostReady && this.guestReady;
    }

    public getExpectedAction(): Turn | null {
        if (!Draft.playersAreReady(this)) {
            return null;
        }
        if (this.hasNextAction()) {
            return this.preset.turns[this.events.length];
        }
        return null;
    }

    public getGlobalBans(): Civilisation[] {
        const globalBanTurns: boolean[] = this.preset.turns
            .map((turn): boolean => {
                return turn.action === Action.GLOBAL_BAN
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
                return turn.player === opponent && Util.isNonglobalBan(turn.action);
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
                return turn.player === player && turn.action === Action.PICK;
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
                return turn.action === Action.GLOBAL_PICK;
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
                return turn.player === player && turn.action === Action.BAN;
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