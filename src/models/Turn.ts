import Action from "../constants/Action";
import Player from "../constants/Player";
import {Assert} from "../util/Assert";
import { v4 as uuidv4 } from 'uuid';
import Exclusivity from "../constants/Exclusivity";

class Turn {
    public static readonly HOST_NONEXCLUSIVE_PICK = new Turn(Player.HOST, Action.PICK, Exclusivity.NONEXCLUSIVE);
    public static readonly HOST_PICK = new Turn(Player.HOST, Action.PICK, Exclusivity.EXCLUSIVE);
    public static readonly HOST_GLOBAL_PICK = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL);
    public static readonly HOST_HIDDEN_PICK = new Turn(Player.HOST, Action.PICK, Exclusivity.NONEXCLUSIVE, true);
    public static readonly HOST_HIDDEN_EXCLUSIVE_PICK = new Turn(Player.HOST, Action.PICK, Exclusivity.EXCLUSIVE, true);
    public static readonly HOST_NONEXCLUSIVE_BAN = new Turn(Player.HOST, Action.BAN, Exclusivity.NONEXCLUSIVE);
    public static readonly HOST_BAN = new Turn(Player.HOST, Action.BAN, Exclusivity.EXCLUSIVE);
    public static readonly HOST_GLOBAL_BAN = new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL);
    public static readonly HOST_HIDDEN_BAN = new Turn(Player.HOST, Action.BAN, Exclusivity.NONEXCLUSIVE, true);
    public static readonly HOST_HIDDEN_EXCLUSIVE_BAN = new Turn(Player.HOST, Action.BAN, Exclusivity.EXCLUSIVE, true);
    public static readonly HOST_HIDDEN_GLOBAL_BAN = new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, true);
    public static readonly HOST_SNIPE = new Turn(Player.HOST, Action.SNIPE, Exclusivity.NONEXCLUSIVE);
    public static readonly HOST_HIDDEN_SNIPE = new Turn(Player.HOST, Action.SNIPE, Exclusivity.NONEXCLUSIVE, true);

    public static readonly GUEST_NONEXCLUSIVE_PICK = new Turn(Player.GUEST, Action.PICK, Exclusivity.NONEXCLUSIVE);
    public static readonly GUEST_PICK = new Turn(Player.GUEST, Action.PICK, Exclusivity.EXCLUSIVE);
    public static readonly GUEST_GLOBAL_PICK = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL);
    public static readonly GUEST_HIDDEN_PICK = new Turn(Player.GUEST, Action.PICK, Exclusivity.NONEXCLUSIVE, true);
    public static readonly GUEST_HIDDEN_EXCLUSIVE_PICK = new Turn(Player.GUEST, Action.PICK, Exclusivity.EXCLUSIVE, true);
    public static readonly GUEST_NONEXCLUSIVE_BAN = new Turn(Player.GUEST, Action.BAN, Exclusivity.NONEXCLUSIVE);
    public static readonly GUEST_BAN = new Turn(Player.GUEST, Action.BAN, Exclusivity.EXCLUSIVE);
    public static readonly GUEST_GLOBAL_BAN = new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL);
    public static readonly GUEST_HIDDEN_BAN = new Turn(Player.GUEST, Action.BAN, Exclusivity.NONEXCLUSIVE, true);
    public static readonly GUEST_HIDDEN_EXCLUSIVE_BAN = new Turn(Player.GUEST, Action.BAN, Exclusivity.EXCLUSIVE, true);
    public static readonly GUEST_HIDDEN_GLOBAL_BAN = new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL, true);
    public static readonly GUEST_SNIPE = new Turn(Player.GUEST, Action.SNIPE, Exclusivity.NONEXCLUSIVE);
    public static readonly GUEST_HIDDEN_SNIPE = new Turn(Player.GUEST, Action.SNIPE, Exclusivity.NONEXCLUSIVE, true);

    public static readonly REVEAL_PICKS = new Turn(Player.NONE, Action.REVEAL_PICKS, Exclusivity.GLOBAL);
    public static readonly REVEAL_BANS = new Turn(Player.NONE, Action.REVEAL_BANS, Exclusivity.GLOBAL);
    public static readonly REVEAL_SNIPES = new Turn(Player.NONE, Action.REVEAL_SNIPES, Exclusivity.GLOBAL);
    public static readonly REVEAL_ALL = new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL);


    public readonly player: Player;
    public readonly action: Action;
    public readonly exclusivity: Exclusivity;
    public readonly hidden: boolean;
    public readonly parallel: boolean;
    public readonly executingPlayer: Player;
    public readonly id: string;

    constructor(player: Player, action: Action, exclusivity: Exclusivity, hidden: boolean = false, parallel: boolean = false, executingPlayer: Player = player) {
        this.id = uuidv4();
        this.player = player;
        this.action = action;
        this.exclusivity = exclusivity;
        this.hidden = hidden;
        this.executingPlayer = executingPlayer;
        this.parallel = parallel;
    }

    static fromPojoArray(turns: Turn[]) {
        let retval: Turn[] = [];
        for (let turn of turns) {
            Assert.isPlayer(turn.player);
            Assert.isPlayerOrUndefined(turn.executingPlayer);
            Assert.isAction(turn.action);
            Assert.isExclusivity(turn.exclusivity);
            Assert.isBoolean(turn.hidden);
            Assert.isBoolean(turn.parallel);
            retval.push(new Turn(turn.player, turn.action, turn.exclusivity, turn.hidden, turn.parallel, turn.executingPlayer));
        }
        return retval;
    }
}

export default Turn;