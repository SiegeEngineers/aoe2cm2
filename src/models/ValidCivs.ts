import Draft from "./Draft";
import Civilisation, {Name as CivilisationName} from "./Civilisation";
import {DraftEvent} from "../types/DraftEvent";
import {Util} from "../util/Util";
import ActionType from "../constants/ActionType";
import Turn from "./Turn";
import Exclusivity from "../constants/Exclusivity";
import Player from "../constants/Player";
import PlayerEvent from "./PlayerEvent";

class ValidOptions {
    public pick: CivilisationName[];
    public ban: CivilisationName[];
    public snipe: CivilisationName[];
    public steal: CivilisationName[];

    constructor(pick: Civilisation[], ban: Civilisation[], snipe: Civilisation[], steal: Civilisation[]) {
        this.pick = pick.map(civ => civ.name);
        this.ban = ban.map(civ => civ.name);
        this.snipe = snipe.map(civ => civ.name);
        this.steal = snipe.map(civ => civ.name);
    }
}

class ValidCivs {
    public readonly host: ValidOptions;
    public readonly guest: ValidOptions;

    constructor(draft: Draft) {
        this.host = new ValidOptions(
            [...draft.preset.civilisations, Civilisation.RANDOM],
            [...draft.preset.civilisations, Civilisation.RANDOM],
            [Civilisation.RANDOM],
            [Civilisation.RANDOM]
        );
        this.guest = new ValidOptions(
            [...draft.preset.civilisations, Civilisation.RANDOM],
            [...draft.preset.civilisations, Civilisation.RANDOM],
            [Civilisation.RANDOM],
            [Civilisation.RANDOM]);
        for (let i = 0; i < draft.events.length; i++) {
            const event = draft.events[i];

            const turn = ValidCivs.getRelevantTurnOrThrow(draft.preset.turns, i, event.player);
            this.applyEvent(turn, event);
        }
    }

    private static getRelevantTurnOrThrow(turns: Turn[], i: number, eventPlayer: Player) {
        let turn = turns[i];
        if (turn.player !== eventPlayer) {
            if (turn.parallel) {
                turn = turns[i + 1];
            } else {
                turn = turns[i - 1];
            }
        }
        if (turn.player !== eventPlayer) {
            throw new Error('Invalid turn configuration');
        }
        return turn;
    }

    private applyEvent(turn: Turn, event: DraftEvent) {
        if (Util.isAdminEvent(event)) {
            return;
        }

        if (ValidCivs.isPick(event)) {
            this.handlePick(turn, event);
        }

        if (ValidCivs.isBan(event)) {
            this.handleBan(turn, event);
        }

        if (ValidCivs.isSnipe(event)) {
            this.handleSnipe(event);
        }

        if (ValidCivs.isSteal(event)) {
            this.handleSteal(event);
        }
    }

    private handleSnipe(event: PlayerEvent) {
        if (ValidCivs.isHostEvent(event)) {
            this.removeHostSnipeAndSteal(event.civilisation);
        }
        if (ValidCivs.isGuestEvent(event)) {
            this.removeGuestSnipeAndSteal(event.civilisation);
        }
    }

    private handleSteal(event: PlayerEvent) {
        if (ValidCivs.isHostEvent(event)) {
            this.removeHostSnipeAndSteal(event.civilisation);
        }
        if (ValidCivs.isGuestEvent(event)) {
            this.removeGuestSnipeAndSteal(event.civilisation);
        }
        this.addCivilisationToSnipesAndSteals(event);
    }

    private handleBan(turn: Turn, event: PlayerEvent) {
        if (ValidCivs.isGlobal(turn)) {
            this.handleGlobalBan(event);
        }
        if (ValidCivs.isExclusive(turn)) {
            this.handleExclusiveBan(event);
        }
        if (ValidCivs.isNonExclusive(turn)) {
            this.handleNonExclusiveBan(event);
        }
    }

    private handleNonExclusiveBan(event: PlayerEvent) {
        if (ValidCivs.isHostEvent(event)) {
            this.removeGuestPick(event.civilisation);
        }
        if (ValidCivs.isGuestEvent(event)) {
            this.removeHostPick(event.civilisation);
        }
    }

    private handleExclusiveBan(event: PlayerEvent) {
        if (ValidCivs.isHostEvent(event)) {
            this.removeGuestPick(event.civilisation);
            this.removeHostBan(event.civilisation);
        }
        if (ValidCivs.isGuestEvent(event)) {
            this.removeHostPick(event.civilisation);
            this.removeGuestBan(event.civilisation);
        }
    }

    private handleGlobalBan(event: PlayerEvent) {
        this.removeHostBan(event.civilisation);
        this.removeGuestBan(event.civilisation);
        this.removeHostPick(event.civilisation);
        this.removeGuestPick(event.civilisation);
    }

