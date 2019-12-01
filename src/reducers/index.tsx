import {draftReducer} from "./draft";
import {draftCountdownReducer} from "./draftCountdown";
import {languageReducer} from "./language";
import {draftOwnPropertiesReducer} from "./draftOwnProperties";
import {modalReducer} from "./modal";
import {presetEditorReducer} from "./presetEditor";
import {combineReducers} from 'redux';

export default combineReducers({
    draft: draftReducer,
    countdown: draftCountdownReducer,
    ownProperties: draftOwnPropertiesReducer,
    language: languageReducer,
    modal: modalReducer,
    presetEditor: presetEditorReducer
});
