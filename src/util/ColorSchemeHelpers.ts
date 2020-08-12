import {ColorScheme} from "../constants/ColorScheme";

class ColorSchemeHelpers {

    public static getColorSchemeFromLocalStorage(): ColorScheme {
        try {
            const preference = localStorage.getItem('preferred_color_scheme');
            let scheme: ColorScheme = ColorScheme.AUTO;
            Object.keys(ColorScheme).forEach(function (key) {
                if (ColorScheme[key] === preference) {
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

    public static getOSColorSchemePreference(): ColorScheme {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const preference = mq.matches ? ColorScheme.DARK : ColorScheme.LIGHT;
        console.log('OS Preference mode', preference);
        return preference;
    }

    public static changeColorScheme(colorScheme: ColorScheme) {
        if (colorScheme === ColorScheme.AUTO) {
            colorScheme = ColorSchemeHelpers.getOSColorSchemePreference()
        }
        if (colorScheme === ColorScheme.DARK) {
            document.documentElement.classList.add('has-theme-dark');
            document.body.classList.add('has-theme-dark');
        } else {
            document.documentElement.classList.remove('has-theme-dark');
            document.body.classList.remove('has-theme-dark');
        }
    }

}

export default ColorSchemeHelpers;
