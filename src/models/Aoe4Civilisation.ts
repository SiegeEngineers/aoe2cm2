import DraftOption from "./DraftOption";

enum Name {
    RUS = "aoe4.Rus",
    HOLY_ROMAN_EMPIRE = "aoe4.HolyRomanEmpire",
    CHINESE = "aoe4.Chinese",
    ENGLISH = "aoe4.English",
    DEHLI_SULTANATE = "aoe4.DehliSultanate",
    MONGOLS = "aoe4.Mongols",
    ABBASID_DYNASTY = "aoe4.AbbasidDynasty",
    FRENCH = "aoe4.French",
}

class Aoe4Civilisation extends DraftOption {

    public static readonly RUS: Aoe4Civilisation = new Aoe4Civilisation(Name.RUS);
    public static readonly HOLY_ROMAN_EMPIRE: Aoe4Civilisation = new Aoe4Civilisation(Name.HOLY_ROMAN_EMPIRE);
    public static readonly CHINESE: Aoe4Civilisation = new Aoe4Civilisation(Name.CHINESE);
    public static readonly ENGLISH: Aoe4Civilisation = new Aoe4Civilisation(Name.ENGLISH);
    public static readonly DEHLI_SULTANATE: Aoe4Civilisation = new Aoe4Civilisation(Name.DEHLI_SULTANATE);
    public static readonly MONGOLS: Aoe4Civilisation = new Aoe4Civilisation(Name.MONGOLS);
    public static readonly ABBASID_DYNASTY: Aoe4Civilisation = new Aoe4Civilisation(Name.ABBASID_DYNASTY);
    public static readonly FRENCH: Aoe4Civilisation = new Aoe4Civilisation(Name.FRENCH);



    // DO NOT CHANGE THE ORDER OF ELEMENTS IN THIS ARRAY!!!
    // ONLY APPEND NEW CIVILISATIONS AT THE END!!!
    public static readonly ALL = [
        Aoe4Civilisation.RUS,
        Aoe4Civilisation.HOLY_ROMAN_EMPIRE,
        Aoe4Civilisation.CHINESE,
        Aoe4Civilisation.ENGLISH,
        Aoe4Civilisation.DEHLI_SULTANATE,
        Aoe4Civilisation.MONGOLS,
        Aoe4Civilisation.ABBASID_DYNASTY,
        Aoe4Civilisation.FRENCH,
    ];

    private constructor(name: Name) {
        super(name, name, Aoe4Civilisation.defaultImageUrlsForCivilisation(name));
    }

    public static defaultImageUrlsForCivilisation(name: string) {
        return {
            unit: `/images/aoe4/flag/${name}.png`,
            emblem: `/images/aoe4/flag/${name}.png`,
            animated_left: `/images/aoe4/flag-animated/${name}.apng`,
            animated_right: `/images/aoe4/flag-animated/${name}.apng`,
        }
    }

}

export default Aoe4Civilisation;
export {Name};
