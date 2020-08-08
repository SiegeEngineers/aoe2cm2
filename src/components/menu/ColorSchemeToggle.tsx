import * as React from 'react';
import {WithTranslation, withTranslation} from "react-i18next";
import BrightnessAutoIcon from "mdi-react/BrightnessAutoIcon";
import Brightness4Icon from "mdi-react/Brightness4Icon";
import Brightness5Icon from "mdi-react/Brightness5Icon";
import {ColorScheme} from "../../constants/ColorScheme";
import ColorSchemeHelpers from "../../util/ColorSchemeHelpers";

interface IProps extends WithTranslation {
    activeColorScheme: ColorScheme
    onToggleColorScheme?: (colorScheme: ColorScheme) => void;
}

const brightnessIcons = {
    [ColorScheme.AUTO]: <BrightnessAutoIcon />,
    [ColorScheme.DARK]: <Brightness4Icon />,
    [ColorScheme.LIGHT]: <Brightness5Icon />,
};

class ColorSchemeToggle extends React.Component<IProps, object> {
    constructor(props: IProps) {
        super(props);
        this.listenForColorSchemePreferenceChange = this.listenForColorSchemePreferenceChange.bind(this);
    }

    public componentDidMount() {
        // Set the theme as per the user's previous preference
        ColorSchemeHelpers.changeColorScheme(this.props.activeColorScheme);

        // Listen for changes to OS preference set by the user while the app is open.
        try {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener(
                'change', this.listenForColorSchemePreferenceChange
            );
        } catch (e) {
            if (e instanceof TypeError) {
                // Safari does not yet support addEventListener. See: https://github.com/mdn/sprints/issues/858
                window.matchMedia('(prefers-color-scheme: dark)').addListener(
                    this.listenForColorSchemePreferenceChange
                );
            } else {
                throw e;
            }
        }
    }

    private listenForColorSchemePreferenceChange(evt: MediaQueryListEvent): void {
        const preference = evt.matches ? ColorScheme.DARK : ColorScheme.LIGHT;
        console.log('OS Color Scheme Preference changed', preference);
        if (this.props.activeColorScheme == ColorScheme.AUTO) {
            ColorSchemeHelpers.changeColorScheme(preference)
        }
    }

    public render() {
        const toggleDarkMode = () => {
            const allColorSchemes = Object.values(ColorScheme)
            const nextColorSchemeIndex = (allColorSchemes.indexOf(this.props.activeColorScheme) + 1) % allColorSchemes.length;
            if (this.props.onToggleColorScheme !== undefined) {
                this.props.onToggleColorScheme(allColorSchemes[nextColorSchemeIndex]);
            }
        };

        const icon = brightnessIcons[this.props.activeColorScheme];

        return (
            <button className="button is-light has-tooltip-bottom has-tooltip-arrow"
                    onClick={toggleDarkMode}
                    aria-label={this.props.t('navbar.colorScheme')}
                    data-tooltip={this.props.t('navbar.toggleColorScheme', {
                        'scheme': this.props.t('navbar.colorScheme.'+ this.props.activeColorScheme)
                    })}>
                {icon}
            </button>
        );
    }
}

export default withTranslation()(ColorSchemeToggle);
