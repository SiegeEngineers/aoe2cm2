import * as React from "react";
import LanguageSelector from "../../containers/LanguageSelector";
import UsernameSelector from "../../containers/UsernameSelector";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import IconStyleSelector from "../../containers/IconStyleSelector";

class TopRightControls extends React.Component<WithTranslation, object> {
    public render() {
        return (
            <div className={'topRightControls'}>
                <div className="is-inline-flex"><Trans i18nKey="youAre">You are:</Trans></div>
                &nbsp;&nbsp;
                <div className={'buttons has-addons is-inline-flex'}>
                    <UsernameSelector/>
                </div>
                &nbsp;&nbsp;
                <div className={'buttons has-addons is-inline-flex'}>
                    <LanguageSelector language={'en-GB'} displayString={'EN'}/>
                    <LanguageSelector language={'de-DE'} displayString={'DE'}/>
                    <LanguageSelector language={'zh-CN'} displayString={'中文'}/>
                </div>
                &nbsp;&nbsp;
                <div className={'buttons has-addons is-inline-flex'}>
                    <IconStyleSelector iconStyle={'units'} displayString={'units'}/>
                    <IconStyleSelector iconStyle={'emblems'} displayString={'emblems'}/>
                </div>
            </div>
        );
    }
}

export default withTranslation()(TopRightControls);
