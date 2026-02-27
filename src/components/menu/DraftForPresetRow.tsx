import * as React from "react";
import {IDraftForPreset} from "../../types";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import CustomName from "../draft/CustomName";
import {Link} from "react-router-dom";

interface IProps extends WithTranslation {
    draftForPreset: IDraftForPreset,
}


class DraftForPresetRow extends React.Component<IProps, object> {

    render() {
        const draftId = this.props.draftForPreset.draftId;
        return <tr>
            <td className="has-text-right">
                <span className={'player-host'}><CustomName name={this.props.draftForPreset.host}/></span>
            </td>
            <td className="has-text-centered">
                <span className="tag">vs</span>
            </td>
            <td>
                <span className={'player-guest'}><CustomName name={this.props.draftForPreset.guest}/></span>
            </td>
            <td className="has-text-right">
                <Link className="button is-small is-link is-light" to={'/spectate/' + draftId}>
                    <Trans i18nKey="spectate.watch">Watch</Trans>
                </Link>
            </td>
        </tr>;
    }
}

export default withTranslation()(DraftForPresetRow)
