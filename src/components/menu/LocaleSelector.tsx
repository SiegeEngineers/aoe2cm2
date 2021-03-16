import * as React from 'react';
import LocaleOption from "../../containers/LocaleOption";
import ChevronDownIcon from "mdi-react/ChevronDownIcon";
import i18n from "i18next";
import availableLocales from "../../Locales";
import {ReactElement} from "react";


interface IProps {
}

class LocaleSelector extends React.Component<IProps, object> {

    public render() {
        console.info(availableLocales)
        let localeOptions: Array<ReactElement> = [];
        let currentLanguage;
        Object.keys(availableLocales).forEach(function (key) {
            if (key === i18n.language) {
                currentLanguage = availableLocales[key]['displayName'];
            }
            localeOptions.push(<LocaleOption language={key}
                                             displayString={availableLocales[key]['displayName']}
                                             tooltipString={availableLocales[key]['cta']}
                                             key={key}/>);
        });

        return (
            <div className="dropdown is-hoverable is-right">
                <div className="dropdown-trigger">
                    <button className="button is-light has-tooltip-bottom has-tooltip-arrow" aria-haspopup="true"
                            aria-controls="dropdown-menu">
                        <span>{currentLanguage}</span>
                        <span className="icon is-small">
                            <ChevronDownIcon/>
                            </span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        {localeOptions}
                        <hr className="dropdown-divider"/>
                        <a href="https://github.com/SiegeEngineers/aoe2cm2#translations"
                           className="dropdown-item" target="_blank" rel="noopener noreferrer">Submit a Translation
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default LocaleSelector;
