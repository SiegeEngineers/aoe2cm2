import Player from "./Player";
import Action from "./Action";

class AdminEvent {
    public readonly player: Player;
    public readonly action: Action;

    constructor(player: Player, action: Action) {
        this.player = player;
        this.action = action;
    }
}

export default AdminEvent;
