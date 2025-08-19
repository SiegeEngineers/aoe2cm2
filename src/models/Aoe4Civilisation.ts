import DraftOption from "./DraftOption";

enum Name {
    RUS = "aoe4.Rus",
    HOLY_ROMAN_EMPIRE = "aoe4.HolyRomanEmpire",
    CHINESE = "aoe4.Chinese",
    ENGLISH = "aoe4.English",
    DELHI_SULTANATE = "aoe4.DelhiSultanate",
    MONGOLS = "aoe4.Mongols",
    ABBASID_DYNASTY = "aoe4.AbbasidDynasty",
    FRENCH = "aoe4.French",
    OTTOMANS = "aoe4.Ottomans",
    MALIANS = "aoe4.Malians",
    BYZANTINES = "aoe4.Byzantines",
    JAPANESE = "aoe4.Japanese",
    AYYUBIDS = "aoe4.Ayyubids",
    ZHUXILEGACY = "aoe4.ZhuXiLegacy",
    JEANNEDARC = "aoe4.JeanneDArc",
    ORDEROFTHEDRAGON = "aoe4.OrderOfTheDragon",
    HOUSE_OF_LANCASTER = "aoe4.HouseOfLancaster",
    KNIGHTS_TEMPLAR = "aoe4.KnightsTemplar",
    GOLDEN_HORDE = "aoe4.GoldenHorde",
    MACEDONIAN_DYNASTY = "aoe4.MacedonianDynasty",
    SENGOKU_DAIMYO = "aoe4.SengokuDaimyo",
    TUGHLAQ_DYNASTY = "aoe4.TughlaqDynasty",
}

class Aoe4Civilisation extends DraftOption {

    public static readonly RUS: Aoe4Civilisation = new Aoe4Civilisation(Name.RUS);
    public static readonly HOLY_ROMAN_EMPIRE: Aoe4Civilisation = new Aoe4Civilisation(Name.HOLY_ROMAN_EMPIRE);
    public static readonly CHINESE: Aoe4Civilisation = new Aoe4Civilisation(Name.CHINESE);
    public static readonly ENGLISH: Aoe4Civilisation = new Aoe4Civilisation(Name.ENGLISH);
    public static readonly DELHI_SULTANATE: Aoe4Civilisation = new Aoe4Civilisation(Name.DELHI_SULTANATE);
    public static readonly MONGOLS: Aoe4Civilisation = new Aoe4Civilisation(Name.MONGOLS);
    public static readonly ABBASID_DYNASTY: Aoe4Civilisation = new Aoe4Civilisation(Name.ABBASID_DYNASTY);
    public static readonly FRENCH: Aoe4Civilisation = new Aoe4Civilisation(Name.FRENCH);
    public static readonly OTTOMANS: Aoe4Civilisation = new Aoe4Civilisation(Name.OTTOMANS);
    public static readonly MALIANS: Aoe4Civilisation = new Aoe4Civilisation(Name.MALIANS);
    public static readonly BYZANTINES: Aoe4Civilisation = new Aoe4Civilisation(Name.BYZANTINES);
    public static readonly JAPANESE: Aoe4Civilisation = new Aoe4Civilisation(Name.JAPANESE);
    public static readonly AYYUBIDS: Aoe4Civilisation = new Aoe4Civilisation(Name.AYYUBIDS);
    public static readonly ZHUXILEGACY: Aoe4Civilisation = new Aoe4Civilisation(Name.ZHUXILEGACY);
    public static readonly JEANNEDARC: Aoe4Civilisation = new Aoe4Civilisation(Name.JEANNEDARC);
    public static readonly ORDEROFTHEDRAGON: Aoe4Civilisation = new Aoe4Civilisation(Name.ORDEROFTHEDRAGON);
    public static readonly HOUSE_OF_LANCASTER: Aoe4Civilisation = new Aoe4Civilisation(Name.HOUSE_OF_LANCASTER);
    public static readonly KNIGHTS_TEMPLAR: Aoe4Civilisation = new Aoe4Civilisation(Name.KNIGHTS_TEMPLAR);
    public static readonly GOLDEN_HORDE: Aoe4Civilisation = new Aoe4Civilisation(Name.GOLDEN_HORDE);
    public static readonly MACEDONIAN_DYNASTY: Aoe4Civilisation = new Aoe4Civilisation(Name.MACEDONIAN_DYNASTY);
    public static readonly SENGOKU_DAIMYO: Aoe4Civilisation = new Aoe4Civilisation(Name.SENGOKU_DAIMYO);
    public static readonly TUGHLAQ_DYNASTY: Aoe4Civilisation = new Aoe4Civilisation(Name.TUGHLAQ_DYNASTY);

    // DO NOT CHANGE THE ORDER OF ELEMENTS IN THIS ARRAY!!!
    // ONLY APPEND NEW CIVILISATIONS AT THE END!!!
    public static readonly ALL = [
        Aoe4Civilisation.RUS,
        Aoe4Civilisation.HOLY_ROMAN_EMPIRE,
        Aoe4Civilisation.CHINESE,
        Aoe4Civilisation.ENGLISH,
        Aoe4Civilisation.DELHI_SULTANATE,
        Aoe4Civilisation.MONGOLS,
        Aoe4Civilisation.ABBASID_DYNASTY,
        Aoe4Civilisation.FRENCH,
        Aoe4Civilisation.OTTOMANS,
        Aoe4Civilisation.MALIANS,
        Aoe4Civilisation.BYZANTINES,
        Aoe4Civilisation.JAPANESE,
        Aoe4Civilisation.AYYUBIDS,
        Aoe4Civilisation.ZHUXILEGACY,
        Aoe4Civilisation.JEANNEDARC,
        Aoe4Civilisation.ORDEROFTHEDRAGON,
        Aoe4Civilisation.HOUSE_OF_LANCASTER,
        Aoe4Civilisation.KNIGHTS_TEMPLAR,
        Aoe4Civilisation.GOLDEN_HORDE,
        Aoe4Civilisation.MACEDONIAN_DYNASTY,
        Aoe4Civilisation.SENGOKU_DAIMYO,
        Aoe4Civilisation.TUGHLAQ_DYNASTY,
    ];

    private static DISABLED_OPTIONS: string[] = [Name.GOLDEN_HORDE, Name.MACEDONIAN_DYNASTY, Name.SENGOKU_DAIMYO, Name.TUGHLAQ_DYNASTY];
    public static readonly ALL_ACTIVE = Aoe4Civilisation.ALL.filter(value => !Aoe4Civilisation.DISABLED_OPTIONS.includes(value.name));

    private constructor(name: Name) {
        super(name, name, Aoe4Civilisation.defaultImageUrlsForCivilisation(name));
    }

    public static defaultImageUrlsForCivilisation(name: string) {
        return {
            unit: `/images/aoe4/flag/${name}.png`,
            emblem: `/images/aoe4/flag/${name}.png`,
            animated_left: `/images/aoe4/flag/${name}.png`,
            animated_right: `/images/aoe4/flag/${name}.png`,
        }
    }

}

export default Aoe4Civilisation;
export {Name};
