import GameVersion from "./GameVersion";

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
    VIETNAMESE = "Vietnamese"
}

class Civilisation {

    public static readonly BRITONS:Civilisation = new Civilisation(Name.BRITONS, GameVersion.AOK);
    public static readonly BYZANTINES:Civilisation = new Civilisation(Name.BYZANTINES, GameVersion.AOK);
    public static readonly CELTS:Civilisation = new Civilisation(Name.CELTS, GameVersion.AOK);
    public static readonly CHINESE:Civilisation = new Civilisation(Name.CHINESE, GameVersion.AOK);
    public static readonly FRANKS:Civilisation = new Civilisation(Name.FRANKS, GameVersion.AOK);
    public static readonly GOTHS:Civilisation = new Civilisation(Name.GOTHS, GameVersion.AOK);
    public static readonly JAPANESE:Civilisation = new Civilisation(Name.JAPANESE, GameVersion.AOK);
    public static readonly MONGOLS:Civilisation = new Civilisation(Name.MONGOLS, GameVersion.AOK);
    public static readonly PERSIANS:Civilisation = new Civilisation(Name.PERSIANS, GameVersion.AOK);
    public static readonly SARACENS:Civilisation = new Civilisation(Name.SARACENS, GameVersion.AOK);
    public static readonly TEUTONS:Civilisation = new Civilisation(Name.TEUTONS, GameVersion.AOK);
    public static readonly TURKS:Civilisation = new Civilisation(Name.TURKS, GameVersion.AOK);
    public static readonly VIKINGS:Civilisation = new Civilisation(Name.VIKINGS, GameVersion.AOK);

    public static readonly AZTECS:Civilisation = new Civilisation(Name.AZTECS, GameVersion.CONQUERORS);
    public static readonly HUNS:Civilisation = new Civilisation(Name.HUNS, GameVersion.CONQUERORS);
    public static readonly KOREANS:Civilisation = new Civilisation(Name.KOREANS, GameVersion.CONQUERORS);
    public static readonly MAYANS:Civilisation = new Civilisation(Name.MAYANS, GameVersion.CONQUERORS);
    public static readonly SPANISH:Civilisation = new Civilisation(Name.SPANISH, GameVersion.CONQUERORS);

    public static readonly ITALIANS:Civilisation = new Civilisation(Name.ITALIANS, GameVersion.FORGOTTEN);
    public static readonly INCAS:Civilisation = new Civilisation(Name.INCAS, GameVersion.FORGOTTEN);
    public static readonly INDIANS:Civilisation = new Civilisation(Name.INDIANS, GameVersion.FORGOTTEN);
    public static readonly MAGYARS:Civilisation = new Civilisation(Name.MAGYARS, GameVersion.FORGOTTEN);
    public static readonly SLAVS:Civilisation = new Civilisation(Name.SLAVS, GameVersion.FORGOTTEN);

    public static readonly BERBERS:Civilisation = new Civilisation(Name.BERBERS, GameVersion.AFRICAN_KINGDOMS);
    public static readonly ETHIOPIANS:Civilisation = new Civilisation(Name.ETHIOPIANS, GameVersion.AFRICAN_KINGDOMS);
    public static readonly MALIANS:Civilisation = new Civilisation(Name.MALIANS, GameVersion.AFRICAN_KINGDOMS);
    public static readonly PORTUGUESE:Civilisation = new Civilisation(Name.PORTUGUESE, GameVersion.AFRICAN_KINGDOMS);

    public static readonly BURMESE:Civilisation = new Civilisation(Name.BURMESE, GameVersion.RISE_OF_RAJAS);
    public static readonly KHMER:Civilisation = new Civilisation(Name.KHMER, GameVersion.RISE_OF_RAJAS);
    public static readonly MALAY:Civilisation = new Civilisation(Name.MALAY, GameVersion.RISE_OF_RAJAS);
    public static readonly VIETNAMESE:Civilisation = new Civilisation(Name.VIETNAMESE, GameVersion.RISE_OF_RAJAS);

    public static readonly ALL = [
        Civilisation.BRITONS,
        Civilisation.BYZANTINES,
        Civilisation.CELTS,
        Civilisation.CHINESE,
        Civilisation.FRANKS,
        Civilisation.GOTHS,
        Civilisation.JAPANESE,
        Civilisation.MONGOLS,
        Civilisation.PERSIANS,
        Civilisation.SARACENS,
        Civilisation.TEUTONS,
        Civilisation.TURKS,
        Civilisation.VIKINGS,
        Civilisation.AZTECS,
        Civilisation.HUNS,
        Civilisation.KOREANS,
        Civilisation.MAYANS,
        Civilisation.SPANISH,
        Civilisation.ITALIANS,
        Civilisation.INCAS,
        Civilisation.INDIANS,
        Civilisation.MAGYARS,
        Civilisation.SLAVS,
        Civilisation.BERBERS,
        Civilisation.ETHIOPIANS,
        Civilisation.MALIANS,
        Civilisation.PORTUGUESE,
        Civilisation.BURMESE,
        Civilisation.KHMER,
        Civilisation.MALAY,
        Civilisation.VIETNAMESE
    ];

    public readonly name:Name;
    public readonly gameVersion:GameVersion;

    private constructor(name:Name, gameVersion:GameVersion){
        this.name = name;
        this.gameVersion = gameVersion;
    }
}

export default Civilisation;