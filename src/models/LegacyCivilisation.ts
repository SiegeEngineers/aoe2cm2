import GameVersion from "../constants/GameVersion";

enum Name {
    BRITONS = "Britons",
    BYZANTINES = "Byzantines",
    CELTS = "Celts",
    CHINESE = "Chinese",
    FRANKS = "Franks",
    GOTHS = "Goths",
    JAPANESE = "Japanese",
    MONGOLS = "Mongols",
    PERSIANS = "Persians",
    SARACENS = "Saracens",
    TEUTONS = "Teutons",
    TURKS = "Turks",
    VIKINGS = "Vikings",

    AZTECS = "Aztecs",
    HUNS = "Huns",
    KOREANS = "Koreans",
    MAYANS = "Mayans",
    SPANISH = "Spanish",

    ITALIANS = "Italians",
    INCAS = "Incas",
    INDIANS = "Indians",
    MAGYARS = "Magyars",
    SLAVS = "Slavs",

    BERBERS = "Berbers",
    ETHIOPIANS = "Ethiopians",
    MALIANS = "Malians",
    PORTUGUESE = "Portuguese",

    BURMESE = "Burmese",
    KHMER = "Khmer",
    MALAY = "Malay",
    VIETNAMESE = "Vietnamese",

    BULGARIANS = "Bulgarians",
    CUMANS = "Cumans",
    LITHUANIANS = "Lithuanians",
    TATARS = "Tatars",

    BURGUNDIANS = "Burgundians",
    SICILIANS = "Sicilians",

    HIDDEN_PICK = "HIDDEN_PICK",
    HIDDEN_BAN = "HIDDEN_BAN",
    HIDDEN_SNIPE = "HIDDEN_SNIPE",
    HIDDEN_STEAL = "HIDDEN_STEAL",
    HIDDEN = "HIDDEN",
    RANDOM = "RANDOM"
}

class LegacyCivilisation {

    public readonly name: Name;
    public readonly gameVersion: GameVersion;
    public isRandomlyChosenCiv: boolean = false;

    private constructor(name: Name, gameVersion: GameVersion) {
        this.name = name;
        this.gameVersion = gameVersion;
    }

}

export default LegacyCivilisation;
export {Name};
