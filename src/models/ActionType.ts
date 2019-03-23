import Action from "./Action";

enum ActionType {
    PICK = "pick",
    BAN = "ban",
    SNIPE = "snipe",
    REVEAL = "reveal",
    NOTHING = "nothing"
}

export function actionTypeFromAction(action: Action) {
    switch (action) {
        case Action.PICK:
        case Action.EXCLUSIVE_PICK:
        case Action.GLOBAL_PICK:
        case Action.HIDDEN_PICK:
        case Action.HIDDEN_EXCLUSIVE_PICK:
            return ActionType.PICK;
        case Action.BAN:
        case Action.EXCLUSIVE_BAN:
        case Action.GLOBAL_BAN:
        case Action.HIDDEN_BAN:
        case Action.HIDDEN_EXCLUSIVE_BAN:
        case Action.HIDDEN_GLOBAL_BAN:
            return ActionType.BAN;
        case Action.SNIPE:
        case Action.HIDDEN_SNIPE:
            return ActionType.SNIPE;
        // case Action.REVEAL_PICKS:
        // case Action.REVEAL_BANS:
        // case Action.REVEAL_SNIPES:
        case Action.REVEAL_ALL:
            return ActionType.REVEAL;
    }
}

export default ActionType;