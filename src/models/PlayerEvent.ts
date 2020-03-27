import Civilisation from "./Civilisation";
import ActionType from "../constants/ActionType";
import Player from "../constants/Player";

class PlayerEvent {
    public readonly player: Player;
    public readonly actionType: ActionType;
    public civilisation: Civilisation;
    public offset: number;

    constructor(player: Player, actionType: ActionType, civilisation: Civilisation) {
        this.player = player;
        this.actionType = actionType;
        this.civilisation = civilisation;
        this.offset = 0;
    }
}

export default PlayerEvent;
