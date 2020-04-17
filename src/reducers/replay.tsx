import {IReplayState} from "../types";
import {DraftAction} from "../actions";
import {ServerActions} from "../constants";

export const initialReplayState: IReplayState = {
    events: [],
};

export const replayReducer = (state: IReplayState = initialReplayState, action: DraftAction) => {
    switch (action.type) {
        case ServerActions.APPLY_REPLAY:
            console.log(ServerActions.APPLY_REPLAY, action.value);
            const draft = action.value;
            return {
                events: draft.events
            };
    }
    return state;
};