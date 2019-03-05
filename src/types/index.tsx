import Preset from "../models/Preset";
import Player from "../models/Player";

export interface IStoreState {
    nameHost: string;
    nameGuest: string;
    whoAmI: Player;
    preset: Preset;
    nextAction: number;
    events: Event[];
}
