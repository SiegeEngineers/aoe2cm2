import {draftReducer} from "./draft";
import {draftCountdownReducer} from "./draftCountdown";
import {languageReducer} from "./language";
import {draftOwnPropertiesReducer} from "./draftOwnProperties";
import {modalReducer} from "./modal";
import {presetEditorReducer} from "./presetEditor";
import {combineReducers} from 'redux';
import {iconStyleReducer} from "./iconStyle";

export default combineReducers({
    draft: draftReducer,
    countdown: draftCountdownReducer,
    ownProperties: draftOwnPropertiesReducer,
    language: languageReducer,
    iconStyle: iconStyleReducer,
    modal: modalReducer,
    presetEditor: presetEditorReducer
});
