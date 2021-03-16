import * as React from 'react';
// import {default as i18n} from "../../i18n";
import {WithTranslation, withTranslation} from "react-i18next";


interface IProps extends WithTranslation {
    language: string;
    displayString: string;
    tooltipString: string;
    onSetLanguage?: (language: string) => void;
}

class LocaleOption extends React.Component<IProps, object> {

    public render() {

        const changeLanguage = () => {
            if (this.props.onSetLanguage !== undefined) {
                this.props.onSetLanguage(this.props.language);
            }
        };

        let className = "button is-white dropdown-item has-tooltip-right has-tooltip-arrow";

        return (
            <button className={className} onClick={changeLanguage}
               data-tooltip={this.props.tooltipString}>
                {this.props.displayString} <code style={{"float":"right", "marginRight":"-30px"}}>{this.props.language}</code>
            </button>
        );
    }
}

export default withTranslation()(LocaleOption);
