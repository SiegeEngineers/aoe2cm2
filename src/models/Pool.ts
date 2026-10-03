import DraftOption from "./DraftOption";
import {Assert} from "../util/Assert";
import {CivilisationEncoder} from "../util/CivilisationEncoder";
import {Util} from "../util/Util";

/** A named pool of draft options. Every preset has at least one, and a turn draws from exactly one. */
class Pool {
    /** The id of the pool a turn belongs to when it names none, and of the pool a preset stored without pools is loaded into. */
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
    public static defaultWith(draftOptions: DraftOption[]): Pool {
        return new Pool(Pool.DEFAULT_ID, Pool.DEFAULT_NAME, draftOptions);
    }

    /** A lone pool without a name goes by the default one, since the editor shows no name input for a lone pool. */
    public static namedWhenAlone(pools: Pool[]): Pool[] {
        if (pools.length === 1 && pools[0].name.trim().length === 0) {
            return [new Pool(pools[0].id, Pool.DEFAULT_NAME, pools[0].options)];
        }
        return pools;
    }

    /** The id of the pool at this position when pools are numbered: the first one is the default. */
    public static idFor(number: number): string {
        return number === 1 ? Pool.DEFAULT_ID : `pool-${number}`;
    }

    /** The options of these pools, in the order the pools are declared. */
    public static optionsOf(pools: Pool[]): DraftOption[] {
        return pools.reduce<DraftOption[]>((all, pool) => all.concat(pool.options), []);
    }

    /** The options a pool, or a preset from before there were pools, holds: civilisations encoded, anything else plain. */
    public static optionsFromPojo(holder: { encodedCivilisations?: string, draftOptions?: DraftOption[] }): DraftOption[] {
        if (holder.encodedCivilisations) {
            return CivilisationEncoder.decodeCivilisationArray(holder.encodedCivilisations);
        }
        return DraftOption.fromPojoArray(holder.draftOptions || []);
    }

    public static fromPojoArray(pools: Pool[]): Pool[] {
        let retval: Pool[] = [];
        for (let pool of pools) {
            Assert.isString(pool.id);
            Assert.isString(pool.name);
            Assert.isOptionalString(pool.encodedCivilisations);
            retval.push(new Pool(pool.id, pool.name, Pool.optionsFromPojo(pool)));
        }
        return retval;
    }
}

export default Pool;
