import {draftReducer} from "./draft";
import {draftCountdownReducer} from "./draftCountdown";
import {languageReducer} from "./language";
import {draftOwnPropertiesReducer} from "./draftOwnProperties";
import {modalReducer} from "./modal";
import {presetEditorReducer} from "./presetEditor";
import {combineReducers} from 'redux';
import {iconStyleReducer} from "./iconStyle";
import {replayReducer} from "./replay";
import {colorSchemeReducer} from "./colorScheme";
import {adminReducer} from "./admin";

export default combineReducers({
    draft: draftReducer,
    countdown: draftCountdownReducer,
    replay: replayReducer,
    ownProperties: draftOwnPropertiesReducer,
    language: languageReducer,
    admin: adminReducer,
    iconStyle: iconStyleReducer,
    colorScheme: colorSchemeReducer,
    modal: modalReducer,
    presetEditor: presetEditorReducer
});
