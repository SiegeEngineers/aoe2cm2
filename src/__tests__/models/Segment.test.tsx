import Segment from "../../models/Segment";
import DraftOption from "../../models/DraftOption";
import Civilisation from "../../models/Civilisation";

const mapOption = (id: string) => new DraftOption(id, id, DraftOption.defaultImageUrlsForCivilisation(id), '', 'maps');

it('default segment id is "default"', () => {
    expect(Segment.DEFAULT_ID).toEqual('default');
});

it('segment exposes its own draft options', () => {
    const segment = new Segment('maps', 'Maps', [mapOption('arabia'), mapOption('arena')]);
    expect(segment.options.map(value => value.id)).toEqual(['arabia', 'arena']);
});

it('segment from valid pojo array works', () => {
    const segments = Segment.fromPojoArray([{
        id: 'maps',
        name: 'Maps',
        draftOptions: [{id: 'arabia', name: 'arabia', category: 'maps'}]
    }] as Segment[]);
    expect(segments).toHaveLength(1);
    expect(segments[0].id).toEqual('maps');
    expect(segments[0].name).toEqual('Maps');
    expect(segments[0].options.map(value => value.id)).toEqual(['arabia']);
});

it('segment from pojo without id throws', () => {
    expect(() => {
        Segment.fromPojoArray([{name: 'Maps', draftOptions: []} as unknown as Segment]);
    }).toThrowError("Expected argument to be string, but was undefined");
});

it('segment from pojo without name throws', () => {
    expect(() => {
        Segment.fromPojoArray([{id: 'maps', draftOptions: []} as unknown as Segment]);
    }).toThrowError("Expected argument to be string, but was undefined");
});

it('legacy default segment wraps draft options', () => {
    const segment = Segment.legacyDefault(undefined, [mapOption('arabia')]);
    expect(segment.id).toEqual(Segment.DEFAULT_ID);
    expect(segment.options.map(value => value.id)).toEqual(['arabia']);
});

it('legacy default segment decodes encoded civilisations', () => {
    const segment = Segment.legacyDefault('7ffffffff', undefined);
    expect(segment.id).toEqual(Segment.DEFAULT_ID);
    expect(segment.options.length).toBeGreaterThan(0);
    expect(segment.options.every(value => value.category === 'default')).toBe(true);
});

it('a pool made of civilisations is stored as a bitmask', () => {
    const segment = new Segment('civs', 'Civilisations', Civilisation.ALL_ACTIVE);
    const pojo = JSON.parse(JSON.stringify(segment));
    expect(pojo).toHaveProperty('encodedCivilisations');
    expect(pojo).not.toHaveProperty('draftOptions');
    expect(segment.options.map(value => value.id).sort())
        .toEqual(Civilisation.ALL_ACTIVE.map(value => value.id).sort());
});

it('a pool of maps keeps its explicit options', () => {
    const segment = new Segment('maps', 'Maps', [mapOption('arabia')]);
    const pojo = JSON.parse(JSON.stringify(segment));
    expect(pojo).toHaveProperty('draftOptions');
    expect(pojo).not.toHaveProperty('encodedCivilisations');
});

it('a pool from a pojo with a bitmask is decoded', () => {
    const segments = Segment.fromPojoArray([{
        id: 'civs', name: 'Civilisations', encodedCivilisations: 'e3e3fffffffefff'
    }] as unknown as Segment[]);
    expect(segments[0].options.length).toBeGreaterThan(30);
});
