import Draft from "./Draft";
import {DraftEvent} from "../types/DraftEvent";
import {Util} from "../util/Util";
import ActionType from "../constants/ActionType";
import Turn from "./Turn";
import Exclusivity from "../constants/Exclusivity";
import Player from "../constants/Player";
import PlayerEvent from "./PlayerEvent";
import DraftOption from "./DraftOption";
import {ICategoryLimits} from "../types";
import AdminEvent from "./AdminEvent";
import Action from "../constants/Action";

class ValidOptions {
    public pick: string[];
    public ban: string[];
    public snipe: string[];
    public steal: string[];
    public categoryLimitPick: { [key: string]: number };
    public categoryLimitBan: { [key: string]: number };

    constructor(pick: DraftOption[], ban: DraftOption[], snipe: DraftOption[], steal: DraftOption[], limits: ICategoryLimits) {
        this.pick = pick.map(option => option.id);
        this.ban = ban.map(option => option.id);
        this.snipe = snipe.map(option => option.id);
        this.steal = steal.map(option => option.id);
        this.categoryLimitPick = Util.cloneLimits(limits.pick);
        this.categoryLimitBan = Util.cloneLimits(limits.ban);
    }
}

class ValidCivs {
    public readonly host: ValidOptions;
    public readonly guest: ValidOptions;
    public readonly admin: ValidOptions;
    public readonly draft: Draft;

    constructor(draft: Draft) {
        this.draft = draft;
        this.host = new ValidOptions(
            [...draft.preset.options, DraftOption.RANDOM],
            [...draft.preset.options, DraftOption.RANDOM],
            [DraftOption.RANDOM],
            [DraftOption.RANDOM],
            draft.preset.categoryLimits,
        );
        this.guest = new ValidOptions(
            [...draft.preset.options, DraftOption.RANDOM],
            [...draft.preset.options, DraftOption.RANDOM],
            [DraftOption.RANDOM],
            [DraftOption.RANDOM],
            draft.preset.categoryLimits,
        );
        this.admin = new ValidOptions(
            [...draft.preset.options, DraftOption.RANDOM],
            [...draft.preset.options, DraftOption.RANDOM],
            [DraftOption.RANDOM],
            [DraftOption.RANDOM],
            draft.preset.categoryLimits,
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
            this.handleAdminEvent(event)
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
        const category = this.getCategoryForEvent(event);
        if (category && this.admin.categoryLimitBan[category]) {
            this.admin.categoryLimitBan[category]--;
            this.host.categoryLimitBan[category]--;
            this.guest.categoryLimitBan[category]--;
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

    private handleAdminEvent(event: AdminEvent) {
        if (event.action === Action.RESET_CL){
            this.admin.categoryLimitPick = Util.cloneLimits(this.draft.preset.categoryLimits.pick);
            this.admin.categoryLimitBan = Util.cloneLimits(this.draft.preset.categoryLimits.ban);
            this.host.categoryLimitPick = Util.cloneLimits(this.draft.preset.categoryLimits.pick);
            this.host.categoryLimitBan = Util.cloneLimits(this.draft.preset.categoryLimits.ban);
            this.guest.categoryLimitPick = Util.cloneLimits(this.draft.preset.categoryLimits.pick);
            this.guest.categoryLimitBan = Util.cloneLimits(this.draft.preset.categoryLimits.ban);
        }
    }

    private handlePick(turn: Turn, event: PlayerEvent) {
        if (ValidCivs.isGlobal(turn)) {
            this.handleGlobalPick(event);
        }
        if (ValidCivs.isExclusive(turn)) {
            this.handleExclusivePick(event);
        }
        const category = this.getCategoryForEvent(event);
        if (category && this.admin.categoryLimitPick[category]) {
            this.admin.categoryLimitPick[category]--;
            this.host.categoryLimitPick[category]--;
            this.guest.categoryLimitPick[category]--;
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

    private isFromValidCategory(draftEvent: PlayerEvent) {
        const category = this.getCategoryForEvent(draftEvent);
        if (!category) {
            return true;
        }
        const expectedActions = this.draft.getExpectedActions()
        for (let expectedAction of expectedActions) {
            if (expectedAction.player === draftEvent.player) {
                if (!expectedAction.categories.includes(category)) {
                    return false;
                }
            }
        }
        return true;
    }

    private getCategoryForEvent(draftEvent: PlayerEvent): string | undefined {
        const option = this.draft.preset.options.find((option) => option.id === draftEvent.chosenOptionId);
        return option?.category;
    }

    validateDraftEvent(draftEvent: PlayerEvent): boolean {
        if (!this.isFromValidCategory(draftEvent)) {
            return false;
        }
        let validOptions = this.host;
        if (draftEvent.player === Player.GUEST) {
            validOptions = this.guest;
        }
        if (draftEvent.player === Player.NONE) {
            validOptions = this.admin;
        }
        if (draftEvent.actionType === ActionType.PICK) {

            const category = this.getCategoryForEvent(draftEvent);
            if (category && validOptions.categoryLimitPick[category] !== undefined) {
                if (validOptions.categoryLimitPick[category] <= 0) {
                    return false;
                }
            }

            return validOptions.pick.includes(draftEvent.chosenOptionId);
        }
        if (draftEvent.actionType === ActionType.BAN) {

            const category = this.getCategoryForEvent(draftEvent);
            if (category && validOptions.categoryLimitBan[category] !== undefined) {
                if (validOptions.categoryLimitBan[category] <= 0) {
                    return false;
                }
            }
            if (category && validOptions.categoryLimitPick[category] !== undefined) {
                if (validOptions.categoryLimitPick[category] <= 0) {
                    return false;
                }
            }

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
