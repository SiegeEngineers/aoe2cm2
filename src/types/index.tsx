import Preset from "../models/Preset";
import Player from "../models/Player";
import {DraftEvent} from "../models/DraftEvent";
export interface IStoreState {
    nameHost: string;
    nameGuest: string;
    whoAmI: Player;
    preset: Preset;
    nextAction: number;
    events: DraftEvent[];
}
