import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from "./Locales";

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources: resources,
        fallbackLng: "en-GB",
        interpolation: {
            escapeValue: false // react already protects from xss
        }
    });

export default i18n;