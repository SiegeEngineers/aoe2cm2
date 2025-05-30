import DraftOption, { ImageUrls } from "./DraftOption";

class Aoe4Map extends DraftOption {

    public static readonly ALL = [
        new Aoe4Map("African Waters"),
        new Aoe4Map("Altai"),
        new Aoe4Map("Ancient Spires"),
        new Aoe4Map("Archipelago"),
        new Aoe4Map("Atacama"),
        new Aoe4Map("Atoll"),
        new Aoe4Map("Baldland"),
        new Aoe4Map("Baltic"),
        new Aoe4Map("Basin"),
        new Aoe4Map("Blackforest"),
        new Aoe4Map("Boulder Bay"),
        new Aoe4Map("Bridges"),
        new Aoe4Map("Cache"),
        new Aoe4Map("Canal"),
        new Aoe4Map("Carmel"),
        new Aoe4Map("Cascade"),
        new Aoe4Map("Cauldron"),
        new Aoe4Map("Chaos Random"),
        new Aoe4Map("Cliffside"),
        new Aoe4Map("Coastal Cliffs"),
        new Aoe4Map("Confluence"),
        new Aoe4Map("Continental"),
        new Aoe4Map("Danube River"),
        new Aoe4Map("Deer Valley"),
        new Aoe4Map("Drowned Forest"),
        new Aoe4Map("Dry Arabia"),
        new Aoe4Map("Dry River"),
        new Aoe4Map("Enlightened Horizon"),
        new Aoe4Map("Flankwoods"),
        new Aoe4Map("Floodplain"),
        new Aoe4Map("Fog of War"),
        new Aoe4Map("Forest Pass"),
        new Aoe4Map("Forest Ponds"),
        new Aoe4Map("Forts"),
        new Aoe4Map("Four Lakes"),
        new Aoe4Map("French Pass"),
        new Aoe4Map("Frisian Marshes"),
        new Aoe4Map("Glade"),
        new Aoe4Map("Gleaming Summit"),
        new Aoe4Map("Golden Heights"),
        new Aoe4Map("Golden Pit"),
        new Aoe4Map("Gorge"),
        new Aoe4Map("Hallowed Spring"),
        new Aoe4Map("Haywire"),
        new Aoe4Map("Hedgemaze"),
        new Aoe4Map("Hidden Valley"),
        new Aoe4Map("Hideout"),
        new Aoe4Map("Highbridge"),
        new Aoe4Map("Highview"),
        new Aoe4Map("Highwoods"),
        new Aoe4Map("Hill and Dale"),
        new Aoe4Map("Himeyama"),
        new Aoe4Map("Holy Island"),
        new Aoe4Map("Hourglass"),
        new Aoe4Map("Jousting Fields"),
        new Aoe4Map("Kawasan"),
        new Aoe4Map("King of the Hill"),
        new Aoe4Map("Lipany"),
        new Aoe4Map("Marshland"),
        new Aoe4Map("MegaRandom"),
        new Aoe4Map("Migration"),
        new Aoe4Map("Mongolian Heights"),
        new Aoe4Map("Mountain Clearing"),
        new Aoe4Map("Mountain Lakes"),
        new Aoe4Map("Mountain Pass"),
        new Aoe4Map("Moving Out"),
        new Aoe4Map("Mt Warning"),
        new Aoe4Map("Nagari"),
        new Aoe4Map("Narrow Sea"),
        new Aoe4Map("Oasis"),
        new Aoe4Map("Pigeons View"),
        new Aoe4Map("Prairie"),
        new Aoe4Map("Rain Forest"),
        new Aoe4Map("Regions"),
        new Aoe4Map("Relic River"),
        new Aoe4Map("Rocky Canyon"),
        new Aoe4Map("Rocky River"),
        new Aoe4Map("Rugged"),
        new Aoe4Map("Safety Bay"),
        new Aoe4Map("Sand Reef"),
        new Aoe4Map("Scandinavia"),
        new Aoe4Map("Scattered Hills"),
        new Aoe4Map("Shadow Lake"),
        new Aoe4Map("Socotra"),
        new Aoe4Map("Sol and Luna"),
        new Aoe4Map("Sunkenlands"),
        new Aoe4Map("Tempi"),
        new Aoe4Map("The Pit"),
        new Aoe4Map("Thickets"),
        new Aoe4Map("Turtle Ridge"),
        new Aoe4Map("Volcanic Island"),
        new Aoe4Map("Wadden Sea"),
        new Aoe4Map("Warring Islands"),
        new Aoe4Map("Wasteland"),
        new Aoe4Map("Water Drake"),
        new Aoe4Map("Waterholes"),
        new Aoe4Map("Waterlanes"),
        new Aoe4Map("Wetlands"),
        new Aoe4Map("Wolf Hill"),
        new Aoe4Map("Woodwall"),
        new Aoe4Map("X Marks the Spot"),
    ]

    private constructor(name: string) {
        const id = name.toLowerCase().replace(/[^a-z]/g, '-');
        super(id, name, Aoe4Map.defaultImageUrlsForMap(id), '');
    }

    public static defaultImageUrlsForMap(id: string): ImageUrls {
        const path = `/images/aoe4-maps/${id}.png`;
        return {
            unit: path,
            emblem: path,
            animated_left: path,
            animated_right: path,
        }
    }
}

export default Aoe4Map;