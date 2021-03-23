import * as React from "react";
import {withRouter, NavLink, Route, Switch} from "react-router-dom";
import {RouteComponentProps} from "react-router";
import Practice from "./Practice";
import Presets from "./Presets";
import Preset from "./Preset";
import Index from "./Index";
import Spectate from "./Spectate";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import Modal from "../../containers/Modal";
import PresetEditor from "../PresetEditor/PresetEditor";
import NotFound404 from "../404";
import HowItWorks from "./HowItWorks";
import API from "./API";


class Menu extends React.Component<WithTranslation, object> {
    public render() {
        return (
            <section className="section">
                <div className="container is-desktop">
                    <Modal/>
                    <div className="has-text-centered pb-5">
                        <img src="/images/aoe2cm2.png" alt="AoE II - Captains Mode Logo"/>
                    </div>
                    <div className="has-text-centered">
                        <h1 className="title is-hidden">Age of Empires II</h1>
                        <h2 className="subtitle is-hidden">Captains Mode</h2>
                    </div>
                    <div className="tabs is-centered">
                        <ul>
                            <TabLink to='/' activeClassName="is-active"><Trans>menu.welcome</Trans></TabLink>
                            <TabLink to='/presets' activeClassName="is-active"><Trans>menu.hostOrJoin</Trans></TabLink>
                            <TabLink to='/spectate' activeClassName="is-active"><Trans>menu.spectate</Trans></TabLink>
                            {/*<TabLink to='/practice' activeClassName="is-active"><Trans>menu.practice</Trans></TabLink>*/}
                            <TabLink to='/help' activeClassName="is-active"><Trans>menu.howItWorks</Trans></TabLink>
                        </ul>
                    </div>
                    <Switch>
                        <Route exact path="/" component={Index}/>
                        <Route path="/presets" component={Presets}/>
                        <Route path="/preset/create" component={PresetEditor}/>
                        <Route path="/preset/:id" component={Preset}/>
                        <Route path="/spectate" component={Spectate}/>
                        <Route path="/practice" component={Practice}/>
                        <Route path="/help" component={HowItWorks}/>
                        <Route path="/api" component={API}/>
                        <Route component={NotFound404}/>
                    </Switch>
                </div>
            </section>
        );
    }
}


interface IProps extends RouteComponentProps<any> {
    to: string;
    activeClassName: string;
}

class TabLinkBase extends React.Component<IProps> {
    render() {
        const isActive = this.props.location.pathname === this.props.to;

        return (
            <li className={(isActive && this.props.activeClassName) || ''}>
                <NavLink to={this.props.to} strict={true}>
                    {this.props.children}
                </NavLink>
            </li>
        );
    }
}

const TabLink = withRouter(TabLinkBase);

export default withTranslation()(Menu);