    private handlePick(turn: Turn, event: PlayerEvent) {
        if (ValidCivs.isGlobal(turn)) {
            this.handleGlobalPick(event);
        }
        if (ValidCivs.isExclusive(turn)) {
            this.handleExclusivePick(event);
        }
        this.addCivilisationToSnipesAndSteals(event);
    }

    private addCivilisationToSnipesAndSteals(event: PlayerEvent) {
        if (ValidCivs.isHostEvent(event)) {
            this.guest.snipe.push(event.civilisation.name);
            this.guest.steal.push(event.civilisation.name);
        }
        if (ValidCivs.isGuestEvent(event)) {
            this.host.snipe.push(event.civilisation.name);
            this.host.steal.push(event.civilisation.name);
        }
    }

    private handleExclusivePick(event: PlayerEvent) {
        if (ValidCivs.isHostEvent(event)) {
            this.removeHostPick(event.civilisation);
            this.removeGuestBan(event.civilisation);
        }
        if (ValidCivs.isGuestEvent(event)) {
            this.removeGuestPick(event.civilisation);
            this.removeHostBan(event.civilisation);
        }
    }

    private handleGlobalPick(event: PlayerEvent) {
        this.removeHostPick(event.civilisation);
        this.removeGuestBan(event.civilisation);
        this.removeGuestPick(event.civilisation);
        this.removeHostBan(event.civilisation);
    }

    private static isGlobal(turn: Turn) {
        return turn.exclusivity === Exclusivity.GLOBAL;
    }

    private static isExclusive(turn: Turn) {
        return turn.exclusivity === Exclusivity.EXCLUSIVE;
    }

    private static isNonExclusive(turn: Turn) {
        return turn.exclusivity === Exclusivity.NONEXCLUSIVE;
    }

    private static isPick(event: PlayerEvent) {
        return event.actionType === ActionType.PICK;
    }

    private static isBan(event: PlayerEvent) {
        return event.actionType === ActionType.BAN;
    }

    private static isSnipe(event: PlayerEvent) {
        return event.actionType === ActionType.SNIPE;
    }

    private static isSteal(event: PlayerEvent) {
        return event.actionType === ActionType.STEAL;
    }

    private static isGuestEvent(event: PlayerEvent) {
        return event.player === Player.GUEST;
    }

    private static isHostEvent(event: PlayerEvent) {
        return event.player === Player.HOST;
    }

    private removeHostPick(civilisation: Civilisation) {
        const index = this.host.pick.indexOf(civilisation.name);
        if (index >= 0) {
            this.host.pick.splice(index, 1);
        }
    }

    private removeHostBan(civilisation: Civilisation) {
        const index = this.host.ban.indexOf(civilisation.name);
        if (index >= 0) {
            this.host.ban.splice(index, 1);
        }
    }

    private removeHostSnipeAndSteal(civilisation: Civilisation) {
        const snipeindex = this.host.snipe.indexOf(civilisation.name);
        if (snipeindex >= 0) {
            this.host.snipe.splice(snipeindex, 1);
        }
        const stealindex = this.host.steal.indexOf(civilisation.name);
        if (stealindex >= 0) {
            this.host.steal.splice(stealindex, 1);
        }
    }

    private removeGuestPick(civilisation: Civilisation) {
        const index = this.guest.pick.indexOf(civilisation.name);
        if (index >= 0) {
            this.guest.pick.splice(index, 1);
        }
    }

    private removeGuestBan(civilisation: Civilisation) {
        const index = this.guest.ban.indexOf(civilisation.name);
        if (index >= 0) {
            this.guest.ban.splice(index, 1);
        }
    }

    private removeGuestSnipeAndSteal(civilisation: Civilisation) {
        const snipeindex = this.guest.snipe.indexOf(civilisation.name);
        if (snipeindex >= 0) {
            this.guest.snipe.splice(snipeindex, 1);
        }
        const stealindex = this.guest.steal.indexOf(civilisation.name);
        if (stealindex >= 0) {
            this.guest.steal.splice(stealindex, 1);
        }
    }

    validateDraftEvent(draftEvent: PlayerEvent): boolean {
        let validOptions = this.host;
        if (draftEvent.player === Player.GUEST) {
            validOptions = this.guest;
        }
        if (draftEvent.actionType === ActionType.PICK) {
            return validOptions.pick.includes(draftEvent.civilisation.name);
        }
        if (draftEvent.actionType === ActionType.BAN) {
            return validOptions.ban.includes(draftEvent.civilisation.name);
        }
        if (draftEvent.actionType === ActionType.SNIPE) {
            return validOptions.snipe.includes(draftEvent.civilisation.name);
        }
        if (draftEvent.actionType === ActionType.STEAL) {
            return validOptions.steal.includes(draftEvent.civilisation.name);
        }
        throw new Error('Unknown ActionType: ' + draftEvent.actionType);
    }
}

export default ValidCivs;
