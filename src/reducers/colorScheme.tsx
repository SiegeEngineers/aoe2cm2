import {IColorSchemeState} from "../types";
import {ColorSchemeAction} from "../actions";
import {Actions} from "../constants";
import ColorSchemeStore from "../util/ColorSchemeStore";
import {ColorScheme} from "../constants/ColorScheme";

export const initialColorSchemeState: IColorSchemeState = {
    colorScheme: ColorSchemeStore.getColorSchemeFromLocalStorage(),
};

export const colorSchemeReducer = (state: IColorSchemeState = initialColorSchemeState, action: ColorSchemeAction) => {
    if (action.type === Actions.SET_COLOR_SCHEME) {
        console.log(Actions.SET_COLOR_SCHEME, action.colorScheme);
        ColorSchemeStore.writeNameToLocalStorage(action.colorScheme);
        changeColorScheme(action.colorScheme);
        return {
            ...state,
            colorScheme: action.colorScheme
        };
    } else {
        return state;
    }
};

function getOSColorSchemePreference(): ColorScheme {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const preference = mq.matches ? ColorScheme.DARK : ColorScheme.LIGHT;
    console.log('OS Preference mode', preference);
    return preference;

    // mq.addEventListener('change', function (evt) {
    //     console.log(`} mode`);
    //     const preference = evt.matches ? ColorScheme.DARK : ColorScheme.LIGHT;
    //     console.log('OS Preference changed', preference);
    //     setColorScheme(preference)
    // });
}

function changeColorScheme(colorScheme: ColorScheme) {
    if (colorScheme == ColorScheme.DARK ||
        (colorScheme == ColorScheme.AUTO && getOSColorSchemePreference() == ColorScheme.DARK)) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}