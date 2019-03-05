import Preset from "./Preset";
import {IStoreState} from "../types";
import Player from "./Player";

class Draft implements IStoreState {
    public readonly nameHost: string;
    public readonly nameGuest: string;
    public whoAmI: Player;
    public readonly preset: Preset;
    public nextAction: number = 0;
    public events: Event[] = [];

    constructor(nameHost: string, nameGuest: string, preset: Preset) {
        this.nameHost = nameHost;
        this.nameGuest = nameGuest;
        this.preset = preset;
    }

    public setWhoAmI(whoAmI: Player) {
        this.whoAmI = whoAmI;
    }
}

export default Draft