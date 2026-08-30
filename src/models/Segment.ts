import DraftOption from "./DraftOption";
import {Assert} from "../util/Assert";
import {CivilisationEncoder} from "../util/CivilisationEncoder";
import {Util} from "../util/Util";

class Segment {
    public static readonly DEFAULT_ID: string = 'default';

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

    public static legacyDefault(encodedCivilisations?: string, draftOptions?: DraftOption[]): Segment {
        if (encodedCivilisations) {
            return new Segment(Segment.DEFAULT_ID, Segment.DEFAULT_ID,
                CivilisationEncoder.decodeCivilisationArray(encodedCivilisations));
        }
        return new Segment(Segment.DEFAULT_ID, Segment.DEFAULT_ID, draftOptions || []);
    }

    public static fromPojoArray(segments: Segment[]): Segment[] {
        let retval: Segment[] = [];
        for (let segment of segments) {
            Assert.isString(segment.id);
            Assert.isString(segment.name);
            Assert.isOptionalString(segment.encodedCivilisations);
            if (segment.encodedCivilisations) {
                retval.push(new Segment(segment.id, segment.name,
                    CivilisationEncoder.decodeCivilisationArray(segment.encodedCivilisations)));
            } else {
                retval.push(new Segment(segment.id, segment.name,
                    DraftOption.fromPojoArray(segment.draftOptions || [])));
            }
        }
        return retval;
    }
}

export default Segment;
