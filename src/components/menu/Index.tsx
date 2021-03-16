import * as React from "react";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import {IAlert} from "../../types";
import Alert from "./Alert";
import {Link} from "react-router-dom";

interface IState {
    alerts: IAlert[];
}

class Index extends React.Component<WithTranslation, IState> {

    state = {alerts: []};

    componentDidMount(): void {
        fetch('/api/alerts', {cache: 'no-cache'})
            .then((result) => result.json())
            .then((json) => this.setState({alerts: json}));
        document.title = 'AoE2 Captains Mode';
    }

    public render() {
        const alerts = this.state.alerts.map((alert, index) => <Alert key={"alert-" + index} config={alert}/>);
        return (
            <div>
                {alerts}
                <div className="content box" id="instructions">
                    <h3><Trans>instructions.home.title</Trans></h3>
                    <p>
                        <Trans i18nKey='instructions.home.1'>Captains mode is a turn-based civilisation picker.</Trans>
                    </p>
                    <p>
                        <Trans i18nKey='instructions.home.2'>The tournament Admin creates a <b>Preset</b> which can be used to create <b>Drafts</b>. During a draft, the two captains pick, ban, steal, or snipe civilisations in a predefined order as per the rules in the chosen Preset.</Trans>
                    </p>
                    <p>
                        <Trans i18nKey='instructions.home.3'>For each turn captains have <b>30 seconds</b>. In case of a timeout, a random civilisation is selected for the captain.</Trans>
                    </p>
                    <h4><Trans i18nKey='instructions.home.getStarted.title'>Get started</Trans></h4>
                    <ul>
                        <li><Trans i18nKey='instructions.home.getStarted.1'>You can create your own Preset or use one of many popular presets <Link to={"/presets"}>here</Link>.</Trans></li>
                        <li><Trans i18nKey='instructions.home.getStarted.2'>You can spectate currently live and past drafts <Link to={"/spectate"}>here</Link>.</Trans></li>
                    </ul>
                    <Trans i18nKey='instructions.home.getStarted.3'>If you would like to learn more about how to create presets, you can read the instructions <Link to={"/help"}>here</Link>.</Trans>
                </div>
                <div className="content box">
                    <h4><Trans i18nKey='instructions.home.reportIssue.title'>Found an Issue?</Trans></h4>
                    <p className={"is-small"}>
                        <Trans i18nKey='instructions.home.reportIssue.github'>Have you found or experienced a problem on this site? Check the <a href={"https://github.com/SiegeEngineers/aoe2cm2/issues"}>list of known issues on GitHub</a>.</Trans>&nbsp;
                        <Trans i18nKey='instructions.home.reportIssue.discord'>If your problem is not listed there, report it on GitHub or describe it to <code>hszemi#2325</code> on Discord. Make sure to include a link to your draft if you have one!</Trans>
                    </p>
                </div>
            </div>
        );
    }
}

export default withTranslation()(Index);