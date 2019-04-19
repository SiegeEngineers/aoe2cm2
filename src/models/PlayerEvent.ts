import Civilisation from "./Civilisation";
import ActionType from "./ActionType";
import Player from "./Player";

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
