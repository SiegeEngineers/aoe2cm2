import * as React from "react";
import {IRecentDraft} from "../../types";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import CustomName from "../draft/CustomName";
import {Link} from "react-router-dom";

interface IProps extends WithTranslation {
    isLastNew: boolean,
    recentDraft: IRecentDraft,
    callback: (draftId: string) => void,
}


class RecentDraftRow extends React.Component<IProps, object> {

    render() {
        const draftId = this.props.recentDraft.draftId;
        const i18nKey = this.props.recentDraft.ongoing ? 'spectate.watchLive' : 'spectate.watch';
        return <tr className={this.props.isLastNew ? 'last-new-draft' : undefined}>
            <td>
                <CustomName name={this.props.recentDraft.title} length={50}/>
            </td>
            <td className="has-text-right">
                <span className={'player-host'}><CustomName name={this.props.recentDraft.nameHost}/></span>
            </td>
            <td className="has-text-centered">
                <span className="tag">vs</span>
            </td>
            <td>
                <span className={'player-guest'}><CustomName name={this.props.recentDraft.nameGuest}/></span>
            </td>
            <td className="has-text-right">
                <Link className="button is-small is-link is-light" to={'/spectate/' + draftId}>
                    <Trans i18nKey={i18nKey}>Watch</Trans>
                </Link>
            </td>
        </tr>;
    }
}

export default withTranslation()(RecentDraftRow)