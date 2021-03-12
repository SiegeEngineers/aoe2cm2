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

        let className = "dropdown-item has-tooltip-left has-tooltip-arrow";
        // if (this.props.language === i18n.language) {
        //     className += ' is-active';
        // }

        return (
            <a href="#" className={className} onClick={changeLanguage}
               data-tooltip={this.props.tooltipString}>
                {this.props.displayString} <code style={{"float":"right", "marginRight":"-30px"}}>{this.props.language}</code>
            </a>
        );
    }
}

export default withTranslation()(LocaleOption);
