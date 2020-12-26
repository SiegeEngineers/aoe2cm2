import Civilisation from "./Civilisation";
import ActionType from "../constants/ActionType";
import Player from "../constants/Player";

class PlayerEvent {
    public readonly player: Player;
    public readonly executingPlayer: Player;
    public readonly actionType: ActionType;
    public civilisation: Civilisation;
    public offset: number;

    constructor(player: Player, actionType: ActionType, civilisation: Civilisation, executingPlayer: Player = player) {
        this.player = player;
        this.executingPlayer = executingPlayer;
        this.actionType = actionType;
        this.civilisation = civilisation;
        this.offset = 0;
    }

    public static from(source: PlayerEvent): PlayerEvent {
        const playerEvent = new PlayerEvent(source.player, source.actionType, source.civilisation, source.executingPlayer);
        playerEvent.offset = source.offset;
        return playerEvent;
    }
}

export default PlayerEvent;
