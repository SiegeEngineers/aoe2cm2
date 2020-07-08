import * as React from "react";
import {withTranslation} from "react-i18next";
import {HelpAdminTurns, HelpBasics, HelpHostAndGuestTurns, HelpPresetEditor, HelpPresetModifiers} from "./HelpText";

const TurnExplanation = () =>
    <React.Fragment>
        <h3>Help and Instructions</h3>

        <HelpBasics/>

        <HelpPresetEditor/>

        <HelpHostAndGuestTurns/>

        <HelpPresetModifiers/>

        <HelpAdminTurns/>

    </React.Fragment>
;

export default withTranslation()(TurnExplanation);
