import * as React from "react";
import {HelpAdminTurns, HelpBasics, HelpDraftModifiers, HelpHostAndGuestTurns} from "../PresetEditor/HelpText";
import {Trans} from "react-i18next";

class HowItWorks extends React.Component<object, object> {
    public render() {
        return (
            <div className="container is-desktop">
                <div className="content box">
                    <h3><Trans i18nKey='menu.howItWorks'>How it works?</Trans></h3>

                    <HelpBasics/>

                    <HelpHostAndGuestTurns/>

                    <HelpDraftModifiers/>

                    <HelpAdminTurns/>
                </div>
            </div>
        );
    }
}

export default HowItWorks;