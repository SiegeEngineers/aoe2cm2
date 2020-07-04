import * as React from "react";
import LanguageSelector from "../../containers/LanguageSelector";
import UsernameSelector from "../../containers/UsernameSelector";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import IconStyleSelector from "../../containers/IconStyleSelector";
import {Link} from "react-router-dom";

class NavBar extends React.Component<WithTranslation, object> {
    public render() {
        return (
            <nav className="navbar is-flex-touch" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <h1 className="navbar-item"><Link className="has-text-dark" to={"/"}>Captains Mode for Age of Empires II</Link></h1>
                </div>
                <div className="navbar-end is-flex-touch">
                    <div className="navbar-item">
                        <Trans i18nKey="youAre">You are:</Trans> &nbsp;
                        <div className="buttons has-addons is-inline-flex has-tooltip-arrow has-tooltip-bottom"
                             data-tooltip={this.props.t('navbar.setName')}>
                            <UsernameSelector/>
                        </div>
                    </div>
                    <div className="navbar-item">
                        <div className={'buttons has-addons'}>
                            <LanguageSelector language={'en-GB'} displayString={'EN'}/>
                            <LanguageSelector language={'de-DE'} displayString={'DE'}/>
                            <LanguageSelector language={'zh-CN'} displayString={'中文'}/>
                        </div>
                    </div>
                    <div className="navbar-item">
                        <div className={'buttons has-addons'}>
                            <IconStyleSelector iconStyle={'units'} displayString={this.props.t('navbar.showUnits')}/>
                            <IconStyleSelector iconStyle={'emblems'} displayString={this.props.t('navbar.showEmblems')}/>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default withTranslation()(NavBar);
