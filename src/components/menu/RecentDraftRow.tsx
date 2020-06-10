import * as React from "react";
import {IRecentDraft} from "../../types";
import {Trans, WithTranslation, withTranslation} from "react-i18next";

interface IProps extends WithTranslation {
    recentDraft: IRecentDraft,
    callback: (draftId: string) => void,
}


class RecentDraftRow extends React.Component<IProps, object> {

    render() {
        const draftId = this.props.recentDraft.draftId;
        const i18nKey = this.props.recentDraft.ongoing ? 'spectate.watchLive' : 'spectate.watch';
        return <tr>
            <td className="">{this.props.recentDraft.title}</td>
            <td className="has-text-right">
                <span className={'player-host'}>{this.props.recentDraft.nameHost}</span>
            </td>
            <td className="has-text-centered"><span className="tag">vs</span></td>
            <td className="has-text-left">
                <span className={'player-guest'}>{this.props.recentDraft.nameGuest}</span>
            </td>
            <td className="has-text-right">
                <button className="button is-small is-link is-light" onClick={() => this.props.callback(draftId)}><Trans
                    i18nKey={i18nKey}>Watch</Trans>
                </button>
            </td>
        </tr>;
    }
}

export default withTranslation()(RecentDraftRow)