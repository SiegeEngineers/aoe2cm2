import {ColorScheme} from "../constants/ColorScheme";

class ColorSchemeHelpers {

    public static getColorSchemeFromLocalStorage(): ColorScheme {
        try {
            const preference = localStorage.getItem('preferred_color_scheme');
            let scheme: ColorScheme = ColorScheme.AUTO;
            Object.keys(ColorScheme).forEach(function (key: string) {
                const k = key as keyof typeof ColorScheme;
                if (ColorScheme[k] === preference) {
                    scheme = ColorScheme[k];
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
            this.addThemeClassName('has-theme-dark');
        } else {
            this.removeThemeClassName('has-theme-dark');
        }
    }

    public static addThemeClassName(className: string) {
        document.documentElement.classList.add(className);
        document.body.classList.add(className);
    }

    public static removeThemeClassName(className: string) {
        document.documentElement.classList.remove(className);
        document.body.classList.remove(className);
    }

}

export default ColorSchemeHelpers;
