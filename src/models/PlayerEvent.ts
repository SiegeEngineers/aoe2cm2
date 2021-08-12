import ActionType from "../constants/ActionType";
import Player from "../constants/Player";
import LegacyPlayerEvent from "./LegacyPlayerEvent";

class PlayerEvent {
    public readonly player: Player;
    public readonly executingPlayer: Player;
    public readonly actionType: ActionType;
    public chosenOptionId: string;
    public isRandomlyChosen: boolean;
    public offset: number;

    constructor(player: Player, actionType: ActionType, chosenOptionId: string, isRandomlyChosen: boolean = false, executingPlayer: Player = player) {
        this.player = player;
        this.executingPlayer = executingPlayer;
        this.actionType = actionType;
        this.chosenOptionId = chosenOptionId;
        this.isRandomlyChosen = isRandomlyChosen;
        this.offset = 0;
    }

    public static from(source: PlayerEvent): PlayerEvent {
        const playerEvent = new PlayerEvent(source.player, source.actionType, source.chosenOptionId, source.isRandomlyChosen, source.executingPlayer);
        playerEvent.offset = source.offset;
        return playerEvent;
    }

    public static fromLegacy(source: LegacyPlayerEvent): PlayerEvent {
        const playerEvent = new PlayerEvent(source.player, source.actionType, source.civilisation.name, source.civilisation.isRandomlyChosenCiv, source.executingPlayer);
        playerEvent.offset = source.offset;
        return playerEvent;
    }
}

export default PlayerEvent;
