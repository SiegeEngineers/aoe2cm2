import LegacyCivilisation from "./LegacyCivilisation";
import ActionType from "../constants/ActionType";
import Player from "../constants/Player";

class LegacyPlayerEvent {
    public readonly player: Player;
    public readonly executingPlayer: Player;
    public readonly actionType: ActionType;
    public civilisation: LegacyCivilisation;
    public offset: number;

    constructor(player: Player, actionType: ActionType, civilisation: LegacyCivilisation, executingPlayer: Player = player) {
        this.player = player;
        this.executingPlayer = executingPlayer;
        this.actionType = actionType;
        this.civilisation = civilisation;
        this.offset = 0;
    }

    public static from(source: LegacyPlayerEvent): LegacyPlayerEvent {
        const playerEvent = new LegacyPlayerEvent(source.player, source.actionType, source.civilisation, source.executingPlayer);
        playerEvent.offset = source.offset;
        return playerEvent;
    }
}

export default LegacyPlayerEvent;
