import Pool from "../../models/Pool";
import DraftOption from "../../models/DraftOption";
import Civilisation from "../../models/Civilisation";

const mapOption = (id: string) => new DraftOption(id, id, DraftOption.defaultImageUrlsForCivilisation(id), '', 'maps');

it('default pool id is "default"', () => {
    expect(Pool.DEFAULT_ID).toEqual('default');
});

it('pool exposes its own draft options', () => {
    const pool = new Pool('maps', 'Maps', [mapOption('arabia'), mapOption('arena')]);
    expect(pool.options.map(value => value.id)).toEqual(['arabia', 'arena']);
});

it('pool from valid pojo array works', () => {
    const pools = Pool.fromPojoArray([{
        id: 'maps',
        name: 'Maps',
        draftOptions: [{id: 'arabia', name: 'arabia', category: 'maps'}]
    }] as Pool[]);
    expect(pools).toHaveLength(1);
    expect(pools[0].id).toEqual('maps');
    expect(pools[0].name).toEqual('Maps');
    expect(pools[0].options.map(value => value.id)).toEqual(['arabia']);
});

it('pool from pojo without id throws', () => {
    expect(() => {
        Pool.fromPojoArray([{name: 'Maps', draftOptions: []} as unknown as Pool]);
    }).toThrowError("Expected argument to be string, but was undefined");
});

it('pool from pojo without name throws', () => {
    expect(() => {
        Pool.fromPojoArray([{id: 'maps', draftOptions: []} as unknown as Pool]);
    }).toThrowError("Expected argument to be string, but was undefined");
});

it('the default pool of a preset carries the default id and name', () => {
    const pool = Pool.defaultWith([mapOption('arabia')]);
    expect(pool.id).toEqual(Pool.DEFAULT_ID);
    expect(pool.name).toEqual('Default');
    expect(pool.options.map(value => value.id)).toEqual(['arabia']);
});

it('a pool made of civilisations is stored as a bitmask', () => {
    const pool = new Pool('civs', 'Civilisations', Civilisation.ALL_ACTIVE);
    const pojo = JSON.parse(JSON.stringify(pool));
    expect(pojo).toHaveProperty('encodedCivilisations');
    expect(pojo).not.toHaveProperty('draftOptions');
    expect(pool.options.map(value => value.id).sort())
        .toEqual(Civilisation.ALL_ACTIVE.map(value => value.id).sort());
});

it('a pool of maps keeps its explicit options', () => {
    const pool = new Pool('maps', 'Maps', [mapOption('arabia')]);
    const pojo = JSON.parse(JSON.stringify(pool));
    expect(pojo).toHaveProperty('draftOptions');
    expect(pojo).not.toHaveProperty('encodedCivilisations');
});

it('a pool from a pojo with a bitmask is decoded', () => {
    const pools = Pool.fromPojoArray([{
        id: 'civs', name: 'Civilisations', encodedCivilisations: 'e3e3fffffffefff'
    }] as unknown as Pool[]);
    expect(pools[0].options.length).toBeGreaterThan(30);
});
