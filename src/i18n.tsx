import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import en_GB from "./languages/en_GB.json";
import es_ES from "./languages/es_ES.json";
import de_DE from "./languages/de_DE.json";
import zh_CN from "./languages/zh_CN.json";

const resources = {
    "en-GB": {translation: en_GB},
    "es-ES": {translation: es_ES},
    "de-DE": {translation: de_DE},
    "zh-CN": {translation: zh_CN}
};

console.log(resources);

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        fallbackLng: "en-GB",
        interpolation: {
            escapeValue: false // react already protects from xss
        }
    });

export default i18n;