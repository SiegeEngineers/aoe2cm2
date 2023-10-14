import * as React from "react";
import {Redirect} from "react-router";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import {IRecentDraft, IRecentDraftsState} from "../../types";
import {default as RecentDraftRow} from "./RecentDraftRow";
import PauseIcon from "mdi-react/PauseIcon";
import StopIcon from "mdi-react/StopIcon";
import CheckIcon from "mdi-react/CheckIcon";

interface IProps extends WithTranslation, IRecentDraftsState {
    specateDrafts: () => void;
    resetRecentDraftCursor: () => void;
}

interface IState {
    draftId: string | null;
    autoRefresh: boolean;
    autoRefreshHover: boolean;
    paused: boolean;
    pausedNewDraftIndex: number;
    pausedDrafts: IRecentDraft[] | null;
}

class Spectate extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {draftId: null, autoRefresh: true, autoRefreshHover: false, paused: false, pausedNewDraftIndex: -1, pausedDrafts: []};
    }

    componentDidMount(): void {
        document.title = 'Spectate – AoE Captains Mode';
        if (!this.props.drafts.length) {
            this.props.specateDrafts();
        }
    }

    handleUnpause() {
        this.setState({autoRefresh: true, paused: false, pausedNewDraftIndex: -1, pausedDrafts: null});
        if (this.props.newDraftIndex !== -1) {
            this.props.resetRecentDraftCursor();
        }
    }

    private mouseEnterList = () => {
        if (this.state.autoRefresh && !this.state.paused) {
            this.setState({paused: true, pausedNewDraftIndex: this.props.newDraftIndex, pausedDrafts: this.props.drafts});
        }
    }

    private mouseLeaveList = () => {
        if (this.state.autoRefresh && this.state.paused) {
            this.handleUnpause();
        }
    }

    private toggleAutoRefresh = () => {
        if (this.state.autoRefresh) {
            this.setState({autoRefresh: false, pausedNewDraftIndex: this.props.newDraftIndex, pausedDrafts: this.props.drafts});
        } else {
            this.handleUnpause();
        }
    };

    private mouseEnterAutoRefresh = () => {
        this.setState({autoRefreshHover: true});
    }

    private mouseLeaveAutoRefresh = () => {
        this.setState({autoRefreshHover: false});
    }

    public render() {
        if (this.state.draftId !== null) {
            const target = '/spectate/' + this.state.draftId;
            return (<Redirect push to={target}/>);
        }

        const allDrafts = this.state.autoRefresh && !this.state.paused ? this.props.drafts : this.state.pausedDrafts || [];
        const newDraftIndex = this.state.autoRefresh && !this.state.paused ? this.props.newDraftIndex : this.state.pausedNewDraftIndex;

        const recentDrafts = allDrafts.map((value, index) => <RecentDraftRow recentDraft={value}
                                                                            key={value.draftId}
                                                                            isLastNew={index === newDraftIndex}
                                                                            callback={this.recentDraftCallback}/>);

        const AutoRefreshIcon = 
            this.state.autoRefreshHover ? (this.state.autoRefresh ? StopIcon : CheckIcon) :
            !this.state.autoRefresh ? StopIcon :
            this.state.paused ? PauseIcon :
            CheckIcon;

        return (
            <div className="container">
                <div id="join_game" className="box content">
                    <h3><Trans i18nKey='spectate.spectateTitle'>Spectate existing draft</Trans></h3>
                    <div className="field is-grouped">
                        <div className="control">
                            <div className="field has-addons">
                                <div className="control">
                                    <label className="button is-static"><Trans
                                        i18nKey='spectate.code'>Code:</Trans></label>
                                </div>
                                <div className="control">
                                    <input id="input-code" type="text" name="code"
                                           className="input"
                                           placeholder={this.props.t('spectate.enterCode')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="control">
                            <button className="button is-link" id="join-game-button" onClick={this.joinDraft}>
                                <Trans i18nKey='spectate.spectate'>Spectate</Trans>
                            </button>
                        </div>
                    </div>
                </div>
                <div id="recent_drafts" className="box content">
                    <div className="recent-drafts-header">
                        <h3><Trans i18nKey='spectate.recentDraftsTitle'>Recent Drafts</Trans></h3>
                        <div>
                            <div className="button is-small is-inverted" onClick={this.toggleAutoRefresh} onMouseEnter={this.mouseEnterAutoRefresh} onMouseLeave={this.mouseLeaveAutoRefresh}>
                                <span><Trans i18nKey="spectate.autoUpdate">Auto Update</Trans></span>
                                <span className="icon">
                                    <AutoRefreshIcon size={20} />
                                </span>
                            </div>
                        </div>
                    </div>
                    <table className="table is-narrow is-hoverable is-fullwidth" onMouseEnter={this.mouseEnterList} onMouseLeave={this.mouseLeaveList}>
                        <thead>
                        <tr className="table-header">
                            <th className="has-text-left"><Trans i18nKey="spectate.draftName">Draft Name</Trans></th>
                            <th className="has-text-right"><Trans i18nKey="spectate.host">Host</Trans></th>
                            <th className="has-text-centered"/>
                            <th className="has-text-left"><Trans i18nKey="spectate.guest">Guest</Trans></th>
                            <th className="has-text-right"/>
                        </tr>
                        </thead>
                        <tbody>
                            {                  
                                !this.props.drafts.length ?
                                    <tr><td><span>Loading…</span></td></tr>
                                :
                                    recentDrafts
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    private joinDraft = () => {
        const draftIdInput = document.getElementById('input-code') as HTMLInputElement;
        const draftId: string = draftIdInput.value.trim();
        if (!draftId) {
            draftIdInput.classList.add('is-danger');
        } else {
            this.setState({...this.state, draftId});
        }
    };

    private recentDraftCallback = (draftId: string) => {
        this.setState({...this.state, draftId});
    }
}

export default withTranslation()(Spectate);