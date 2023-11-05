import Action from "./Action";

enum ActionType {
    PICK = "pick",
    BAN = "ban",
    SNIPE = "snipe",
    STEAL = "steal",
    REVEAL = "reveal",
    PAUSE = "pause",
    RESET_CL = "reset_cl",
    NOTHING = "nothing"
}

export function actionTypeFromAction(action: Action) {
    switch (action) {
        case Action.PICK:
            return ActionType.PICK;
        case Action.BAN:
            return ActionType.BAN;
        case Action.SNIPE:
            return ActionType.SNIPE;
        case Action.STEAL:
            return ActionType.STEAL;
        case Action.REVEAL_PICKS:
        case Action.REVEAL_BANS:
        case Action.REVEAL_SNIPES:
        case Action.REVEAL_ALL:
            return ActionType.REVEAL;
        case Action.PAUSE:
            return ActionType.PAUSE;
        case Action.RESET_CL:
            return ActionType.RESET_CL;
    }
}

export default ActionType;