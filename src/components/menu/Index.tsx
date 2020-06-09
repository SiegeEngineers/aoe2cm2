import * as React from "react";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import {IAlert} from "../../types";
import {Alert} from "./Alert";

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
        const alerts = this.state.alerts.map((alert) => <Alert config={alert}/>);
        return (
            <div className="container">
                <div className="content">
                    {alerts}
                    <div className="box" id="instructions">
                        <h2><Trans>instructions.title</Trans></h2>
                        <div className="double-outer-border">
                            <div className="double-inner-border">
                                <p className="text-primary">
                                    <Trans i18nKey='instructions.1'>Captains mode is a turn-based civilization picker.
                                        Each
                                        captain can <span
                                            className="green-glow">pick</span> and <span
                                            className="red-glow">ban</span> civilizations in a predefined order. Bans
                                        prevent
                                        the opponent's captain from picking the civilizations.</Trans>
                                </p>
                                <p className="text-primary">
                                    <Trans i18nKey='instructions.2'>For each turn captains have <b>30 seconds</b>. In
                                        case
                                        of timeout a random civilization is picked for the captain or no civilization
                                        gets
                                        banned.</Trans>
                                </p>
                                <p className="text-primary">
                                    <Trans i18nKey='instructions.3'>There are also extension available for
                                        tournaments. <b>Hidden</b> option (black corners) hides the civilization choices
                                        until they are explicitly showed (visible in the timeline at the top).</Trans>
                                    <br/>
                                    <Trans i18nKey='instructions.4'><b>Global</b> pick or bans disables the civilization
                                        for
                                        later turns. For other specific settings, please refer to the preset
                                        descriptions.</Trans>
                                </p>
                                <p className="text-primary">
                                    <Trans i18nKey='instructions.5'><b>Practice</b> mode is for testing purposes, where
                                        both
                                        sides are controlled by a single player.</Trans>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(Index);