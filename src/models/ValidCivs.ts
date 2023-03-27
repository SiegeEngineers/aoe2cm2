import Draft from "./Draft";
import {DraftEvent} from "../types/DraftEvent";
import {Util} from "../util/Util";
import ActionType from "../constants/ActionType";
import Turn from "./Turn";
import Exclusivity from "../constants/Exclusivity";
import Player from "../constants/Player";
import PlayerEvent from "./PlayerEvent";
import DraftOption from "./DraftOption";

class ValidOptions {
    public pick: string[];
    public ban: string[];
    public snipe: string[];
    public steal: string[];

    constructor(pick: DraftOption[], ban: DraftOption[], snipe: DraftOption[], steal: DraftOption[]) {
        this.pick = pick.map(option => option.id);
        this.ban = ban.map(option => option.id);
        this.snipe = snipe.map(option => option.id);
        this.steal = steal.map(option => option.id);
    }
}

class ValidCivs {
    public readonly host: ValidOptions;
    public readonly guest: ValidOptions;
    public readonly admin: ValidOptions;

    constructor(draft: Draft) {
        this.host = new ValidOptions(
            [...draft.preset.options, DraftOption.RANDOM],
            [...draft.preset.options, DraftOption.RANDOM],
            [DraftOption.RANDOM],
            [DraftOption.RANDOM],
        );
        this.guest = new ValidOptions(
            [...draft.preset.options, DraftOption.RANDOM],
            [...draft.preset.options, DraftOption.RANDOM],
            [DraftOption.RANDOM],
            [DraftOption.RANDOM],
        );
        this.admin = new ValidOptions(
            [...draft.preset.options, DraftOption.RANDOM],
            [...draft.preset.options, DraftOption.RANDOM],
            [DraftOption.RANDOM],
            [DraftOption.RANDOM],
        );
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
            this.removeHostSnipeAndSteal(event.chosenOptionId);
        }
        if (ValidCivs.isGuestEvent(event)) {
            this.removeGuestSnipeAndSteal(event.chosenOptionId);
        }
    }

    private handleSteal(event: PlayerEvent) {
        if (ValidCivs.isHostEvent(event)) {
            this.removeHostSnipeAndSteal(event.chosenOptionId);
        }
        if (ValidCivs.isGuestEvent(event)) {
            this.removeGuestSnipeAndSteal(event.chosenOptionId);
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
            this.removeGuestPick(event.chosenOptionId);
        }
        if (ValidCivs.isGuestEvent(event)) {
            this.removeHostPick(event.chosenOptionId);
        }
        if (ValidCivs.isAdminEvent(event)) {
            this.removeHostPick(event.chosenOptionId);
            this.removeGuestPick(event.chosenOptionId);
        }
    }

    private handleExclusiveBan(event: PlayerEvent) {
        if (ValidCivs.isHostEvent(event)) {
            this.removeGuestPick(event.chosenOptionId);
            this.removeHostBan(event.chosenOptionId);
        }
        if (ValidCivs.isGuestEvent(event)) {
            this.removeHostPick(event.chosenOptionId);
            this.removeGuestBan(event.chosenOptionId);
        }
    }

    private handleGlobalBan(event: PlayerEvent) {
        this.removeHostBan(event.chosenOptionId);
        this.removeGuestBan(event.chosenOptionId);
        this.removeAdminBan(event.chosenOptionId);
        this.removeHostPick(event.chosenOptionId);
        this.removeGuestPick(event.chosenOptionId);
        this.removeAdminPick(event.chosenOptionId);
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
            this.guest.snipe.push(event.chosenOptionId);
            this.guest.steal.push(event.chosenOptionId);
        }
        if (ValidCivs.isGuestEvent(event)) {
            this.host.snipe.push(event.chosenOptionId);
            this.host.steal.push(event.chosenOptionId);
        }
    }

    private handleExclusivePick(event: PlayerEvent) {
        if (ValidCivs.isHostEvent(event)) {
            this.removeHostPick(event.chosenOptionId);
            this.removeGuestBan(event.chosenOptionId);
        }
        if (ValidCivs.isGuestEvent(event)) {
            this.removeGuestPick(event.chosenOptionId);
            this.removeHostBan(event.chosenOptionId);
        }
        if (ValidCivs.isAdminEvent(event)) {
            this.removeAdminPick(event.chosenOptionId);
        }
    }

    private handleGlobalPick(event: PlayerEvent) {
        this.removeHostPick(event.chosenOptionId);
        this.removeHostBan(event.chosenOptionId);
        this.removeGuestPick(event.chosenOptionId);
        this.removeGuestBan(event.chosenOptionId);
        this.removeAdminPick(event.chosenOptionId);
        this.removeAdminBan(event.chosenOptionId);
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


    private static isAdminEvent(event: PlayerEvent) {
        return event.player === Player.NONE;
    }

    private removeHostPick(civilisationId: string) {
        const index = this.host.pick.indexOf(civilisationId);
        if (index >= 0) {
            this.host.pick.splice(index, 1);
        }
    }

    private removeHostBan(civilisationId: string) {
        const index = this.host.ban.indexOf(civilisationId);
        if (index >= 0) {
            this.host.ban.splice(index, 1);
        }
    }

    private removeHostSnipeAndSteal(civilisationId: string) {
        const snipeindex = this.host.snipe.indexOf(civilisationId);
        if (snipeindex >= 0) {
            this.host.snipe.splice(snipeindex, 1);
        }
        const stealindex = this.host.steal.indexOf(civilisationId);
        if (stealindex >= 0) {
            this.host.steal.splice(stealindex, 1);
        }
    }

    private removeGuestPick(civilisationId: string) {
        const index = this.guest.pick.indexOf(civilisationId);
        if (index >= 0) {
            this.guest.pick.splice(index, 1);
        }
    }

    private removeGuestBan(civilisationId: string) {
        const index = this.guest.ban.indexOf(civilisationId);
        if (index >= 0) {
            this.guest.ban.splice(index, 1);
        }
    }

    private removeGuestSnipeAndSteal(civilisationId: string) {
        const snipeindex = this.guest.snipe.indexOf(civilisationId);
        if (snipeindex >= 0) {
            this.guest.snipe.splice(snipeindex, 1);
        }
        const stealindex = this.guest.steal.indexOf(civilisationId);
        if (stealindex >= 0) {
            this.guest.steal.splice(stealindex, 1);
        }
    }

    private removeAdminPick(civilisationId: string) {
        const index = this.admin.pick.indexOf(civilisationId);
        if (index >= 0) {
            this.admin.pick.splice(index, 1);
        }
    }

    private removeAdminBan(civilisationId: string) {
        const index = this.admin.ban.indexOf(civilisationId);
        if (index >= 0) {
            this.admin.ban.splice(index, 1);
        }
    }

    validateDraftEvent(draftEvent: PlayerEvent): boolean {
        let validOptions = this.host;
        if (draftEvent.player === Player.GUEST) {
            validOptions = this.guest;
        }
        if (draftEvent.player === Player.NONE) {
            validOptions = this.admin;
        }
        if (draftEvent.actionType === ActionType.PICK) {
            return validOptions.pick.includes(draftEvent.chosenOptionId);
        }
        if (draftEvent.actionType === ActionType.BAN) {
            return validOptions.ban.includes(draftEvent.chosenOptionId);
        }
        if (draftEvent.actionType === ActionType.SNIPE) {
            return validOptions.snipe.includes(draftEvent.chosenOptionId);
        }
        if (draftEvent.actionType === ActionType.STEAL) {
            return validOptions.steal.includes(draftEvent.chosenOptionId);
        }
        throw new Error('Unknown ActionType: ' + draftEvent.actionType);
    }
}

export default ValidCivs;
