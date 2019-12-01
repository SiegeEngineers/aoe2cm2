import Civilisation from "./Civilisation";
import ActionType from "../constants/ActionType";
import Player from "../constants/Player";

class PlayerEvent {
    public readonly player: Player;
    public readonly actionType: ActionType;
    public civilisation: Civilisation;

    constructor(player: Player, actionType: ActionType, civilisation: Civilisation) {
        this.player = player;
        this.actionType = actionType;
        this.civilisation = civilisation;
    }
}

export default PlayerEvent;
