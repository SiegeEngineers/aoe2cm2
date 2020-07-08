import * as React from "react";
import {HelpAdminTurns, HelpBasics, HelpDraftModifiers, HelpHostAndGuestTurns} from "../PresetEditor/HelpText";

class HowItWorks extends React.Component<object, object> {
    public render() {
        return (
            <div className="container is-desktop">
                <div className="content box">
                    <h3>How it works?</h3>

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