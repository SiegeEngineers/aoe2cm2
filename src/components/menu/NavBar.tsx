import * as React from "react";
import UsernameSelector from "../../containers/UsernameSelector";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import IconStyleSelector from "../../containers/IconStyleSelector";
import ColorSchemeToggle from "../../containers/ColorSchemeToggle";
import {Link} from "react-router-dom";
import LocaleSelector from "./LocaleSelector";

class NavBar extends React.Component<WithTranslation, object> {
    public render() {
        return (
            <nav className="navbar is-flex-touch" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <h1 className="navbar-item"><Link to={"/"}>Captains Mode for Age of Empires</Link></h1>
                </div>
                <div className="navbar-end is-flex-touch">
                    <div className="navbar-item">
                        <a href="https://siegeengineers.org/donate/?from=aoe2cm" className="button is-ghost"><Trans>menu.donate</Trans></a>
                    </div>
                    <div className="navbar-item">
                        <Trans i18nKey="youAre">You are:</Trans> &nbsp;
                        <div className="buttons has-addons is-inline-flex has-tooltip-arrow has-tooltip-bottom"
                             data-tooltip={this.props.t('navbar.setName')}>
                            <UsernameSelector/>
                        </div>
                    </div>
                    <div className="navbar-item">
                        <LocaleSelector/>
                    </div>
                    <div className="navbar-item">
                        <div className={'buttons'}>
                            <ColorSchemeToggle/>
                        </div>
                    </div>
                    <div className="navbar-item">
                        <div className={'buttons has-addons'}>
                            <IconStyleSelector iconStyle={'units'} displayString={this.props.t('navbar.showUnits')}/>
                            <IconStyleSelector iconStyle={'emblems'} displayString={this.props.t('navbar.showEmblems')}/>
                            <IconStyleSelector iconStyle={'units-animated'} displayString={this.props.t('navbar.showUnitsAnimated')}/>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default withTranslation()(NavBar);
