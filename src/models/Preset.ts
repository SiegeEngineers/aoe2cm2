import Turn from "./Turn";
import {Assert} from "../util/Assert";
import Civilisation from "./Civilisation";
import DraftOption from "./DraftOption";
import {ICategoryLimits} from "../types";
import Pool from "./Pool";

class Preset {

    public static readonly EMPTY: Preset = new Preset('', [Pool.defaultWith([])], []);

    public static readonly NEW: Preset = new Preset('', [Pool.defaultWith(Civilisation.ALL_ACTIVE)], []);

    public static readonly SAMPLE: Preset = new Preset('Default Preset', [Pool.defaultWith(Civilisation.ALL_ACTIVE)], [
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

    public static readonly SIMPLE: Preset = new Preset('Simple Preset', [Pool.defaultWith(Civilisation.ALL_ACTIVE)], [
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
    public readonly pools: Pool[];

    constructor(name: string, pools: Pool[], turns: Turn[] = [], presetId?: string,
                categoryLimits: ICategoryLimits = {pick: {}, ban: {}}) {
        if (pools.length === 0) {
            throw new Error('A preset needs at least one pool');
        }
        this.name = name;
        this.presetId = presetId;
        this.pools = pools;
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
        pools?: Pool[],
        segments?: Pool[]
    } | undefined): Preset | undefined {
        if (preset === undefined) {
            return undefined;
        }
        Assert.isString(preset.name);
        Assert.isOptionalString(preset.encodedCivilisations);
        Assert.isOptionalString(preset.presetId);
        // A preset stored before there were pools carries its options itself; they become its one pool.
        // A build of this branch before the rename stored the pools as segments.
        const stored = preset.pools ?? preset.segments;
        const pools = Array.isArray(stored) && stored.length > 0
            ? Pool.namedWhenAlone(Pool.fromPojoArray(stored))
            : [Pool.defaultWith(Pool.optionsFromPojo(preset))];
        Assert.isCategoryLimitsOrUndefined(preset.categoryLimits)
        return new Preset(preset.name, pools, Turn.fromPojoArray(preset.turns), preset.presetId, preset.categoryLimits);
    }

    public addTurn(turn: Turn) {
        this.turns.push(turn);
    }

    /** The options of every pool, in the order the pools are declared. */
    get options(): DraftOption[] {
        return Pool.optionsOf(this.pools);
    }

    public optionsForTurn(turn: Turn): DraftOption[] {
        return this.optionsForPool(turn.poolId);
    }

    /** The options of one pool, and none for a pool the preset does not have. */
    public optionsForPool(poolId: string): DraftOption[] {
        const pool = this.pools.find(value => value.id === poolId);
        return pool === undefined ? [] : pool.options;
    }

    /** Whether the options are split up at all, which is when a pool is worth naming and showing. */
    public hasSeveralPools(): boolean {
        return this.pools.length > 1;
    }
}

export default Preset;
