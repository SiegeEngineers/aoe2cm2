import {IColorSchemeState} from "../types";
import {ColorSchemeAction} from "../actions";
import {Actions} from "../constants";
import ColorSchemeHelpers from "../util/ColorSchemeHelpers";

export const initialColorSchemeState: IColorSchemeState = {
    colorScheme: ColorSchemeHelpers.getColorSchemeFromLocalStorage(),
};

export const colorSchemeReducer = (state: IColorSchemeState = initialColorSchemeState, action: ColorSchemeAction) => {
    if (action.type === Actions.SET_COLOR_SCHEME) {
        console.log(Actions.SET_COLOR_SCHEME, action.colorScheme);
        ColorSchemeHelpers.writeNameToLocalStorage(action.colorScheme);
        ColorSchemeHelpers.changeColorScheme(action.colorScheme);
        return {
            ...state,
            colorScheme: action.colorScheme
        };
    } else {
        return state;
    }
};
