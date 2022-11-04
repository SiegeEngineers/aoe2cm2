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
    ];

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
