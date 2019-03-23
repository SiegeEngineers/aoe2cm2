import Preset from "./Preset";
import {IStoreState} from "../types";
import Player from "./Player";
import {DraftEvent} from "./DraftEvent";
import NameGenerator from "./NameGenerator";

class Draft implements IStoreState {
    public nameHost: string;
    public nameGuest: string;
    public hostReady: boolean;
    public guestReady: boolean;
    public whoAmI: Player;
    public ownName: string | null = null;
    public readonly preset: Preset;
    public nextAction: number = 0;
    public events: DraftEvent[] = [];
    public showModal: boolean;


    public language: string = 'en-GB';

    constructor(nameHost: string, nameGuest: string, preset: Preset) {
        this.nameHost = nameHost;
        this.nameGuest = nameGuest;
        this.preset = preset;
        this.whoAmI = Player.HOST;
        this.hostReady = false;
        this.guestReady = false;
        this.ownName = NameGenerator.getNameFromLocalStorage();
        this.showModal = this.ownName === null;
    }

    public setWhoAmI(whoAmI: Player) {
        this.whoAmI = whoAmI;
    }

    public static playersAreReady(draft: IStoreState) {
        return draft.hostReady && draft.guestReady;
    }

}

export default Draft