import en_GB from "./languages/en_GB.json";
import es_ES from "./languages/es_ES.json";
import de_DE from "./languages/de_DE.json";
import fr_FR from "./languages/fr_FR.json";
import pt_BR from "./languages/pt_BR.json";
import zh_CN from "./languages/zh_CN.json";
import zh_TW from "./languages/zh_TW.json";

const availableLocales = {
    "en-GB": {
        translation: en_GB,
        displayName: "English",
        cta: "Switch language to English (UK)"
    },
    "es-ES": {
        translation: es_ES,
        displayName: "Español",
        cta: "Cambiar el idioma a español"
    },
    "fr-FR": {
        translation: fr_FR,
        displayName: "Français",
        cta: "Changer la langue à français"
    },
    "de-DE": {
        translation: de_DE,
        displayName: "Deutsch",
        cta: "Sprache zu Deutsch ändern"
    },
    "pt-BR": {
        translation: pt_BR,
        displayName: "Português",
        cta: "Mudar o idioma para português"
    },
    "zh-CN": {
        translation: zh_CN,
        displayName: "简体中文",
        cta: "将语言设置为中文"
    },
    "zh-TW": {
        translation: zh_TW,
        displayName: "繁體中文",
        cta: "將語言設置為繁體中文"
    }
}

export default availableLocales;
