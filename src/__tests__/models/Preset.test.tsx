import Preset from "../../models/Preset";
import Turn from "../../models/Turn";
import Exclusivity from "../../constants/Exclusivity";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Pool from "../../models/Pool";
import DraftOption from "../../models/DraftOption";
import Civilisation from "../../models/Civilisation";

it('preset from invalid pojo throws', () => {
    expect(() => {
        Preset.fromPojo({turns: [{} as Turn, {} as Turn]} as { name: string, encodedCivilisations: string, turns: Turn[] });
    }).toThrowError("Expected argument to be string, but was undefined");
});

it('preset from valid pojo works', () => {
    const fromPojo = Preset.fromPojo({
        name: "some-name",
        encodedCivilisations: "0x1",
        turns: [{
            player: "GUEST",
            action: "PICK",
            exclusivity: Exclusivity.NONEXCLUSIVE,
            hidden: false,
            parallel: false
        }]
    } as { name: string, encodedCivilisations: string, turns: Turn[] });
    expect(fromPojo).toMatchSnapshot();
});

it('old turns without executingPlayer properties can be deserialised', () => {
    const pojo = {
        name: "Preset name",
        encodedCivilisations: "0x1",
        turns: [{
            id: "mocked-uuid",
            player: Player.HOST,
            action: Action.PICK,
            exclusivity: Exclusivity.NONEXCLUSIVE,
            hidden: false,
            parallel: false
        } as Turn]
    };
    const preset = Preset.fromPojo(pojo) as Preset;
    expect(preset.turns[0].executingPlayer).toEqual(Player.HOST);
});


it('old turns with executingPlayer properties but without categories can be deserialised', () => {
    const pojo = {
        name: "Preset name",
        encodedCivilisations: "0x1",
        turns: [{
            id: "mocked-uuid",
            player: Player.HOST,
            action: Action.PICK,
            exclusivity: Exclusivity.NONEXCLUSIVE,
            hidden: false,
            parallel: false,
            executingPlayer: Player.GUEST
        } as Turn]
    };
    const preset = Preset.fromPojo(pojo) as Preset;
    expect(preset.turns[0].executingPlayer).toEqual(Player.GUEST);
});


it('new turns with executingPlayer and categories properties can be deserialised', () => {
    const pojo = {
        name: "Preset name",
        encodedCivilisations: "0x1",
        turns: [{
            id: "mocked-uuid",
            player: Player.HOST,
            action: Action.PICK,
            exclusivity: Exclusivity.NONEXCLUSIVE,
            hidden: false,
            parallel: false,
            executingPlayer: Player.GUEST,
            categories: ['my-category']
        } as Turn]
    };
    const preset = Preset.fromPojo(pojo) as Preset;
    expect(preset.turns[0].executingPlayer).toEqual(Player.GUEST);
});



it('old preset without presetId and categoryLimits can be deserialised', () => {
    const pojo = {
        name: "Preset name",
        encodedCivilisations: "0x1",
        turns: [{
            id: "mocked-uuid",
            player: Player.HOST,
            action: Action.PICK,
            exclusivity: Exclusivity.NONEXCLUSIVE,
            hidden: false,
            parallel: false,
            executingPlayer: Player.GUEST
        } as Turn]
    };
    const preset = Preset.fromPojo(pojo) as Preset;
    expect(preset.presetId).toBeUndefined();
    expect(preset.categoryLimits).toEqual({pick: {}, ban: {}});
});


it('old preset with presetID but without categoryLimits can be deserialised', () => {
    const pojo = {
        name: "Preset name",
        encodedCivilisations: "0x1",
        turns: [{
            id: "mocked-uuid",
            player: Player.HOST,
            action: Action.PICK,
            exclusivity: Exclusivity.NONEXCLUSIVE,
            hidden: false,
            parallel: false,
            executingPlayer: Player.GUEST
        } as Turn],
        presetId: 'abcdef'
    };
    const preset = Preset.fromPojo(pojo) as Preset;
    expect(preset.presetId).toEqual('abcdef');
    expect(preset.categoryLimits).toEqual({pick: {}, ban: {}});
});


