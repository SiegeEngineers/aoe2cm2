import * as React from "react";
import {HelpAdminTurns, HelpBasics, HelpDraftModifiers, HelpHostAndGuestTurns} from "../PresetEditor/HelpText";
import {Trans} from "react-i18next";

class HowItWorks extends React.Component<object, object> {

    componentDidMount() {
        document.title = 'How it Works – AoE2 Captains Mode';
    }

    public render() {
        return (
            <div className="container is-desktop has-text-left">
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
