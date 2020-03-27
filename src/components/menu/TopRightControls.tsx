import * as React from "react";
import LanguageSelector from "../../containers/LanguageSelector";
import UsernameSelector from "../../containers/UsernameSelector";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import IconStyleSelector from "../../containers/IconStyleSelector";

class TopRightControls extends React.Component<WithTranslation, object> {
    public render() {
        return (
            <div className={'topRightControls'}>
                <Trans i18nKey="youAre">You are:</Trans> <UsernameSelector/>
                <LanguageSelector language={'en-GB'} displayString={'EN'}/>
                <LanguageSelector language={'de-DE'} displayString={'DE'}/>
                <LanguageSelector language={'zh-CN'} displayString={'中文'}/>
                &nbsp;
                <IconStyleSelector iconStyle={'units'} displayString={'units'}/>
                <IconStyleSelector iconStyle={'emblems'} displayString={'emblems'}/>
            </div>
        );
    }
}

export default withTranslation()(TopRightControls);
