import Player from "../constants/Player";
import {IDraftState} from "./index";

export interface IDraftConfig extends IDraftState {
    yourPlayerType: Player
}