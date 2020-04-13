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
            <td className="recent-title">{this.props.recentDraft.title}</td>
            <td className="recent-users">
                <span className={'player-host'}>{this.props.recentDraft.nameHost}</span>
                &emsp;vs&emsp;
                <span className={'player-guest'}>{this.props.recentDraft.nameGuest}</span>
            </td>
            <td className="recent-action">
                <button className="text-primary shadowbutton" onClick={() => this.props.callback(draftId)}><Trans
                    i18nKey={i18nKey}>Watch</Trans>
                </button>
            </td>
        </tr>;
    }
}

export default withTranslation()(RecentDraftRow)