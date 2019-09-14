import * as React from "react";
import LanguageSelector from "../containers/LanguageSelector";
import UsernameSelector from "../containers/UsernameSelector";

class TopRightControls extends React.Component<object, object> {
    public render() {
        return (
            <div className={'topRightControls'}>
                <UsernameSelector/>
                <LanguageSelector language={'en-GB'} displayString={'EN'}/>
                <LanguageSelector language={'de-DE'} displayString={'DE'}/>
                <LanguageSelector language={'zh-CN'} displayString={'中文'}/>
            </div>
        );
    }
}

export default TopRightControls;