import Preset from "../../models/Preset";
import Turn from "../../models/Turn";
import Exclusivity from "../../constants/Exclusivity";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Segment from "../../models/Segment";
import DraftOption from "../../models/DraftOption";
import Civilisation from "../../models/Civilisation";
import {Validator} from "../../models/Validator";

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



it('legacy preset with encoded civilisations exposes one implicit default segment', () => {
    const preset = new Preset('Preset name', Civilisation.ALL_ACTIVE, [Turn.HOST_PICK]);
    const segments = preset.segmentsOrDefault();
    expect(segments).toHaveLength(1);
    expect(segments[0].id).toEqual(Segment.DEFAULT_ID);
    expect(segments[0].options.map(value => value.id)).toEqual(preset.options.map(value => value.id));
});


it('legacy preset with draft options exposes one implicit default segment', () => {
    const preset = new Preset('Preset name', [new DraftOption('arabia')], [Turn.HOST_PICK]);
    const segments = preset.segmentsOrDefault();
    expect(segments).toHaveLength(1);
    expect(segments[0].id).toEqual(Segment.DEFAULT_ID);
    expect(segments[0].options.map(value => value.id)).toEqual(['arabia']);
});


it('legacy preset does not serialise a segments property', () => {
    const preset = new Preset('Preset name', [new DraftOption('arabia')], [Turn.HOST_PICK]);
    expect(JSON.parse(JSON.stringify(preset))).not.toHaveProperty('segments');
});


it('segmented preset flattens its segment options in order', () => {
    const preset = new Preset('Preset name', [], [Turn.HOST_PICK], undefined, undefined, [
        new Segment('maps', 'Maps', [new DraftOption('arabia'), new DraftOption('arena')]),
        new Segment('civs', 'Civilisations', [new DraftOption('Franks')]),
    ]);
    expect(preset.options.map(value => value.id)).toEqual(['arabia', 'arena', 'Franks']);
});


it('segmented preset does not serialise legacy option fields', () => {
    const preset = new Preset('Preset name', [], [Turn.HOST_PICK], undefined, undefined, [
        new Segment('maps', 'Maps', [new DraftOption('arabia')]),
    ]);
    const pojo = JSON.parse(JSON.stringify(preset));
    expect(pojo).toHaveProperty('segments');
    expect(pojo).not.toHaveProperty('encodedCivilisations');
    expect(pojo).not.toHaveProperty('draftOptions');
});


it('segmented preset can be deserialised', () => {
    const pojo = {
        name: "Preset name",
        segments: [
            {id: 'maps', name: 'Maps', draftOptions: [{id: 'arabia', category: 'maps'} as DraftOption]},
            {id: 'civs', name: 'Civilisations', draftOptions: [{id: 'Franks', category: 'civs'} as DraftOption]},
        ] as Segment[],
        turns: [{
            id: "mocked-uuid",
            player: Player.HOST,
            action: Action.PICK,
            exclusivity: Exclusivity.NONEXCLUSIVE,
            hidden: false,
            parallel: false,
            executingPlayer: Player.HOST,
            segmentId: 'maps'
        } as Turn]
    };
    const preset = Preset.fromPojo(pojo) as Preset;
    expect(preset.segmentsOrDefault().map(value => value.id)).toEqual(['maps', 'civs']);
    expect(preset.options.map(value => value.id)).toEqual(['arabia', 'Franks']);
    expect(preset.turns[0].segmentIdOrDefault()).toEqual('maps');
});


it('a turn only offers the options of its own pool', () => {
    const maps = new Segment('maps', 'Maps', [new DraftOption('arabia')]);
    const civs = new Segment('civs', 'Civilisations', [new DraftOption('Franks'), new DraftOption('Britons')]);
    const mapTurn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST, ['default'], undefined, 'maps');
    const preset = new Preset('P', [], [mapTurn], undefined, undefined, [maps, civs]);
    expect(preset.optionsForTurn(mapTurn).map(value => value.id)).toEqual(['arabia']);
});


it('a turn of a preset without pools offers every option', () => {
    const preset = new Preset('P', [new DraftOption('arabia'), new DraftOption('arena')], [Turn.HOST_PICK]);
    expect(preset.optionsForTurn(Turn.HOST_PICK).map(value => value.id)).toEqual(['arabia', 'arena']);
});


it('an admin ban only draws from its own pool', () => {
    const maps = new Segment('maps', 'Maps', [new DraftOption('arabia')]);
    const civs = new Segment('civs', 'Civilisations', [new DraftOption('Franks'), new DraftOption('Britons')]);
    const adminBan = new Turn(Player.NONE, Action.BAN, Exclusivity.GLOBAL, false, false, Player.NONE, ['default'], undefined, 'civs');
    const preset = new Preset('P', [], [adminBan], undefined, undefined, [maps, civs]);
    expect(preset.optionsForTurn(adminBan).map(value => value.id)).toEqual(['Franks', 'Britons']);
});


it('a pool can be asked for its options by id', () => {
    const maps = new Segment('maps', 'Maps', [new DraftOption('arabia')]);
    const civs = new Segment('civs', 'Civilisations', [new DraftOption('Franks'), new DraftOption('Britons')]);
    const preset = new Preset('P', [], [], undefined, undefined, [maps, civs]);
    expect(preset.optionsForSegment('civs').map(value => value.id)).toEqual(['Franks', 'Britons']);
    expect(preset.optionsForSegment(undefined).map(value => value.id)).toEqual(['arabia', 'Franks', 'Britons']);
    expect(preset.optionsForSegment('gone')).toEqual([]);
});


it('a single pool comes away with its turns, so the preset it becomes is valid', () => {
    const pojo = {
        name: 'One pool called maps',
        turns: [{
            player: Player.HOST, action: Action.PICK, exclusivity: Exclusivity.GLOBAL, hidden: false,
            parallel: false, executingPlayer: Player.HOST, categories: ['default'], segmentId: 'maps',
        }],
        segments: [{id: 'maps', name: 'Maps', draftOptions: [{id: 'arabia', name: 'arabia'}]}],
    };
    const preset = Preset.fromPojo(pojo as any) as Preset;
    expect(preset.segments).toBeUndefined();
    expect(preset.options.map(value => value.id)).toEqual(['arabia']);
    expect(preset.turns[0].segmentId).toBeUndefined();
    expect(Validator.validatePreset(preset)).toEqual([]);
});