it('new preset with presetID categoryLimits can be deserialised', () => {
    const pojo = {
        name: "Preset name",
        encodedCivilisations: "0x1",
        turns: [{
            id: "mocked-uuid",
            player: Player.HOST,
            action: Action.PICK,
            exclusivity: Exclusivity.NONEXCLUSIVE,
            hidden: false,
            parallel: false,
            executingPlayer: Player.GUEST
        } as Turn],
        presetId: 'abcdef',
        categoryLimits: {pick: {default: 3}, ban: {default: 1}}
    };
    const preset = Preset.fromPojo(pojo) as Preset;
    expect(preset.presetId).toEqual('abcdef');
    expect(preset.categoryLimits).toEqual({pick: {default: 3}, ban: {default: 1}});
});


it('a preset made of options has one pool, the default one', () => {
    const preset = new Preset('Preset name', [Pool.defaultWith([new DraftOption('arabia')])], [Turn.HOST_PICK]);
    expect(preset.pools).toHaveLength(1);
    expect(preset.pools[0].id).toEqual(Pool.DEFAULT_ID);
    expect(preset.pools[0].name).toEqual('Default');
    expect(preset.pools[0].options.map(value => value.id)).toEqual(['arabia']);
    expect(preset.hasSeveralPools()).toBe(false);
});


it('a preset stored before there were pools loads its civilisations into the default pool', () => {
    const preset = Preset.fromPojo({name: 'Old', encodedCivilisations: '7ffffffff', turns: []}) as Preset;
    expect(preset.pools.map(value => value.id)).toEqual([Pool.DEFAULT_ID]);
    expect(preset.options.length).toBeGreaterThan(0);
    expect(preset.options.every(value => value.category === 'default')).toBe(true);
});


it('a preset stored before there were pools loads its draft options into the default pool', () => {
    const preset = Preset.fromPojo({name: 'Old', draftOptions: [{id: 'arabia', name: 'arabia'} as DraftOption], turns: []}) as Preset;
    expect(preset.pools.map(value => value.id)).toEqual([Pool.DEFAULT_ID]);
    expect(preset.options.map(value => value.id)).toEqual(['arabia']);
});


it('a preset is stored as its pools, never as the options of old', () => {
    const preset = new Preset('Preset name', [Pool.defaultWith(Civilisation.ALL_ACTIVE)], [Turn.HOST_PICK]);
    const pojo = JSON.parse(JSON.stringify(preset));
    expect(pojo.pools).toHaveLength(1);
    expect(pojo.pools[0]).toHaveProperty('encodedCivilisations');
    expect(pojo).not.toHaveProperty('encodedCivilisations');
    expect(pojo).not.toHaveProperty('draftOptions');
});


it('a preset stored as pools loads them as they are, one pool included', () => {
    const one = Preset.fromPojo({
        name: 'One pool', turns: [],
        pools: [{id: 'maps', name: 'Maps', draftOptions: [{id: 'arabia', name: 'arabia'}]}] as unknown as Pool[],
    }) as Preset;
    expect(one.pools.map(value => value.id)).toEqual(['maps']);
    expect(one.options.map(value => value.id)).toEqual(['arabia']);
});


it('the options of a preset are those of its pools in order', () => {
    const preset = new Preset('Preset name', [
        new Pool('maps', 'Maps', [new DraftOption('arabia'), new DraftOption('arena')]),
        new Pool('civs', 'Civilisations', [new DraftOption('Franks')]),
    ], [Turn.HOST_PICK]);
    expect(preset.options.map(value => value.id)).toEqual(['arabia', 'arena', 'Franks']);
    expect(preset.hasSeveralPools()).toBe(true);
});


it('pooled preset can be deserialised', () => {
    const pojo = {
        name: "Preset name",
        pools: [
            {id: 'maps', name: 'Maps', draftOptions: [{id: 'arabia', category: 'maps'} as DraftOption]},
            {id: 'civs', name: 'Civilisations', draftOptions: [{id: 'Franks', category: 'civs'} as DraftOption]},
        ] as Pool[],
        turns: [{
            id: "mocked-uuid",
            player: Player.HOST,
            action: Action.PICK,
            exclusivity: Exclusivity.NONEXCLUSIVE,
            hidden: false,
            parallel: false,
            executingPlayer: Player.HOST,
            poolId: 'maps'
        } as Turn]
    };
    const preset = Preset.fromPojo(pojo) as Preset;
    expect(preset.pools.map(value => value.id)).toEqual(['maps', 'civs']);
    expect(preset.options.map(value => value.id)).toEqual(['arabia', 'Franks']);
    expect(preset.turns[0].poolId).toEqual('maps');
});


