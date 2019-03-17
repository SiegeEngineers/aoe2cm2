import Preset from "../models/Preset";
import Player from "../models/Player";
import {DraftEvent} from "../models/DraftEvent";
export interface IStoreState {
    nameHost?: string;
    nameGuest?: string;
    hostReady: boolean;
    guestReady: boolean;
    whoAmI?: Player;
    ownName: string | null;
    preset?: Preset;
    nextAction: number;
    events: DraftEvent[];
    language: string;
    showModal: boolean;
}
