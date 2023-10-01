import Preset from "../models/Preset";
import Player from "../constants/Player";
import {DraftEvent} from "./DraftEvent";
import {ColorScheme} from "../constants/ColorScheme";

export interface IDraftState {
    nameHost: string;
    nameGuest: string;
    hostConnected: boolean;
    guestConnected: boolean;
    hostReady: boolean;
    guestReady: boolean;
    preset?: Preset;
    events: DraftEvent[];
    startTimestamp: number;
}

export interface IReplayState {
    events: DraftEvent[];
    countdownInterval: NodeJS.Timeout | null;
    stopCountdown: NodeJS.Timeout | null;
    eventTimeouts: NodeJS.Timeout[];
}

export interface ApplicationState {
    draft: IDraftState,
    countdown: ICountdownState,
    replay: IReplayState,
    ownProperties: IDraftOwnPropertiesState,
    language: ILanguageState,
    iconStyle: IIconStyleState,
    modal: IModalState,
    presetEditor: IPresetEditorState,
    colorScheme: IColorSchemeState,
    recentDrafts: IRecentDraftsState,
    admin: IAdminState,
}

export interface IDraftOwnPropertiesState {
    whoAmI?: Player;
    ownName: string | null;
    nextAction: number;
    highlightedAction: number | null;
}

export interface ICountdownState {
    countdownValue: number;
    countdownVisible: boolean;
}

export interface IModalState {
    showModal: boolean;
    showRoleModal: boolean;
}

export interface IPresetEditorState {
    editorPreset: Preset | null;
}

export interface ILanguageState {
    language: string;
}

export interface IIconStyleState {
    iconStyle: string;
}


export interface IColorSchemeState {
    colorScheme: ColorScheme;
}

export interface ICountdownValues {
    value: number;
    display: boolean;
}

export interface IRecentDraft {
    title: string;
    draftId: string;
    presetId?: string;
    nameHost: string;
    nameGuest: string;
    ongoing: boolean;
}

export interface IAlert {
    class: string;
    title: string;
    content: string;
    closable: boolean;
}

export interface IAdminState {
    apiKey?: string;
    presetsAndDrafts?: IPresetAndDraftList;
}

export interface IServerState {
    maintenanceMode: boolean
    hiddenPresetIds: string[]
}

export interface IPresetAndDraftList {
    presets: IPresetMetaData[]
    drafts: { [draftId: string]: IDraftMetaData }
    drafts_by_preset_id: { [presetId: string]: string[] }
    drafts_by_title: { [presetId: string]: string[] }
}

export interface IPresetMetaData {
    code: string
    name: string
    created: number
    last_draft: number
}

export interface IDraftMetaData {
    host: string
    guest: string
    created: number
}

export interface IRecentDraftsState {
    drafts: IRecentDraft[],
    newDraftIndex: number
}
