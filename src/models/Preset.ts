import Turn from "./Turn";
import {CivilisationEncoder} from "../util/CivilisationEncoder";
import {Assert} from "../util/Assert";
import Civilisation from "./Civilisation";
import DraftOption from "./DraftOption";
import {Util} from "../util/Util";
import {ICategoryLimits} from "../types";
import Segment from "./Segment";
import Player from "../constants/Player";

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
    public readonly encodedCivilisations?: string;
    public readonly draftOptions?: DraftOption[];
    public readonly turns: Turn[];
    public readonly categoryLimits: ICategoryLimits;
    public readonly segments?: Segment[];

    constructor(name: string, draftOptions: DraftOption[], turns: Turn[] = [], presetId?: string,
                categoryLimits: ICategoryLimits = {pick: {}, ban: {}}, segments?: Segment[]) {
        this.name = name;
        this.presetId = presetId;
        if (segments !== undefined && segments.length > 0) {
            this.segments = segments;
        } else if (Util.isCivilisationArray(draftOptions)) {
            this.encodedCivilisations = CivilisationEncoder.encodeCivilisationArray(draftOptions);
        } else {
            this.draftOptions = draftOptions;
        }
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
        let draftOptions: DraftOption[] = [];
        if (preset.encodedCivilisations) {
            draftOptions = CivilisationEncoder.decodeCivilisationArray(preset.encodedCivilisations);
        } else if (preset.draftOptions) {
            draftOptions = DraftOption.fromPojoArray(preset.draftOptions);
        }
        let turns: Turn[] = Turn.fromPojoArray(preset.turns);
        let segments: Segment[] | undefined = undefined;
        if (Array.isArray(preset.segments) && preset.segments.length > 1) {
            segments = Segment.fromPojoArray(preset.segments);
        } else if (Array.isArray(preset.segments) && preset.segments.length === 1) {
            // A single pool is an ordinary preset: its options and its turns come away with it.
            draftOptions = Segment.fromPojoArray(preset.segments)[0].options;
            turns = turns.map(turn => Turn.withSegmentId(turn, Segment.DEFAULT_ID));
        }
        Assert.isCategoryLimitsOrUndefined(preset.categoryLimits)
        return new Preset(preset.name, draftOptions, turns, preset.presetId, preset.categoryLimits, segments);
    }

    public addTurn(turn: Turn) {
        this.turns.push(turn);
    }

    get options(): DraftOption[] {
        if (this.segments !== undefined && this.segments.length > 0) {
            return this.segments.reduce<DraftOption[]>((acc, segment) => acc.concat(segment.options), []);
        }
        if (this.encodedCivilisations) {
            return CivilisationEncoder.decodeCivilisationArray(this.encodedCivilisations);
        }
        if (this.draftOptions) {
            return this.draftOptions;
        }
        throw new Error('Invalid Preset without either encodedCivilisations or draftOptions');
    }

    public optionsForTurn(turn: Turn): DraftOption[] {
        return this.optionsForSegment(turn.segmentIdOrDefault());
    }

    /** The options of one pool. A preset without pools offers all of its options to every turn. */
    public optionsForSegment(segmentId?: string): DraftOption[] {
        if (this.segments === undefined) {
            return this.options;
        }
        if (segmentId === undefined) {
            return this.options;
        }
        const segment = this.segments.find(value => value.id === segmentId);
        return segment === undefined ? [] : segment.options;
    }

    /**
     * A pause reveals nothing and drafts nothing, so the pool on show while one is running is the
     * pool of the next turn that does draft something. Undefined once the draft is over.
     */
    public segmentIdInPlay(nextAction: number): string | undefined {
        for (let i = Math.max(nextAction, 0); i < this.turns.length; i++) {
            if (this.turns[i].choosesDraftOption()) {
                return this.turns[i].segmentIdOrDefault();
            }
        }
        return undefined;
    }

    /** The pools an admin turn takes options out of, in the order the preset declares them. */
    public segmentsWithAdminTurns(): Segment[] {
        return this.segmentsOrDefault().filter(segment => this.turns.some(turn =>
            turn.player === Player.NONE && turn.choosesDraftOption()
            && turn.segmentIdOrDefault() === segment.id));
    }

    public segmentsOrDefault(): Segment[] {
        if (this.segments !== undefined && this.segments.length > 0) {
            return this.segments;
        }
        return [Segment.legacyDefault(this.encodedCivilisations, this.draftOptions)];
    }
}

export default Preset;