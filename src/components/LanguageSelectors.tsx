import * as React from "react";
import LanguageSelector from "../containers/LanguageSelector";

class LanguageSelectors extends React.Component<object, object> {
    public render() {
        return (
            <div className={'languageSelectors'}>
                <LanguageSelector language={'en-GB'}/>
                <LanguageSelector language={'de-DE'}/>
                <LanguageSelector language={'zh-CN'}/>
            </div>
        );
    }
}

export default LanguageSelectors;