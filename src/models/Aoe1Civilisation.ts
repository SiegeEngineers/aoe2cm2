import DraftOption from "./DraftOption";

enum Name {
    ASSYRIANS = "aoe1.Assyrians",
    BABYLONIANS = "aoe1.Babylonians",
    CARTHAGINIANS = "aoe1.Carthaginians",
    CHOSON = "aoe1.Choson",
    EGYPTIANS = "aoe1.Egyptians",
    GREEKS = "aoe1.Greeks",
    HITTITES = "aoe1.Hittites",
    LACVIET = "aoe1.LacViet",
    MACEDONIANS = "aoe1.Macedonians",
    MINOANS = "aoe1.Minoans",
    PALMYRANS = "aoe1.Palmyrans",
    PERSIANS = "aoe1.Persians",
    PHOENICIANS = "aoe1.Phoenicians",
    ROMANS = "aoe1.Romans",
    SHANG = "aoe1.Shang",
    SUMERIANS = "aoe1.Sumerians",
    YAMATO = "aoe1.Yamato",
}

class Aoe1Civilisation extends DraftOption {

    public static readonly ASSYRIANS: Aoe1Civilisation = new Aoe1Civilisation(Name.ASSYRIANS);
    public static readonly BABYLONIANS: Aoe1Civilisation = new Aoe1Civilisation(Name.BABYLONIANS);
    public static readonly CARTHAGINIANS: Aoe1Civilisation = new Aoe1Civilisation(Name.CARTHAGINIANS);
    public static readonly CHOSON: Aoe1Civilisation = new Aoe1Civilisation(Name.CHOSON);
    public static readonly EGYPTIANS: Aoe1Civilisation = new Aoe1Civilisation(Name.EGYPTIANS);
    public static readonly GREEKS: Aoe1Civilisation = new Aoe1Civilisation(Name.GREEKS);
    public static readonly HITTITES: Aoe1Civilisation = new Aoe1Civilisation(Name.HITTITES);
    public static readonly LACVIET: Aoe1Civilisation = new Aoe1Civilisation(Name.LACVIET);
    public static readonly MACEDONIANS: Aoe1Civilisation = new Aoe1Civilisation(Name.MACEDONIANS);
    public static readonly MINOANS: Aoe1Civilisation = new Aoe1Civilisation(Name.MINOANS);
    public static readonly PALMYRANS: Aoe1Civilisation = new Aoe1Civilisation(Name.PALMYRANS);
    public static readonly PERSIANS: Aoe1Civilisation = new Aoe1Civilisation(Name.PERSIANS);
    public static readonly PHOENICIANS: Aoe1Civilisation = new Aoe1Civilisation(Name.PHOENICIANS);
    public static readonly ROMANS: Aoe1Civilisation = new Aoe1Civilisation(Name.ROMANS);
    public static readonly SHANG: Aoe1Civilisation = new Aoe1Civilisation(Name.SHANG);
    public static readonly SUMERIANS: Aoe1Civilisation = new Aoe1Civilisation(Name.SUMERIANS);
    public static readonly YAMATO: Aoe1Civilisation = new Aoe1Civilisation(Name.YAMATO);



    // DO NOT CHANGE THE ORDER OF ELEMENTS IN THIS ARRAY!!!
    // ONLY APPEND NEW CIVILISATIONS AT THE END!!!
    public static readonly ALL = [
        Aoe1Civilisation.ASSYRIANS,
        Aoe1Civilisation.BABYLONIANS,
        Aoe1Civilisation.CARTHAGINIANS,
        Aoe1Civilisation.CHOSON,
        Aoe1Civilisation.EGYPTIANS,
        Aoe1Civilisation.GREEKS,
        Aoe1Civilisation.LACVIET,
        Aoe1Civilisation.HITTITES,
        Aoe1Civilisation.MACEDONIANS,
        Aoe1Civilisation.MINOANS,
        Aoe1Civilisation.PALMYRANS,
        Aoe1Civilisation.PERSIANS,
        Aoe1Civilisation.PHOENICIANS,
        Aoe1Civilisation.ROMANS,
        Aoe1Civilisation.SHANG,
        Aoe1Civilisation.SUMERIANS,
        Aoe1Civilisation.YAMATO,
    ];

    private constructor(name: Name) {
        super(name, name, Aoe1Civilisation.defaultImageUrlsForCivilisation(name));
    }

    public static defaultImageUrlsForCivilisation(name: string) {
        return {
            unit: `/images/aoe1/civemblems/${name}.png`,
            emblem: `/images/aoe1/civemblems/${name}.png`,
            animated_left: `/images/aoe1/civemblems/${name}.png`,
            animated_right: `/images/aoe1/civemblems/${name}.png`,
        }
    }

}

export default Aoe1Civilisation;
export {Name};
