import * as React from "react";
import LanguageSelector from "../containers/LanguageSelector";
import UsernameSelector from "../containers/UsernameSelector";

class TopRightControls extends React.Component<object, object> {
    public render() {
        return (
            <div className={'topRightControls'}>
                <UsernameSelector/>
                <LanguageSelector language={'en-GB'}/>
                <LanguageSelector language={'de-DE'}/>
                <LanguageSelector language={'zh-CN'}/>
            </div>
        );
    }
}

export default TopRightControls;