it('a turn only offers the options of its own pool', () => {
    const maps = new Pool('maps', 'Maps', [new DraftOption('arabia')]);
    const civs = new Pool('civs', 'Civilisations', [new DraftOption('Franks'), new DraftOption('Britons')]);
    const mapTurn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST, ['default'], undefined, 'maps');
    const preset = new Preset('P', [maps, civs], [mapTurn]);
    expect(preset.optionsForTurn(mapTurn).map(value => value.id)).toEqual(['arabia']);
});


it('a turn of a preset with one pool offers every option', () => {
    const preset = new Preset('P', [Pool.defaultWith([new DraftOption('arabia'), new DraftOption('arena')])], [Turn.HOST_PICK]);
    expect(preset.optionsForTurn(Turn.HOST_PICK).map(value => value.id)).toEqual(['arabia', 'arena']);
});


it('an admin ban only draws from its own pool', () => {
    const maps = new Pool('maps', 'Maps', [new DraftOption('arabia')]);
    const civs = new Pool('civs', 'Civilisations', [new DraftOption('Franks'), new DraftOption('Britons')]);
    const adminBan = new Turn(Player.NONE, Action.BAN, Exclusivity.GLOBAL, false, false, Player.NONE, ['default'], undefined, 'civs');
    const preset = new Preset('P', [maps, civs], [adminBan]);
    expect(preset.optionsForTurn(adminBan).map(value => value.id)).toEqual(['Franks', 'Britons']);
});


it('a pool can be asked for its options by id, and a pool the preset lacks has none', () => {
    const maps = new Pool('maps', 'Maps', [new DraftOption('arabia')]);
    const civs = new Pool('civs', 'Civilisations', [new DraftOption('Franks'), new DraftOption('Britons')]);
    const preset = new Preset('P', [maps, civs], []);
    expect(preset.optionsForPool('civs').map(value => value.id)).toEqual(['Franks', 'Britons']);
    expect(preset.optionsForPool('gone')).toEqual([]);
});

it('a preset cannot be built without a pool', () => {
    expect(() => new Preset('No pools', [], [Turn.HOST_PICK])).toThrow();
});

it('a lone pool stored without a name is loaded as the Default one', () => {
    const loaded = Preset.fromPojo({
        name: 'Nameless', turns: [],
        pools: [{id: 'default', name: '', draftOptions: [{id: 'arabia', name: 'arabia'}]}] as unknown as Pool[],
    }) as Preset;
    expect(loaded.pools[0].name).toEqual('Default');
    const blank = Preset.fromPojo({
        name: 'Blank', turns: [],
        pools: [{id: 'default', name: '   ', draftOptions: []}] as unknown as Pool[],
    }) as Preset;
    expect(blank.pools[0].name).toEqual('Default');
    const two = Preset.fromPojo({
        name: 'Two', turns: [],
        pools: [{id: 'default', name: '', draftOptions: []}, {id: 'pool-2', name: 'Civs', draftOptions: []}] as unknown as Pool[],
    }) as Preset;
    expect(two.pools.map(value => value.name)).toEqual(['', 'Civs']);
});

it('a preset saved by this branch before the rename, with segments and segmentId, loads as pools', () => {
    const loaded = Preset.fromPojo({
        name: 'Renamed', presetId: undefined,
        segments: [{id: 'default', name: 'Maps', draftOptions: [{id: 'arabia', name: 'arabia'}]},
                   {id: 'segment-2', name: 'Civs', draftOptions: [{id: 'Franks', name: 'Franks'}]}] as unknown as Pool[],
        turns: [{player: 'HOST', action: 'PICK', exclusivity: 'GLOBAL', hidden: false, parallel: false,
                 executingPlayer: 'HOST', categories: ['default'], segmentId: 'segment-2'}] as unknown as Turn[],
    }) as Preset;
    expect(loaded.pools.map(value => value.id)).toEqual(['default', 'segment-2']);
    expect(loaded.turns[0].poolId).toEqual('segment-2');
    expect(JSON.parse(JSON.stringify(loaded))).not.toHaveProperty('segments');
});
