import * as React from "react";
import {Redirect} from "react-router";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import {IRecentDraft} from "../../types";
import {default as RecentDraftRow} from "./RecentDraftRow";

interface IState {
    draftId: string | null;
    recentDrafts: IRecentDraft[];
}

class Spectate extends React.Component<WithTranslation, IState> {
    constructor(props: WithTranslation) {
        super(props);
        this.state = {draftId: null, recentDrafts: []};
    }

    componentDidMount(): void {
        fetch('/api/recentdrafts')
            .then((response) => response.json())
            .then((json) => this.setState({recentDrafts: json}));
    }

    public render() {
        if (this.state.draftId !== null) {
            const target = '/spectate/' + this.state.draftId;
            return (<Redirect to={target}/>);
        }

        const recentDrafts = this.state.recentDrafts.map((value) => <RecentDraftRow recentDraft={value}
                                                                                    callback={this.recentDraftCallback}/>)

        return (
            <div className="container">
                <div id="join_game" className="box content">
                    <h2><Trans i18nKey='spectate.spectateTitle'>Spectate existing draft</Trans></h2>
                    <div className="field has-addons">
                        <div className="control">
                            <label className="button is-static"><Trans
                                i18nKey='spectate.code'>code:</Trans></label>
                        </div>
                        <div className="control ">
                            <input id="input-code" type="text" name="code" className="input"/>
                        </div>
                        <div className="control">
                            <button className="button is-link" id="join-game-button" onClick={this.joinDraft}>
                                <Trans i18nKey='spectate.spectate'>Spectate</Trans>
                            </button>
                        </div>
                    </div>
                </div>
                <div id="recent_drafts" className="box content">
                    <h2><Trans i18nKey='spectate.recentDraftsTitle'>Recent Drafts</Trans></h2>
                    <table className="pure-table pure-table-horizontal recent-drafts">
                        <tbody>
                        {recentDrafts}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    private joinDraft = () => {
        const draftIdInput = document.getElementById('input-code') as HTMLInputElement;
        const draftId: string | null = draftIdInput.value;
        this.setState({...this.state, draftId});
    };

    private recentDraftCallback = (draftId: string) => {
        this.setState({...this.state, draftId});
    }
}

export default withTranslation()(Spectate);