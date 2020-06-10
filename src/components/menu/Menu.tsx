import * as React from "react";
import {Link, Route, Switch} from "react-router-dom";
import Practice from "./Practice";
import Presets from "./Presets";
import Preset from "./Preset";
import Index from "./Index";
import Spectate from "./Spectate";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import Modal from "../../containers/Modal";
import PresetEditor from "../PresetEditor/PresetEditor";

class Menu extends React.Component<WithTranslation, object> {
    public render() {
        return (
            <section className="section">
                <div className="container">
                    <Modal/>
                    <div className="has-text-centered">
                    <img src="/images/aoe2cm2.png" alt="logo"/><br/>&nbsp;
                    </div>
                    <div className="has-text-centered">
                    <h1 className="title is-hidden">Age of Empires II</h1>
                    <h2 className="subtitle is-hidden">Captains Mode</h2>
                    </div>
                    <div className="tabs is-centered">
                        <ul>
                            <li className="is-active">
                                <Link to='/'><Trans>menu.welcome</Trans></Link>
                            </li>
                            <li>
                                <Link to='/presets'><Trans>menu.hostOrJoin</Trans></Link>
                            </li>
                            <li>
                                <Link to='/spectate'><Trans>menu.spectate</Trans></Link>
                            </li>
                            <li>
                                <Link to='/practice'><Trans>menu.practice</Trans></Link>
                            </li>
                        </ul>
                    </div>
                    <Switch>
                        <Route exact path="/" component={Index}/>
                        <Route path="/presets" component={Presets}/>
                        <Route path="/preset/create" component={PresetEditor}/>
                        <Route path="/preset/:id" component={Preset}/>
                        <Route path="/spectate" component={Spectate}/>
                        <Route path="/practice" component={Practice}/>
                    </Switch>
                </div>
            </section>
        );
    }
}

export default withTranslation()(Menu);