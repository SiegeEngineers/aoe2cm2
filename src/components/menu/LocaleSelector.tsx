import * as React from 'react';
import LanguageOption from "../../containers/LanguageOption";


interface IProps {
}

class LocaleSelector extends React.Component<IProps, object> {

    public render() {

        return (
            <div className={'buttons has-addons'}>
                <LanguageOption language={'en-GB'} displayString={'EN'} tooltipString={'Switch language to English'}/>
                <LanguageOption language={'es-ES'} displayString={'ES'} tooltipString={'Cambiar el idioma a español'}/>
                <LanguageOption language={'de-DE'} displayString={'DE'} tooltipString={'Sprache zu Deutsch ändern'}/>
                <LanguageOption language={'zh-CN'} displayString={'中文'} tooltipString={'将语言设置为中文'}/>
            </div>
        );
    }
}

export default LocaleSelector;
