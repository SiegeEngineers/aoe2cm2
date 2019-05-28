import Preset from "../models/Preset";
import Player from "../models/Player";
import {DraftEvent} from "../models/DraftEvent";

export interface IDraftState {
    nameHost: string;
    nameGuest: string;
    hostReady: boolean;
    guestReady: boolean;
    preset?: Preset;
    events: DraftEvent[];
}

export interface IStoreState extends IDraftState {
    whoAmI?: Player;
    ownName: string | null;
    nextAction: number;
    language: string;
    showModal: boolean;
    countdownValue: number;
    countdownVisible: boolean;
}

export interface ICountdownValues {
    value: number;
    display: boolean;
}