import {Assert} from "../util/Assert";

export interface ImageUrls {
    unit: string;
    emblem: string;
    animated_left: string;
    animated_right: string;
}

enum Name {
    HIDDEN_PICK = "HIDDEN_PICK",
    HIDDEN_BAN = "HIDDEN_BAN",
    HIDDEN_SNIPE = "HIDDEN_SNIPE",
    HIDDEN_STEAL = "HIDDEN_STEAL",
    HIDDEN = "HIDDEN",
    RANDOM = "RANDOM",
}

class DraftOption {

    public static readonly HIDDEN_PICK: DraftOption = new DraftOption(Name.HIDDEN_PICK);
    public static readonly HIDDEN_BAN: DraftOption = new DraftOption(Name.HIDDEN_BAN);
    public static readonly HIDDEN_SNIPE: DraftOption = new DraftOption(Name.HIDDEN_SNIPE);
    public static readonly HIDDEN_STEAL: DraftOption = new DraftOption(Name.HIDDEN_STEAL);
    public static readonly HIDDEN: DraftOption = new DraftOption(Name.HIDDEN);
    public static readonly RANDOM: DraftOption = new DraftOption(Name.RANDOM);
    public static readonly TECHNICAL_DRAFT_OPTIONS: DraftOption[] = [
        DraftOption.HIDDEN_PICK,
        DraftOption.HIDDEN_BAN,
        DraftOption.HIDDEN_SNIPE,
        DraftOption.HIDDEN_STEAL,
        DraftOption.HIDDEN,
    ];

    public readonly id: string;
    public readonly name: string;
    public readonly imageUrls: ImageUrls;
    public readonly i18nPrefix: string;
    public readonly category: string;


    constructor(id: string, name: string = id, imageUrls: ImageUrls = DraftOption.defaultImageUrlsForCivilisation(id), i18nPrefix = 'civs.', category = 'default') {
        this.id = id;
        this.name = name;
        this.imageUrls = imageUrls;
        this.i18nPrefix = i18nPrefix;
        this.category = category;
    }

    public static defaultImageUrlsForCivilisation(name: string): ImageUrls {
        return {
            unit: `/images/civs/${name.toLowerCase()}.png`,
            emblem: `/images/civemblems/${name.toLowerCase()}.png`,
            animated_left: `/images/units-animated/${name.toLowerCase()}-left.apng`,
            animated_right: `/images/units-animated/${name.toLowerCase()}-right.apng`,
        }
    }

    public static equals(first: DraftOption, second: DraftOption) {
        return first.id === second.id
            && first.name === second.name
            && first.category === second.category
            && first.imageUrls.unit === second.imageUrls.unit
            && first.imageUrls.emblem === second.imageUrls.emblem
            && first.imageUrls.animated_left === second.imageUrls.animated_left
            && first.imageUrls.animated_right === second.imageUrls.animated_right;
    }

    static fromPojoArray(draftOptions: DraftOption[]) {
        let retval: DraftOption[] = [];
        for (let draftOption of draftOptions) {
            Assert.isString(draftOption.id);
            Assert.isOptionalString(draftOption.name);
            Assert.isImageUrlsOrUndefined(draftOption.imageUrls);
            Assert.isOptionalString(draftOption.i18nPrefix);
            Assert.isOptionalString(draftOption.category);
            retval.push(new DraftOption(draftOption.id, draftOption.name, draftOption.imageUrls, draftOption.i18nPrefix, draftOption.category));
        }
        return retval;
    }

}

export default DraftOption;
