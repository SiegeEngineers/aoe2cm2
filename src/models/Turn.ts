import Action from "./Action";
import Player from "./Player";

class Turn {
    public static readonly HOST_PICK = new Turn(Player.HOST, Action.PICK);
    public static readonly HOST_EXCLUSIVE_PICK = new Turn(Player.HOST, Action.EXCLUSIVE_PICK);
    public static readonly HOST_GLOBAL_PICK = new Turn(Player.HOST, Action.GLOBAL_PICK);
    public static readonly HOST_HIDDEN_PICK = new Turn(Player.HOST, Action.HIDDEN_PICK);
    public static readonly HOST_HIDDEN_EXCLUSIVE_PICK = new Turn(Player.HOST, Action.HIDDEN_EXCLUSIVE_PICK);
    public static readonly HOST_BAN = new Turn(Player.HOST, Action.BAN);
    public static readonly HOST_EXCLUSIVE_BAN = new Turn(Player.HOST, Action.EXCLUSIVE_BAN);
    public static readonly HOST_GLOBAL_BAN = new Turn(Player.HOST, Action.GLOBAL_BAN);
    public static readonly HOST_HIDDEN_BAN = new Turn(Player.HOST, Action.HIDDEN_BAN);
    public static readonly HOST_HIDDEN_EXCLUSIVE_BAN = new Turn(Player.HOST, Action.HIDDEN_EXCLUSIVE_BAN);
    public static readonly HOST_HIDDEN_GLOBAL_BAN = new Turn(Player.HOST, Action.HIDDEN_GLOBAL_BAN);
    public static readonly HOST_SNIPE = new Turn(Player.HOST, Action.SNIPE);
    public static readonly HOST_HIDDEN_SNIPE = new Turn(Player.HOST, Action.HIDDEN_SNIPE);

    public static readonly GUEST_PICK = new Turn(Player.GUEST, Action.PICK);
    public static readonly GUEST_EXCLUSIVE_PICK = new Turn(Player.GUEST, Action.EXCLUSIVE_PICK);
    public static readonly GUEST_GLOBAL_PICK = new Turn(Player.GUEST, Action.GLOBAL_PICK);
    public static readonly GUEST_HIDDEN_PICK = new Turn(Player.GUEST, Action.HIDDEN_PICK);
    public static readonly GUEST_HIDDEN_EXCLUSIVE_PICK = new Turn(Player.GUEST, Action.HIDDEN_EXCLUSIVE_PICK);
    public static readonly GUEST_BAN = new Turn(Player.GUEST, Action.BAN);
    public static readonly GUEST_EXCLUSIVE_BAN = new Turn(Player.GUEST, Action.EXCLUSIVE_BAN);
    public static readonly GUEST_GLOBAL_BAN = new Turn(Player.GUEST, Action.GLOBAL_BAN);
    public static readonly GUEST_HIDDEN_BAN = new Turn(Player.GUEST, Action.HIDDEN_BAN);
    public static readonly GUEST_HIDDEN_EXCLUSIVE_BAN = new Turn(Player.GUEST, Action.HIDDEN_EXCLUSIVE_BAN);
    public static readonly GUEST_HIDDEN_GLOBAL_BAN = new Turn(Player.GUEST, Action.HIDDEN_GLOBAL_BAN);
    public static readonly GUEST_SNIPE = new Turn(Player.GUEST, Action.SNIPE);
    public static readonly GUEST_HIDDEN_SNIPE = new Turn(Player.GUEST, Action.HIDDEN_SNIPE);
    
    public static readonly REVEAL_PICKS = new Turn(Player.NONE, Action.REVEAL_PICKS);
    public static readonly REVEAL_BANS = new Turn(Player.NONE, Action.REVEAL_BANS);
    public static readonly REVEAL_SNIPES = new Turn(Player.NONE, Action.REVEAL_SNIPES);
    public static readonly REVEAL_ALL = new Turn(Player.NONE, Action.REVEAL_ALL);


    public readonly player: Player;
    public readonly action: Action;

    constructor(player: Player, action: Action) {
        this.player = player;
        this.action = action;
    }
}

export default Turn;