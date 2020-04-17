import {draftReducer} from "./draft";
import {draftCountdownReducer} from "./draftCountdown";
import {languageReducer} from "./language";
import {draftOwnPropertiesReducer} from "./draftOwnProperties";
import {modalReducer} from "./modal";
import {presetEditorReducer} from "./presetEditor";
import {combineReducers} from 'redux';
import {iconStyleReducer} from "./iconStyle";
import {replayReducer} from "./replay";

export default combineReducers({
    draft: draftReducer,
    countdown: draftCountdownReducer,
    replay: replayReducer,
    ownProperties: draftOwnPropertiesReducer,
    language: languageReducer,
    iconStyle: iconStyleReducer,
    modal: modalReducer,
    presetEditor: presetEditorReducer
});
