import Player from "./Player";
import {DraftEvent} from "./DraftEvent";

export interface IDraftConfig {
    nameHost: string,
    nameGuest: string,
    yourPlayerType: Player,
    events: DraftEvent[],
    nextAction: number
}