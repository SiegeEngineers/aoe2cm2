import {IAdminState} from "../types";
import {AdminAction} from "../actions";
import {Actions} from "../constants";
import {Util} from "../util/Util";

export const initialAdminState: IAdminState = {
    apiKey: Util.getApiKeyFromLocalStorage(),
    presetName: undefined,
};

export const adminReducer = (state: IAdminState = initialAdminState, action: AdminAction) => {
    if (action.type === Actions.SET_API_KEY) {
        console.log(Actions.SET_API_KEY, action.apiKey);
        Util.writeApiKeyToLocalStorage(action.apiKey);
        return {
            ...state,
            apiKey: action.apiKey
        };
    } else if (action.type === Actions.SET_ADMIN_PRESET_NAME) {
        console.log(Actions.SET_ADMIN_PRESET_NAME, action.name);
        return {
            ...state,
            presetName: action.name
        };
    } else {
        return state;
    }
};