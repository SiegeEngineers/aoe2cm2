import Player from "../constants/Player";
import Action from "../constants/Action";

class AdminEvent {
    public readonly player: Player;
    public readonly action: Action;
    public offset: number;

    constructor(player: Player, action: Action) {
        this.player = player;
        this.action = action;
        this.offset = 0;
    }

    public static from(source: AdminEvent): AdminEvent {
        const adminEvent = new AdminEvent(source.player, source.action);
        adminEvent.offset = source.offset;
        return adminEvent;
    }
}

export default AdminEvent;
