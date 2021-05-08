import en_GB from "./languages/en_GB.json";
import es_ES from "./languages/es_ES.json";
import de_DE from "./languages/de_DE.json";
import ja_JP from "./languages/ja_JP.json";
import pt_BR from "./languages/pt_BR.json";
import zh_CN from "./languages/zh_CN.json";

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
    "de-DE": {
        translation: de_DE,
        displayName: "Deutsch",
        cta: "Sprache zu Deutsch ändern"
    },
    "ja-JP": {
        translation: ja_JP,
        displayName: "日本語",
        cta: "言語を日本語に切替"
    },
    "pt-BR": {
        translation: pt_BR,
        displayName: "Português",
        cta: "Mudar o idioma para português"
    },
    "zh-CN": {
        translation: zh_CN,
        displayName: "中文",
        cta: "将语言设置为中文"
    }
}

export default availableLocales;
