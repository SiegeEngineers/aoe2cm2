import GameVersion from "../constants/GameVersion";
import DraftOption from "./DraftOption";

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

    BOHEMIANS = "Bohemians",
    POLES = "Poles",

    BENGALIS = "Bengalis",
    DRAVIDIANS = "Dravidians",
    GURJARAS = "Gurjaras",
    HINDUSTANIS = "Hindustanis",

    ROMANS = "Romans",

    ARMENIANS = "Armenians",
    GEORGIANS = "Georgians",

    ACHAEMENIDS = "Achaemenids",
    ATHENIANS = "Athenians",
    SPARTANS = "Spartans",

    SHU="Shu",
    WU="Wu",
    WEI="Wei",
    JURCHENS="Jurchens",
    KHITANS="Khitans",
}

class Civilisation extends DraftOption {

    public static readonly BRITONS: Civilisation = new Civilisation(Name.BRITONS, GameVersion.AOK);
    public static readonly BYZANTINES: Civilisation = new Civilisation(Name.BYZANTINES, GameVersion.AOK);
    public static readonly CELTS: Civilisation = new Civilisation(Name.CELTS, GameVersion.AOK);
    public static readonly CHINESE: Civilisation = new Civilisation(Name.CHINESE, GameVersion.AOK);
    public static readonly FRANKS: Civilisation = new Civilisation(Name.FRANKS, GameVersion.AOK);
    public static readonly GOTHS: Civilisation = new Civilisation(Name.GOTHS, GameVersion.AOK);
    public static readonly JAPANESE: Civilisation = new Civilisation(Name.JAPANESE, GameVersion.AOK);
    public static readonly MONGOLS: Civilisation = new Civilisation(Name.MONGOLS, GameVersion.AOK);
    public static readonly PERSIANS: Civilisation = new Civilisation(Name.PERSIANS, GameVersion.AOK);
    public static readonly SARACENS: Civilisation = new Civilisation(Name.SARACENS, GameVersion.AOK);
    public static readonly TEUTONS: Civilisation = new Civilisation(Name.TEUTONS, GameVersion.AOK);
    public static readonly TURKS: Civilisation = new Civilisation(Name.TURKS, GameVersion.AOK);
    public static readonly VIKINGS: Civilisation = new Civilisation(Name.VIKINGS, GameVersion.AOK);

    public static readonly AZTECS: Civilisation = new Civilisation(Name.AZTECS, GameVersion.CONQUERORS);
    public static readonly HUNS: Civilisation = new Civilisation(Name.HUNS, GameVersion.CONQUERORS);
    public static readonly KOREANS: Civilisation = new Civilisation(Name.KOREANS, GameVersion.CONQUERORS);
    public static readonly MAYANS: Civilisation = new Civilisation(Name.MAYANS, GameVersion.CONQUERORS);
    public static readonly SPANISH: Civilisation = new Civilisation(Name.SPANISH, GameVersion.CONQUERORS);

    public static readonly ITALIANS: Civilisation = new Civilisation(Name.ITALIANS, GameVersion.FORGOTTEN);
    public static readonly INCAS: Civilisation = new Civilisation(Name.INCAS, GameVersion.FORGOTTEN);
    public static readonly INDIANS: Civilisation = new Civilisation(Name.INDIANS, GameVersion.FORGOTTEN);
    public static readonly MAGYARS: Civilisation = new Civilisation(Name.MAGYARS, GameVersion.FORGOTTEN);
    public static readonly SLAVS: Civilisation = new Civilisation(Name.SLAVS, GameVersion.FORGOTTEN);

    public static readonly BERBERS: Civilisation = new Civilisation(Name.BERBERS, GameVersion.AFRICAN_KINGDOMS);
    public static readonly ETHIOPIANS: Civilisation = new Civilisation(Name.ETHIOPIANS, GameVersion.AFRICAN_KINGDOMS);
    public static readonly MALIANS: Civilisation = new Civilisation(Name.MALIANS, GameVersion.AFRICAN_KINGDOMS);
    public static readonly PORTUGUESE: Civilisation = new Civilisation(Name.PORTUGUESE, GameVersion.AFRICAN_KINGDOMS);

    public static readonly BURMESE: Civilisation = new Civilisation(Name.BURMESE, GameVersion.RISE_OF_RAJAS);
    public static readonly KHMER: Civilisation = new Civilisation(Name.KHMER, GameVersion.RISE_OF_RAJAS);
    public static readonly MALAY: Civilisation = new Civilisation(Name.MALAY, GameVersion.RISE_OF_RAJAS);
    public static readonly VIETNAMESE: Civilisation = new Civilisation(Name.VIETNAMESE, GameVersion.RISE_OF_RAJAS);

    public static readonly BULGARIANS: Civilisation = new Civilisation(Name.BULGARIANS, GameVersion.DEFINITIVE_EDITION);
    public static readonly CUMANS: Civilisation = new Civilisation(Name.CUMANS, GameVersion.DEFINITIVE_EDITION);
    public static readonly LITHUANIANS: Civilisation = new Civilisation(Name.LITHUANIANS, GameVersion.DEFINITIVE_EDITION);
    public static readonly TATARS: Civilisation = new Civilisation(Name.TATARS, GameVersion.DEFINITIVE_EDITION);

