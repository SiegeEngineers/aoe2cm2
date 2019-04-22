import * as React from "react";
import {Redirect} from "react-router";
import {Trans, WithTranslation, withTranslation} from "react-i18next";

interface IState {
    draftId: string | null;
}

class Spectate extends React.Component<WithTranslation, IState> {
    constructor(props: WithTranslation) {
        super(props);
        this.state = {draftId: null};
    }

    public render() {
        if (this.state.draftId !== null) {
            const target = '/draft/' + this.state.draftId;
            return (<Redirect to={target}/>);
        }

        return (
            <div>
                <div id="join_game" className="home_card box">
                    <h2><Trans i18nKey='spectate.joinTitle'>Spectate existing draft</Trans></h2>
                    <div>
                        <div className="centered text-primary info-card">
                            <Trans i18nKey='spectate.code'>code:</Trans>
                        </div>
                        <div className="code">
                            <input id="input-code" type="text" name="code" className="inset-input"/>
                        </div>
                        <div className="pure-g join-actions text-primary">
                            <div className="pure-u-1-1">
                                <button className="shadowbutton text-primary" id="join-game-button"
                                        onClick={this.joinDraft}>
                                    <Trans i18nKey='spectate.join'>Join</Trans>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private joinDraft = () => {
        const draftIdInput = document.getElementById('input-code') as HTMLInputElement;
        const draftId: string | null = draftIdInput.value;
        this.setState({...this.state, draftId});
    };
}

export default withTranslation()(Spectate);