import DraftOption from "./DraftOption";
import {Assert} from "../util/Assert";
import {CivilisationEncoder} from "../util/CivilisationEncoder";
import {Util} from "../util/Util";

/** A named pool of draft options. Every preset has at least one, and a turn draws from exactly one. */
class Segment {
    /** The id of the pool a turn belongs to when it names none, and of a preset's only pool. */
    public static readonly DEFAULT_ID: string = 'default';
    /** The name the default pool goes by. It is data, so it is not translated, like the default category. */
    public static readonly DEFAULT_NAME: string = 'Default';

    public readonly id: string;
    public readonly name: string;
    public readonly encodedCivilisations?: string;
    public readonly draftOptions?: DraftOption[];

    constructor(id: string, name: string, draftOptions: DraftOption[] = []) {
        this.id = id;
        this.name = name;
        if (draftOptions.length > 0 && Util.isCivilisationArray(draftOptions)) {
            this.encodedCivilisations = CivilisationEncoder.encodeCivilisationArray(draftOptions);
        } else {
            this.draftOptions = draftOptions;
        }
    }

    get options(): DraftOption[] {
        if (this.encodedCivilisations) {
            return CivilisationEncoder.decodeCivilisationArray(this.encodedCivilisations);
        }
        return this.draftOptions === undefined ? [] : this.draftOptions;
    }

    /** The one pool of a preset that names none. */
    public static defaultWith(draftOptions: DraftOption[]): Segment {
        return new Segment(Segment.DEFAULT_ID, Segment.DEFAULT_NAME, draftOptions);
    }

    /** A lone pool without a name goes by the default one, since the editor does not show the name of a lone pool. */
    public static namedWhenAlone(segments: Segment[]): Segment[] {
        if (segments.length === 1 && segments[0].name.trim().length === 0) {
            return [new Segment(segments[0].id, Segment.DEFAULT_NAME, segments[0].options)];
        }
        return segments;
    }

    /** The id of the pool at this position when pools are numbered: the first one is the default. */
    public static idFor(number: number): string {
        return number === 1 ? Segment.DEFAULT_ID : `segment-${number}`;
    }

    /** The options of these pools, in the order the pools are declared. */
    public static optionsOf(segments: Segment[]): DraftOption[] {
        return segments.reduce<DraftOption[]>((all, segment) => all.concat(segment.options), []);
    }

    /** The options a pool, or a preset from before there were pools, holds: civilisations encoded, anything else plain. */
    public static optionsFromPojo(holder: { encodedCivilisations?: string, draftOptions?: DraftOption[] }): DraftOption[] {
        if (holder.encodedCivilisations) {
            return CivilisationEncoder.decodeCivilisationArray(holder.encodedCivilisations);
        }
        return DraftOption.fromPojoArray(holder.draftOptions || []);
    }

    public static fromPojoArray(segments: Segment[]): Segment[] {
        let retval: Segment[] = [];
        for (let segment of segments) {
            Assert.isString(segment.id);
            Assert.isString(segment.name);
            Assert.isOptionalString(segment.encodedCivilisations);
            retval.push(new Segment(segment.id, segment.name, Segment.optionsFromPojo(segment)));
        }
        return retval;
    }
}

export default Segment;
