import * as React from "react";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import {IAlert} from "../../types";
import Alert from "./Alert";

interface IState {
    alerts: IAlert[];
}

class Index extends React.Component<WithTranslation, IState> {

    state = {alerts: []};

    componentDidMount(): void {
        fetch('/api/alerts', {cache: 'no-cache'})
            .then((result) => result.json())
            .then((json) => this.setState({alerts: json}));
    }

    public render() {
        const alerts = this.state.alerts.map((alert, index) => <Alert key={"alert-" + index} config={alert}/>);
        return (
            <div>
                {alerts}
                <div className="content box" id="instructions">
                    <h3><Trans>instructions.home.title</Trans></h3>
                    <p>
                        <Trans i18nKey='instructions.home.1'>Captains mode is a turn-based civilization picker.
                            Each captain can pick and ban civilizations in a predefined order. Bans
                            prevent the opponent's captain from picking the civilizations.</Trans>
                    </p>
                    <p>
                        <Trans i18nKey='instructions.home.2'>For each turn captains have <b>30 seconds</b>. In
                            case of timeout a random civilization is picked for the captain or no civilization
                            gets banned.</Trans>
                    </p>
                    <p>
                        <Trans i18nKey='instructions.home.3'>There are also extension available for tournaments:</Trans>
                    </p>
                    <ul>
                        <li><Trans i18nKey='instructions.home.4'><b>Hidden</b> option (black corners) hides
                            the civilization choices until they are explicitly showed (visible in the
                            timeline at the top).</Trans></li>
                        <li><Trans i18nKey='instructions.home.5'><b>Global</b> pick or bans disables the civilization
                            for later turns. For other specific settings, please refer to the preset
                            descriptions.</Trans></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default withTranslation()(Index);