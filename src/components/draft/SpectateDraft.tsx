import * as React from "react";
import Player from "../../constants/Player";
import "../../types/DraftEvent";
import {WithTranslation, withTranslation} from "react-i18next";
import {Redirect} from "react-router";
import {Util} from "../../util/Util";

interface IProps extends WithTranslation {
    setOwnRole: (role: Player) => void;
}


class SpectateDraft extends React.Component<IProps, object> {

    componentDidMount(): void {
        this.props.setOwnRole(Player.SPEC);
    }

    public render() {
        const draftId = Util.getIdFromUrl();
        return (
            <Redirect to={`/draft/${draftId}`}/>
        );
    }
}

export default withTranslation()(SpectateDraft);