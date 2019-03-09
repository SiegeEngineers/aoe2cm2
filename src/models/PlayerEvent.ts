import Civilisation from "./Civilisation";
import ActionType from "./ActionType";
import Player from "./Player";

export class PlayerEvent {
    public readonly player: Player;
    public readonly actionType: ActionType;
    public readonly civilisation: Civilisation;

    constructor(player: Player, actionType: ActionType, civilisation: Civilisation) {
        this.player = player;
        this.actionType = actionType;
        this.civilisation = civilisation;
    }
}

export default PlayerEvent;
