import Turn from "./Turn";
import {CivilisationEncoder} from "../util/CivilisationEncoder";
import {Assert} from "../util/Assert";
import Civilisation from "./Civilisation";
import DraftOption from "./DraftOption";
import {Util} from "../util/Util";

class Preset {

    public static readonly EMPTY: Preset = new Preset('', [], []);

    public static readonly NEW: Preset = new Preset('', Civilisation.ALL, []);

    public static readonly SAMPLE: Preset = new Preset('Default Preset', Civilisation.ALL, [
        Turn.HOST_GLOBAL_BAN,
        Turn.GUEST_GLOBAL_BAN,
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.REVEAL_ALL,
        Turn.HOST_GLOBAL_PICK,
        Turn.GUEST_GLOBAL_PICK,
        Turn.HOST_PICK,
        Turn.GUEST_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.REVEAL_ALL,
        Turn.HOST_HIDDEN_SNIPE,
        Turn.GUEST_HIDDEN_SNIPE,
        Turn.REVEAL_ALL
    ]);

    public static readonly SIMPLE: Preset = new Preset('Simple Preset', Civilisation.ALL, [
        Turn.HOST_NONEXCLUSIVE_BAN,
        Turn.GUEST_NONEXCLUSIVE_BAN,
        Turn.GUEST_NONEXCLUSIVE_PICK,
        Turn.HOST_NONEXCLUSIVE_PICK
    ]);

    public readonly name: string;
    public presetId?: string
    public readonly encodedCivilisations?: string;
    public readonly draftOptions?: DraftOption[];
    public readonly turns: Turn[];

    constructor(name: string, draftOptions: DraftOption[], turns: Turn[] = [], presetId?: string) {
        this.name = name;
        this.presetId = presetId;
        if (Util.isCivilisationArray(draftOptions)) {
            this.encodedCivilisations = CivilisationEncoder.encodeCivilisationArray(draftOptions);
        } else {
            this.draftOptions = draftOptions;
        }
        this.turns = turns;
    }

    public static fromPojo(preset: { name: string, encodedCivilisations?: string, draftOptions?: DraftOption[], turns: Turn[], presetId?: string } | undefined): Preset | undefined {
        if (preset === undefined) {
            return undefined;
        }
        Assert.isString(preset.name);
        Assert.isOptionalString(preset.encodedCivilisations);
        Assert.isOptionalString(preset.presetId);
        let draftOptions: DraftOption[] = [];
        if (preset.encodedCivilisations) {
            draftOptions = CivilisationEncoder.decodeCivilisationArray(preset.encodedCivilisations);
        } else if (preset.draftOptions) {
            draftOptions = preset.draftOptions;
        }
        return new Preset(preset.name, draftOptions, Turn.fromPojoArray(preset.turns), preset.presetId);
    }

    public addTurn(turn: Turn) {
        this.turns.push(turn);
    }

    get options(): DraftOption[] {
        if (this.encodedCivilisations) {
            return CivilisationEncoder.decodeCivilisationArray(this.encodedCivilisations);
        }
        if (this.draftOptions) {
            return this.draftOptions;
        }
        throw new Error('Invalid Preset without either encodedCivilisations or draftOptions');
    }
}

export default Preset;