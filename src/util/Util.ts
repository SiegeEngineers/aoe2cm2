import Civilisation from "../models/Civilisation";
import Action from "../constants/Action";
import {DraftEvent} from "../types/DraftEvent";
import PlayerEvent from "../models/PlayerEvent";
import AdminEvent from "../models/AdminEvent";
import Turn from "../models/Turn";
import ActionType from "../constants/ActionType";
import GameVersion from "../constants/GameVersion";
import {Validator} from "../models/Validator";
import {DraftsStore} from "../models/DraftsStore";
import Exclusivity from "../constants/Exclusivity";
import i18next from 'i18next';
import Player from "../constants/Player";

const CHARACTERS: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

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
        return (action === Action.PICK);
    },

    isNonglobalBan(turn: Turn): boolean {
        return (turn.action === Action.BAN && turn.exclusivity !== Exclusivity.GLOBAL);
    },

    isSnipe(action: Action): boolean {
        return (action === Action.SNIPE);
    },

    isPlayerEvent(event: DraftEvent): event is PlayerEvent {
        return (<PlayerEvent>event).civilisation !== undefined;
    },

    isAdminEvent(event: DraftEvent): event is AdminEvent {
        return !(<AdminEvent>event).hasOwnProperty('civilisation');
    },

    isHidden(turn: Turn): boolean {
        return (turn.hidden);
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

    getRandomCivilisation(civilisationsList: Civilisation[]): Civilisation {
        const maxCivilisationIndex = civilisationsList.length;
        const randomCivIndex = Math.floor(Math.random() * maxCivilisationIndex);
        return civilisationsList.splice(randomCivIndex, 1)[0];
    },

    setRandomCivilisationIfNeeded(playerEvent: PlayerEvent, draftId: string,
                                  draftStore: DraftsStore, civilisationsList: Civilisation[]): PlayerEvent {
        if (Util.isRandomCivilisation(playerEvent.civilisation)) {
            const randomCiv = Util.getRandomCivilisation(civilisationsList);
            const playerEventForValidation = new PlayerEvent(playerEvent.player, playerEvent.actionType, randomCiv);
            const errors = Validator.checkAllValidations(draftId, draftStore, playerEventForValidation);
            if (errors.length === 0) {
                playerEvent.civilisation = randomCiv;
                playerEvent.civilisation.isRandomlyChosenCiv = true;
                return playerEvent;
            } else {
                return this.setRandomCivilisationIfNeeded(playerEvent, draftId, draftStore, civilisationsList);
            }
        }
        return playerEvent;
    },

    newDraftId(): string {
        let id: string = '';
        for (let i = 0; i < 5; i++) {
            id += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
        }
        return id;
    },

    randomChar(): string {
        return CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    },

    buildValidationErrorMessage(data: any): string {
        let message = i18next.t('validationFailed') + '\n';
        for (let validationError of data.validationErrors) {
            message += `\n${validationError}: ${i18next.t('errors.' + validationError)}`;
        }
        return message;
    },

    sanitizeDraftId(draftIdRaw: string) {
        return draftIdRaw.replace(new RegExp(`[^${CHARACTERS}]`, 'g'), '_');
    },

    sanitizeRole(roleRaw: Player) {
        if (roleRaw === Player.GUEST) {
            return Player.GUEST;
        }
        if (roleRaw === Player.HOST) {
            return Player.HOST;
        }
        return Player.NONE;
    }
};
