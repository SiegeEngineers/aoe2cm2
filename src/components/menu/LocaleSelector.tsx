import * as React from 'react';
import LocaleOption from "../../containers/LocaleOption";
import ChevronDownIcon from "mdi-react/ChevronDownIcon";
import i18n from "i18next";
import availableLocales from "../../Locales";
import {ReactElement} from "react";
import {Helmet} from "react-helmet";


interface IProps {
}

class LocaleSelector extends React.Component<IProps, object> {

    public render() {
        let localeURL = new URL(window.location.href);
        const searchParams = localeURL.searchParams;
        searchParams.delete('lng');
        localeURL.search = searchParams.toString();
        const langLinkTags = [<link key="x-default" rel="alternate" hrefLang="x-default" href={localeURL.toString()}/>];
        for (let locale in availableLocales) {
            searchParams.set('lng', locale);
            localeURL.search = searchParams.toString();
            langLinkTags.push(<link key={locale} rel="alternate" hrefLang={locale} href={localeURL.toString()}/>)
        }

        console.info(availableLocales)
        let localeOptions: Array<ReactElement> = [];
        let currentLanguage = "Language";
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
                <Helmet htmlAttributes={{lang: i18n.language}}>
                    {langLinkTags}
                </Helmet>
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
