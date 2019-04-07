import Player from "./Player";
import {IDraftState} from "../types";

export interface IDraftConfig extends IDraftState {
    yourPlayerType: Player
}