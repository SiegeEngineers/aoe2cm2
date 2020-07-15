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
    colorScheme: IColorSchemeState
}

export interface IDraftOwnPropertiesState {
    whoAmI?: Player;
    ownName: string | null;
    nextAction: number;
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
