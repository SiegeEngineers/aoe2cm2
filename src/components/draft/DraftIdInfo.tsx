import * as React from "react";
import Preset from "../../models/Preset";
import "../../types/DraftEvent";
import {WithTranslation, withTranslation} from "react-i18next";
import CopyableInput from "./CopyableInput";
import {Util} from "../../util/Util";

interface IProps extends WithTranslation {
    preset: Preset;
    nextAction: number;
    hostReady: boolean;
    guestReady: boolean;
}

class DraftIdInfo extends React.Component<IProps, object> {

    public render() {
        if (this.isDraftOngoing()) {
            return null;
        }

        const i18nKey = this.hasDraftEnded() ? 'codeInstructionsAfter' : 'codeInstructionsBefore';

        return (
            <div id="draft-id-info" className="columns is-mobile">
                <div className="column has-text-centered">
                    <CopyableInput content={Util.getIdFromUrl()} before={i18nKey} length={10} classes={"is-small is-valinged-middle"}/>
                </div>
            </div>
        );
    }


    private isDraftOngoing() {
        return this.hasDraftStarted() && !this.hasDraftEnded();
    }

    private hasDraftEnded() {
        return this.props.nextAction >= this.props.preset.turns.length;
    }

    private hasDraftStarted() {
        return this.props.hostReady && this.props.guestReady;
    }

}

export default withTranslation()(DraftIdInfo);