import * as React from "react";
import {Link, Route, Switch} from "react-router-dom";
import Practice from "./Practice";
import Presets from "./Presets";
import Preset from "./Preset";
import Index from "./Index";
import Spectate from "./Spectate";
import '../pure-min.css'
import '../style2.css'
import {Trans, withTranslation, WithTranslation} from "react-i18next";

class Menu extends React.Component<WithTranslation, object> {
    public render() {
        return (
            <div className="content">
                <div className="title">
                    <span id="aoe-title">Age of Empires II</span>
                    <span id="cm-logo"/>
                    <span id="cm-title">Captains mode</span>
                </div>
                <div className="pure-menu pure-menu-horizontal main-menu">
                    <ul className="pure-menu-list">
                        <li className="pure-menu-item">
                            <Link to='/' className="pure-menu-link"><Trans>menu.welcome</Trans></Link>
                        </li>
                        <li className="pure-menu-item">
                            <Link to='/presets' className="pure-menu-link"><Trans>menu.hostOrJoin</Trans></Link>
                        </li>
                        <li className="pure-menu-item">
                            <Link to='/spectate' className="pure-menu-link"><Trans>menu.spectate</Trans></Link>
                        </li>
                        <li className="pure-menu-item">
                            <Link to='/practice' className="pure-menu-link"><Trans>menu.practice</Trans></Link>
                        </li>
                        <li className="pure-menu-item">
                            {/*Todo: remove this, it is only for testing purposes during development*/}
                            <a href='/new' className="pure-menu-link">dev:new</a>
                        </li>
                    </ul>
                </div>
                <Switch>
                    <Route exact path="/" component={Index}/>
                    <Route path="/presets" component={Presets}/>
                    <Route path="/preset/:id" component={Preset}/>
                    <Route path="/spectate" component={Spectate}/>
                    <Route path="/practice" component={Practice}/>
                </Switch>
            </div>
        );
    }
}

export default withTranslation()(Menu);