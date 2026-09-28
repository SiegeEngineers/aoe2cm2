import Turn from "./Turn";
import {Assert} from "../util/Assert";
import Civilisation from "./Civilisation";
import DraftOption from "./DraftOption";
import {ICategoryLimits} from "../types";
import Segment from "./Segment";

class Preset {

    public static readonly EMPTY: Preset = new Preset('', [], []);

    public static readonly NEW: Preset = new Preset('', Civilisation.ALL_ACTIVE, []);

    public static readonly SAMPLE: Preset = new Preset('Default Preset', Civilisation.ALL_ACTIVE, [
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

    public static readonly SIMPLE: Preset = new Preset('Simple Preset', Civilisation.ALL_ACTIVE, [
        Turn.HOST_NONEXCLUSIVE_BAN,
        Turn.GUEST_NONEXCLUSIVE_BAN,
        Turn.GUEST_NONEXCLUSIVE_PICK,
        Turn.HOST_NONEXCLUSIVE_PICK
    ]);

    public readonly name: string;
    public presetId?: string
    public readonly turns: Turn[];
    public readonly categoryLimits: ICategoryLimits;
    /** The pools the draft options are drawn from, never fewer than one. */
    public readonly segments: Segment[];

    constructor(name: string, draftOptions: DraftOption[], turns: Turn[] = [], presetId?: string,
                categoryLimits: ICategoryLimits = {pick: {}, ban: {}}, segments?: Segment[]) {
        this.name = name;
        this.presetId = presetId;
        this.segments = segments !== undefined && segments.length > 0 ? segments : [Segment.defaultWith(draftOptions)];
        this.turns = turns;
        this.categoryLimits = categoryLimits;
    }

    public static fromPojo(preset: {
        name: string,
        encodedCivilisations?: string,
        draftOptions?: DraftOption[],
        turns: Turn[],
        presetId?: string,
        categoryLimits?: ICategoryLimits,
        segments?: Segment[]
    } | undefined): Preset | undefined {
        if (preset === undefined) {
            return undefined;
        }
        Assert.isString(preset.name);
        Assert.isOptionalString(preset.encodedCivilisations);
        Assert.isOptionalString(preset.presetId);
        // A preset stored before there were pools carries its options itself; they become its one pool.
        const segments = Array.isArray(preset.segments) && preset.segments.length > 0
            ? Segment.fromPojoArray(preset.segments)
            : [Segment.defaultWith(Segment.optionsFromPojo(preset))];
        Assert.isCategoryLimitsOrUndefined(preset.categoryLimits)
        return new Preset(preset.name, [], Turn.fromPojoArray(preset.turns), preset.presetId, preset.categoryLimits, segments);
    }

    public addTurn(turn: Turn) {
        this.turns.push(turn);
    }

    /** The options of every pool, in the order the pools are declared. */
    get options(): DraftOption[] {
        return Segment.optionsOf(this.segments);
    }

    public optionsForTurn(turn: Turn): DraftOption[] {
        return this.optionsForSegment(turn.segmentId);
    }

    /** The options of one pool, and none for a pool the preset does not have. */
    public optionsForSegment(segmentId: string): DraftOption[] {
        const segment = this.segments.find(value => value.id === segmentId);
        return segment === undefined ? [] : segment.options;
    }

    /** Whether the options are split up at all, which is when a pool is worth naming and showing. */
    public hasSeveralSegments(): boolean {
        return this.segments.length > 1;
    }
}

export default Preset;
