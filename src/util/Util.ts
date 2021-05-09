import Action from "../constants/Action";
import {DraftEvent} from "../types/DraftEvent";
import PlayerEvent from "../models/PlayerEvent";
import AdminEvent from "../models/AdminEvent";
import Turn from "../models/Turn";
import ActionType from "../constants/ActionType";
import {Validator} from "../models/Validator";
import {DraftsStore} from "../models/DraftsStore";
import Exclusivity from "../constants/Exclusivity";
import i18next from 'i18next';
import Player from "../constants/Player";
import DraftOption from "../models/DraftOption";
import {IDraftState} from "../types";
import LegacyPlayerEvent from "../models/LegacyPlayerEvent";
import Civilisation from "../models/Civilisation";

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
        const match: RegExpMatchArray | null = window.location.pathname.match(/\/(?:draft|spectate)\/([A-Za-z]+)\/?.*/);
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
        return (event as PlayerEvent).chosenOptionId !== undefined;
    },

    isAdminEvent(event: DraftEvent): event is AdminEvent {
        return !(event as AdminEvent).hasOwnProperty('chosenOptionId');
    },

    isCivilisation(draftOption: DraftOption): draftOption is Civilisation {
        return (draftOption as Civilisation).hasOwnProperty('gameVersion');
    },

    isCivilisationArray(draftOptions: DraftOption[]): draftOptions is Civilisation[] {
        for (const draftOption of draftOptions) {
            if (!Util.isCivilisation(draftOption)) {
                return false;
            }
        }
        return true;
    },

    isHidden(turn: Turn): boolean {
        return (turn.hidden);
    },

    getHiddenDraftOptionForActionType(actionType: ActionType): DraftOption {
        switch (actionType) {
            case ActionType.PICK:
                return DraftOption.HIDDEN_PICK;
            case ActionType.BAN:
                return DraftOption.HIDDEN_BAN;
            case ActionType.SNIPE:
                return DraftOption.HIDDEN_SNIPE;
            case ActionType.STEAL:
                return DraftOption.HIDDEN_STEAL;
            default:
                return DraftOption.HIDDEN;
        }
    },

    isTechnicalDraftOption(draftOption: DraftOption): boolean {
        switch (draftOption.id) {
            case DraftOption.HIDDEN.id:
            case DraftOption.HIDDEN_PICK.id:
            case DraftOption.HIDDEN_BAN.id:
            case DraftOption.HIDDEN_SNIPE.id:
            case DraftOption.HIDDEN_STEAL.id:
                return true;
        }
        return false;
    },

    isRandomDraftOption(id: string): boolean {
        return id.toUpperCase() === "RANDOM";
    },

    getRandomDraftOption(draftOptions: DraftOption[]): DraftOption {
        const maxIndex = draftOptions.length;
        const randomIndex = Math.floor(Math.random() * maxIndex);
        return draftOptions.splice(randomIndex, 1)[0];
    },

    setRandomDraftOptionIfNeeded(playerEvent: PlayerEvent, draftId: string,
                                 draftStore: DraftsStore, civilisationsList: DraftOption[], round: number = 100): PlayerEvent {
        if (round < 0) {
            return new PlayerEvent(playerEvent.player, playerEvent.actionType, DraftOption.HIDDEN.id, false, playerEvent.executingPlayer);
        }
        if (Util.isRandomDraftOption(playerEvent.chosenOptionId)) {
            const randomDraftOption = Util.getRandomDraftOption(civilisationsList);
            const playerEventForValidation = new PlayerEvent(playerEvent.player, playerEvent.actionType, randomDraftOption.id, true, playerEvent.executingPlayer);
            const errors = Validator.checkAllValidations(draftId, draftStore, playerEventForValidation);
            if (errors.length === 0) {
                playerEvent.chosenOptionId = randomDraftOption.id;
                playerEvent.isRandomlyChosen = true;
                return playerEvent;
            } else {
                return this.setRandomDraftOptionIfNeeded(playerEvent, draftId, draftStore, civilisationsList, round - 1);
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

    isValidPresetId(input: any): boolean {
        if (typeof input !== "string") {
            return false;
        }
        return input.match(new RegExp(`^[A-Za-z0-9_]+$`)) !== null;
    },

    randomChar(): string {
        return CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    },

    buildValidationErrorMessage(data: any): string {
        if (data.hasOwnProperty('message')) {
            return data.message;
        }
        let message = i18next.t('validationFailed') + '\n';
        for (let validationError of data.validationErrors) {
            message += `\n${validationError}: ${i18next.t('errors.' + validationError)}`;
        }
        return message;
    },

    sanitizeDraftId(draftIdRaw: any) {
        if (typeof draftIdRaw === "string") {
            return draftIdRaw.replace(new RegExp(`[^${CHARACTERS}]`, 'g'), '_');
        }
        return '__invalid__';
    },

    sanitizeRole(roleRaw: Player) {
        if (roleRaw === Player.GUEST) {
            return Player.GUEST;
        }
        if (roleRaw === Player.HOST) {
            return Player.HOST;
        }
        return Player.NONE;
    },

    getAssignedRole(socket: SocketIO.Socket, roomHost: string, roomGuest: string): Player {
        let assignedRole: Player = Player.NONE;
        if (Object.keys(socket.rooms).includes(roomHost)) {
            assignedRole = Player.HOST;
        } else if (Object.keys(socket.rooms).includes(roomGuest)) {
            assignedRole = Player.GUEST;
        }
        return assignedRole;
    },

    isRequestFromLocalhost(req: any) {
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        return ip === '::ffff:127.0.0.1' || ip === '::1';
    },

    getIconStyleFromLocalStorage(defaultIfError: string = 'units'): string {
        try {
            return localStorage.getItem('iconStyle') || defaultIfError;
        } catch (e) {
            return defaultIfError;
        }
    },

    writeIconStyleToLocalStorage(iconStyle: string) {
        try {
            localStorage.setItem('iconStyle', iconStyle);
        } catch (e) {
            // ignore
        }
    },
};
