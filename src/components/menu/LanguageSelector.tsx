import * as React from 'react';
import {default as i18n} from "../../i18n";
import {WithTranslation, withTranslation} from "react-i18next";


interface IProps extends WithTranslation{
    language: string;
    displayString: string;
    onSetLanguage?: (language: string) => void;
}

class LanguageSelector extends React.Component<IProps, object> {

    public render() {

        const changeLanguage = () => {
            if (this.props.onSetLanguage !== undefined) {
                this.props.onSetLanguage(this.props.language);
            }
        };

        let className ="language-selector pure-button";
        if(this.props.language === i18n.language){
            className += ' pure-button-active';
        }

        return (
            <button className={className} onClick={changeLanguage}>
                {this.props.displayString}
            </button>
        );
    }
}

export default withTranslation()(LanguageSelector);