    public static readonly BURGUNDIANS: Civilisation = new Civilisation(Name.BURGUNDIANS, GameVersion.LORDS_OF_THE_WEST);
    public static readonly SICILIANS: Civilisation = new Civilisation(Name.SICILIANS, GameVersion.LORDS_OF_THE_WEST);

    public static readonly BOHEMIANS: Civilisation = new Civilisation(Name.BOHEMIANS, GameVersion.DAWN_OF_THE_DUKES);
    public static readonly POLES: Civilisation = new Civilisation(Name.POLES, GameVersion.DAWN_OF_THE_DUKES);

    public static readonly BENGALIS: Civilisation = new Civilisation(Name.BENGALIS, GameVersion.DYNASTIES_OF_INDIA);
    public static readonly DRAVIDIANS: Civilisation = new Civilisation(Name.DRAVIDIANS, GameVersion.DYNASTIES_OF_INDIA);
    public static readonly GURJARAS: Civilisation = new Civilisation(Name.GURJARAS, GameVersion.DYNASTIES_OF_INDIA);
    public static readonly HINDUSTANIS: Civilisation = new Civilisation(Name.HINDUSTANIS, GameVersion.DYNASTIES_OF_INDIA);

    public static readonly ROMANS: Civilisation = new Civilisation(Name.ROMANS, GameVersion.RETURN_OF_ROME);

    public static readonly ARMENIANS: Civilisation = new Civilisation(Name.ARMENIANS, GameVersion.THE_MOUNTAIN_ROYALS);
    public static readonly GEORGIANS: Civilisation = new Civilisation(Name.GEORGIANS, GameVersion.THE_MOUNTAIN_ROYALS);

    public static readonly ACHAEMENIDS: Civilisation = new Civilisation(Name.ACHAEMENIDS, GameVersion.CHRONICLES_BATTLE_FOR_GREECE);
    public static readonly ATHENIANS: Civilisation = new Civilisation(Name.ATHENIANS, GameVersion.CHRONICLES_BATTLE_FOR_GREECE);
    public static readonly SPARTANS: Civilisation = new Civilisation(Name.SPARTANS, GameVersion.CHRONICLES_BATTLE_FOR_GREECE);

    public static readonly SHU: Civilisation = new Civilisation(Name.SHU, GameVersion.THE_THREE_KINGDOMS);
    public static readonly WU: Civilisation = new Civilisation(Name.WU, GameVersion.THE_THREE_KINGDOMS);
    public static readonly WEI: Civilisation = new Civilisation(Name.WEI, GameVersion.THE_THREE_KINGDOMS);
    public static readonly JURCHENS: Civilisation = new Civilisation(Name.JURCHENS, GameVersion.THE_THREE_KINGDOMS);
    public static readonly KHITANS: Civilisation = new Civilisation(Name.KHITANS, GameVersion.THE_THREE_KINGDOMS);


    // DO NOT CHANGE THE ORDER OF ELEMENTS IN THIS ARRAY!!!
    // ONLY APPEND NEW CIVILISATIONS AT THE END!!!
    public static readonly ALL = [
        Civilisation.AZTECS,
        Civilisation.BERBERS,
        Civilisation.BRITONS,
        Civilisation.BURMESE,
        Civilisation.BYZANTINES,
        Civilisation.CELTS,
        Civilisation.CHINESE,
        Civilisation.ETHIOPIANS,
        Civilisation.FRANKS,
        Civilisation.GOTHS,
        Civilisation.HUNS,
        Civilisation.INCAS,
        Civilisation.INDIANS,
        Civilisation.ITALIANS,
        Civilisation.JAPANESE,
        Civilisation.KHMER,
        Civilisation.KOREANS,
        Civilisation.MAGYARS,
        Civilisation.MALAY,
        Civilisation.MALIANS,
        Civilisation.MAYANS,
        Civilisation.MONGOLS,
        Civilisation.PERSIANS,
        Civilisation.PORTUGUESE,
        Civilisation.SARACENS,
        Civilisation.SLAVS,
        Civilisation.SPANISH,
        Civilisation.TEUTONS,
        Civilisation.TURKS,
        Civilisation.VIETNAMESE,
        Civilisation.VIKINGS,
        Civilisation.BULGARIANS,
        Civilisation.CUMANS,
        Civilisation.LITHUANIANS,
        Civilisation.TATARS,
        Civilisation.BURGUNDIANS,
        Civilisation.SICILIANS,
        Civilisation.BOHEMIANS,
        Civilisation.POLES,
        Civilisation.BENGALIS,
        Civilisation.DRAVIDIANS,
        Civilisation.GURJARAS,
        Civilisation.HINDUSTANIS,
        Civilisation.ROMANS,
        Civilisation.ARMENIANS,
        Civilisation.GEORGIANS,
        Civilisation.ACHAEMENIDS,
        Civilisation.ATHENIANS,
        Civilisation.SPARTANS,
        Civilisation.SHU,
        Civilisation.WU,
        Civilisation.WEI,
        Civilisation.JURCHENS,
        Civilisation.KHITANS,
    ];

    public static readonly ALL_ACTIVE = Civilisation.ALL.filter(value => value.name !== Name.INDIANS
        && value.gameVersion != GameVersion.CHRONICLES_BATTLE_FOR_GREECE);

    public readonly gameVersion: GameVersion;

    private constructor(name: Name, gameVersion: GameVersion) {
        super(name);
        this.gameVersion = gameVersion;
    }

}

export default Civilisation;
export {Name};
