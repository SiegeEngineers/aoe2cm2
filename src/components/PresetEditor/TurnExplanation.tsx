import * as React from "react";
import {Trans, withTranslation} from "react-i18next";
import {HelpAdminTurns, HelpBasics, HelpHostAndGuestTurns, HelpPresetEditor, HelpPresetModifiers} from "./HelpText";

const TurnExplanation = () =>
    <React.Fragment>
        <h3><Trans i18nKey={'presetEditor.helpAndInstructions'}>Help and Instructions</Trans></h3>

        <HelpBasics/>

        <HelpPresetEditor/>

        <HelpHostAndGuestTurns/>

        <HelpPresetModifiers/>

        <HelpAdminTurns/>

    </React.Fragment>
;

export default withTranslation()(TurnExplanation);
