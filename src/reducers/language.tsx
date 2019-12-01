import {ILanguageState} from "../types";
import {default as i18n} from "../i18n";
import {LanguageAction} from "../actions";
import {Actions} from "../constants";

export const initialLanguageState: ILanguageState = {
    language: i18n.language,
};

export const languageReducer = (state: ILanguageState = initialLanguageState, action: LanguageAction) => {
    if (action.type === Actions.SET_LANGUAGE) {
        console.log(Actions.SET_LANGUAGE, action.language);
        i18n.changeLanguage(action.language);
        return {
            ...state,
            language: action.language
        };
    } else {
        return state;
    }
};