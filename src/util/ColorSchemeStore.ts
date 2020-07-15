import {ColorScheme} from "../constants/ColorScheme";

class ColorSchemeStore {

    public static getColorSchemeFromLocalStorage(): ColorScheme {
        try {
            const preference = localStorage.getItem('preferred_color_scheme');
            let scheme:ColorScheme = ColorScheme.AUTO;
            Object.keys(ColorScheme).forEach(function (key) {
                if (ColorScheme[key] == preference) {
                    scheme = ColorScheme[key];
                }
            });
            return scheme;
        } catch (e) {
            return ColorScheme.AUTO;
        }
    }

    public static writeNameToLocalStorage(colorScheme: ColorScheme) {
        try {
            localStorage.setItem('preferred_color_scheme', colorScheme);
        } catch (e) {
            console.error("Couldn't save color scheme to local storage", e);
        }
    }

}

export default ColorSchemeStore;
