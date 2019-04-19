import Civilisation from "./Civilisation";
import Action from "./Action";
import {DraftEvent} from "./DraftEvent";
import PlayerEvent from "./PlayerEvent";
import AdminEvent from "./AdminEvent";
import Turn from "./Turn";
import ActionType from "./ActionType";
import GameVersion from "./GameVersion";
import {Validator} from "./Validator";
import {DraftsStore} from "./DraftsStore";

export const Util = {
    notUndefined(...args: any[]): boolean {
        for (const arg of args) {
            if (arg === undefined) {
                return false;
            }
        }
        return true;
    },

    getIdFromUrl(): string {
        const match: RegExpMatchArray | null = window.location.pathname.match(/\/draft\/([A-Za-z]+)\/?.*/);
        if (match !== null) {
            return match[1];
        }
        alert('Could not get draft ID from url');
        return '';
    },

    isPick(action: Action): boolean {
        return (action === Action.NONEXCLUSIVE_PICK
            || action === Action.GLOBAL_PICK
            || action === Action.PICK
            || action === Action.HIDDEN_PICK
            || action === Action.HIDDEN_EXCLUSIVE_PICK);
    },

    isNonglobalBan(action: Action): boolean {
        return (action === Action.NONEXCLUSIVE_BAN
            || action === Action.BAN
            || action === Action.HIDDEN_BAN
            || action === Action.HIDDEN_EXCLUSIVE_BAN);
    },

    isSnipe(action: Action): boolean {
        return (action === Action.SNIPE || action === Action.HIDDEN_SNIPE);
    },

    isPlayerEvent(event: DraftEvent): event is PlayerEvent {
        return (<PlayerEvent>event).civilisation !== undefined;
    },

    isAdminEvent(event: DraftEvent): event is AdminEvent {
        return !(<AdminEvent>event).hasOwnProperty('civilisation');
    },

    isHidden(turn: Turn): boolean {
        return (turn.action === Action.HIDDEN_BAN
            || turn.action === Action.HIDDEN_EXCLUSIVE_BAN
            || turn.action === Action.HIDDEN_GLOBAL_BAN
            || turn.action === Action.HIDDEN_PICK
            || turn.action === Action.HIDDEN_EXCLUSIVE_PICK
            || turn.action === Action.HIDDEN_SNIPE
        );
    },

    getHiddenCivilisationForActionType(actionType: ActionType): Civilisation {
        switch (actionType) {
            case ActionType.PICK:
                return Civilisation.HIDDEN_PICK;
            case ActionType.BAN:
                return Civilisation.HIDDEN_BAN;
            case ActionType.SNIPE:
                return Civilisation.HIDDEN_SNIPE;
            default:
                return Civilisation.HIDDEN;
        }
    },

    isTechnicalCivilisation(civilisation: Civilisation): boolean {
        return civilisation.gameVersion === GameVersion.TECHNICAL;
    },

    isRandomCivilisation(civilisation: Civilisation): boolean {
        return civilisation.name.toUpperCase() === "RANDOM";
    },

    getRandomCivilisation(): Civilisation {
        const maxCivilisationIndex = Civilisation.ALL.length;
        const randomCivIndex = Math.floor(Math.random() * maxCivilisationIndex);
        return Civilisation.ALL[randomCivIndex];
    },

    setRandomCivilisationIfNeeded(playerEvent: PlayerEvent, draftId: string, draftStore: DraftsStore): PlayerEvent {
        if (Util.isRandomCivilisation(playerEvent.civilisation)) {
            const randomCiv = Util.getRandomCivilisation();
            const playerEventForValidation = new PlayerEvent(playerEvent.player, playerEvent.actionType, randomCiv);
            const errors = Validator.checkAllValidations(draftId, draftStore, playerEventForValidation);
            if (errors.length === 0) {
                // random civ is set correctly.
                playerEvent.civilisation.isRandomlyChosenCiv = true;
                playerEvent.civilisation = randomCiv;
                return playerEvent;
            } else {
                // recursively try to set random civ
                return this.setRandomCivilisationIfNeeded(playerEvent, draftId, draftStore);
            }
        }
        return playerEvent;
    }
};
