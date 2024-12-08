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
import {Socket} from "socket.io";
import {SessionStore} from "../models/SessionStore";

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
        const match: RegExpMatchArray | null = window.location.pathname.match(/\/(?:draft|spectate|guest|host)\/([A-Za-z]+)\/?.*/);
        if (match !== null) {
            return match[1];
        }
        alert('Could not get draft ID from url');
        return '';
    },

    getPresetIdOrNameFromUrl(): string {
        const match: RegExpMatchArray | null = window.location.pathname.match(/\/admin\/draft\/(.+)\/?.*/);
        if (match !== null) {
            return decodeURI(match[1]);
        }
        alert('Could not get preset name from url');
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

    isLegacyPlayerEvent(event: unknown): event is PlayerEvent {
        return (event as LegacyPlayerEvent).civilisation !== undefined;
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
        return DraftOption.TECHNICAL_DRAFT_OPTIONS.map(value => value.id).includes(draftOption.id);
    },

    isRandomDraftOption(id: string): boolean {
        return id.toUpperCase() === "RANDOM";
    },

    getRandomDraftOption(draftOptions: DraftOption[]): DraftOption {
        const maxIndex = draftOptions.length;
        const randomIndex = Math.floor(Math.random() * maxIndex);
        const randomOption = draftOptions.splice(randomIndex, 1)[0];
        if (!randomOption) {
            return DraftOption.RANDOM;
        }
        return randomOption;
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
        return Player.SPEC;
    },

    getAssignedRole(socket: Socket, roomHost: string, roomGuest: string): Player {
        let assignedRole: Player = Player.SPEC;
        if (socket.rooms.has(roomHost)) {
            assignedRole = Player.HOST;
        } else if (socket.rooms.has(roomGuest)) {
            assignedRole = Player.GUEST;
        }
        return assignedRole;
    },

    isRequestFromLocalhost(req: any): boolean {
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        return ip === '::ffff:127.0.0.1' || ip === '::1';
    },

    isAuthenticatedRequest(req: any, sessionStore: SessionStore): boolean {
        if (Util.isRequestFromLocalhost(req)) {
            return true;
        }
        const apiKey = req.header('x-auth-token');
        if (apiKey) {
            return sessionStore.isApiKeyValid(apiKey);
        }
        return false;
    },

    getAuthenticatedUser(req: any, sessionStore: SessionStore): string | undefined {
        if (Util.isRequestFromLocalhost(req)) {
            return 'LOCALHOST';
        }
        const apiKey = req.header('x-auth-token');
        if (apiKey) {
            return sessionStore.getUser(apiKey);
        }
        return undefined;
    },

    isRequestForPreview(req: any) {
        const userAgent: string = req.header('user-agent');
        const previewAgents = ['discordbot', 'facebookexternalhit', 'twitterbot'];
        return previewAgents.some(value => userAgent.toLowerCase().includes(value));
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

    getApiKeyFromLocalStorage(defaultIfError: string | undefined = undefined): string | undefined {
        try {
            return localStorage.getItem('apiKey') || defaultIfError;
        } catch (e) {
            return defaultIfError;
        }
    },

    writeApiKeyToLocalStorage(apiKey: string | undefined) {
        try {
            if(apiKey){
                localStorage.setItem('apiKey', apiKey);
            } else {
                localStorage.removeItem('apiKey');
            }
        } catch (e) {
            // ignore
        }
    },

    formatTimestamp(ts: number){
        const date = new Date(ts * 1000);
        return date.toISOString();
    },

    transformDraftStateToCurrentFormat(input: IDraftState): IDraftState {
        for (let i = 0; i < input.events.length; i++) {
            const event = input.events[i];
            if (Util.isLegacyPlayerEvent(event)) {
                const legacyEvent = input.events[i] as unknown;
                input.events[i] = PlayerEvent.fromLegacy(legacyEvent as LegacyPlayerEvent);
            }
        }
        return input;
    },

    cloneLimits(limits: { [key: string]: number }): { [key: string]: number } {
        const copy: { [key: string]: number } = {};
        for (let key in limits) {
            copy[key] = limits[key];
        }
        return copy;
    },

    draftToPreviewPage(draftId: string, draft: IDraftState): string {
        const presetName = draft.preset ? draft.preset.name : 'Unknown Preset';
        return `<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Draft: ${presetName}</title>
    <!-- Facebook Open Graph -->
    <meta property="og:site_name" content="aoe2cm.net"/>
    <meta property="og:title" content="${presetName}"/>
    <meta property="og:url" content="https://aoe2cm.net/draft/${draftId}"/>
    <meta property="og:type" content="article"/>
    <meta property="og:description" content="${draft.nameHost} vs ${draft.nameGuest}"/>
    <meta property="og:image" content="https://aoe2cm.net/images/aoe2cm2.png"/>
    <meta property="og:image:width" content="310"/>
    <meta property="og:image:height" content="310"/>
    <!-- Schema.org -->
    <meta itemprop="name" content="aoe2cm.net Draft"/>
    <meta itemprop="headline" content="${presetName}"/>
    <meta itemprop="description" content="${draft.nameHost} vs ${draft.nameGuest}"/>
    <meta itemprop="image" content="https://aoe2cm.net/images/aoe2cm2.png"/>
    <meta itemprop="author" content="aoe2cm.net"/>
    <!-- Twitter Cards -->
    <meta name="twitter:title" content="${presetName}"/>
    <meta name="twitter:url" content="https://aoe2cm.net/draft/${draftId}"/>
    <meta name="twitter:description" content="${draft.nameHost} vs ${draft.nameGuest}"/>
    <meta name="twitter:image" content="https://aoe2cm.net/images/aoe2cm2.png"/>
    <meta name="twitter:card" content="summary"/>
</head>
<body>
This is a preview generated for preview bots.
</body>`;
    },
};
