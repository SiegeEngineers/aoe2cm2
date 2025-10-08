import DraftOption from "./DraftOption";

enum Name {
    ZEUS = "aomgods.Zeus",
    POSEIDON = "aomgods.Poseidon",
    HADES = "aomgods.Hades",
    RA = "aomgods.Ra",
    ISIS = "aomgods.Isis",
    SET = "aomgods.Set",
    ODIN = "aomgods.Odin",
    THOR = "aomgods.Thor",
    LOKI = "aomgods.Loki",
    FREYR = "aomgods.Freyr",
    KRONOS = "aomgods.Kronos",
    GAIA = "aomgods.Gaia",
    ORANOS = "aomgods.Oranos",
    FUXI = "aomgods.Fuxi",
    NUWA = "aomgods.Nuwa",
    SHENNONG = "aomgods.Shennong",
    AMATERASU = "aomgods.Amaterasu",
    TSUKUYOMI = "aomgods.Tsukuyomi",
    SUSANOO = "aomgods.Susanoo",
}

class AomGod extends DraftOption {

    public static readonly ZEUS: AomGod = new AomGod(Name.ZEUS);
    public static readonly POSEIDON: AomGod = new AomGod(Name.POSEIDON);
    public static readonly HADES: AomGod = new AomGod(Name.HADES);
    public static readonly RA: AomGod = new AomGod(Name.RA);
    public static readonly ISIS: AomGod = new AomGod(Name.ISIS);
    public static readonly SET: AomGod = new AomGod(Name.SET);
    public static readonly ODIN: AomGod = new AomGod(Name.ODIN);
    public static readonly THOR: AomGod = new AomGod(Name.THOR);
    public static readonly LOKI: AomGod = new AomGod(Name.LOKI);
    public static readonly FREYR: AomGod = new AomGod(Name.FREYR);
    public static readonly KRONOS: AomGod = new AomGod(Name.KRONOS);
    public static readonly GAIA: AomGod = new AomGod(Name.GAIA);
    public static readonly ORANOS: AomGod = new AomGod(Name.ORANOS);
    public static readonly FUXI: AomGod = new AomGod(Name.FUXI);
    public static readonly NUWA: AomGod = new AomGod(Name.NUWA);
    public static readonly SHENNONG: AomGod = new AomGod(Name.SHENNONG);
    public static readonly AMATERASU: AomGod = new AomGod(Name.AMATERASU);
    public static readonly TSUKUYOMI: AomGod = new AomGod(Name.TSUKUYOMI);
    public static readonly SUSANOO: AomGod = new AomGod(Name.SUSANOO);



    // DO NOT CHANGE THE ORDER OF ELEMENTS IN THIS ARRAY!!!
    // ONLY APPEND NEW CIVILISATIONS AT THE END!!!
    public static readonly ALL = [
        AomGod.ZEUS,
        AomGod.POSEIDON,
        AomGod.HADES,
        AomGod.RA,
        AomGod.ISIS,
        AomGod.SET,
        AomGod.ODIN,
        AomGod.THOR,
        AomGod.LOKI,
        AomGod.FREYR,
        AomGod.KRONOS,
        AomGod.GAIA,
        AomGod.ORANOS,
        AomGod.FUXI,
        AomGod.NUWA,
        AomGod.SHENNONG,
        AomGod.AMATERASU,
        AomGod.TSUKUYOMI,
        AomGod.SUSANOO,
    ];

    private constructor(name: Name) {
        super(name, name, AomGod.defaultImageUrlsForCivilisation(name));
    }

    public static defaultImageUrlsForCivilisation(name: string) {
        return {
            unit: `/images/aomgods/${name.toLowerCase()}.png`,
            emblem: `/images/aomgods/${name.toLowerCase()}.png`,
            animated_left: `/images/aomgods/${name.toLowerCase()}.png`,
            animated_right: `/images/aomgods/${name.toLowerCase()}.png`,
        }
    }

}

export default AomGod;
export {Name};
