import {IRecentDraft, IRecentDraftsState} from "../types";
import {RecentDraftsAction} from "../actions";
import {ClientActions, ServerActions} from "../constants";

export const initialRecentDraftsState: IRecentDraftsState = {
    subscribeCount: 0,
    drafts: [],
    newDraftIndex: -1,
};

const MAX_VISIBLE_DRAFTS = 500;

function applyDraftUpdate(state: IRecentDraftsState, draft: IRecentDraft) {
    const recentDrafts = state.drafts!;
    const index = recentDrafts.findIndex(v => v.draftId === draft.draftId);
    if (index >= 0) {
        recentDrafts[index] = draft;
    } else {
        recentDrafts.unshift(draft);
        while (recentDrafts.length > MAX_VISIBLE_DRAFTS) {
            recentDrafts.pop();
        }
        state.newDraftIndex += 1;
    }
}

function applyDraftRemoval(state: IRecentDraftsState, draftId: string) {
    const recentDrafts = state.drafts!;
    const index = recentDrafts.findIndex(v => v.draftId === draftId);
    if (index !== -1) {
        recentDrafts.splice(index, 1);
        if (index <= state.newDraftIndex) {
            state.newDraftIndex -= 1;
        }
    }
}

export const recentDraftsReducer = (state: IRecentDraftsState = initialRecentDraftsState, action: RecentDraftsAction) => {
    if (action.type === ClientActions.SPECTATE_DRAFTS) {
        console.log(ClientActions.SPECTATE_DRAFTS);
        return { 
            ...state,
            subscribeCount: state.subscribeCount + 1
        };
    } else if (action.type === ClientActions.UNSPECTATE_DRAFTS) {
        console.log(ClientActions.UNSPECTATE_DRAFTS);
        return { 
            ...state,
            subscribeCount: state.subscribeCount - 1
        };
    } else if (action.type === ServerActions.UPDATE_DRAFTS) {
        console.log(ServerActions.UPDATE_DRAFTS, action.value);
        
        if (!state.drafts.length) {
            return {
                ...state,
                drafts: action.value,
                newDraftIndex: -1
            };
        } else {
            const newState = {
                ...state,
                drafts: [...state.drafts]
            };
        
            action.value.reverse().forEach(draft => applyDraftUpdate(newState, draft));
    
            return newState;
        }
    } else if (action.type === ServerActions.REMOVE_DRAFTS) {
        const newState = {
            ...state,
            drafts: [...state.drafts]
        };
        
        action.value.forEach(draftId => applyDraftRemoval(newState, draftId));

        return newState;
    } else if (action.type === ClientActions.RESET_RECENT_DRAFTS_CURSOR) {
        return {
            ...state, 
            newDraftIndex: -1
        };
    } else {
        return state;
    }
};