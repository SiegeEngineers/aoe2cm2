import Preset from "../../models/Preset";
import Turn from "../../models/Turn";
import DraftOption from "../../models/DraftOption";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";
import {PresetCombiner} from "../../util/PresetCombiner";
import {Validator} from "../../models/Validator";
import Pool from "../../models/Pool";

const pick = (player: Player) => new Turn(player, Action.PICK, Exclusivity.GLOBAL);
const maps = () => new Preset('Maps', [Pool.defaultWith([new DraftOption('arabia'), new DraftOption('arena')])],
    [pick(Player.HOST), pick(Player.GUEST)]);
const civs = () => new Preset('Civilisations', [Pool.defaultWith([new DraftOption('Franks'), new DraftOption('Britons')])],
    [pick(Player.GUEST), pick(Player.HOST)]);

it('combines two presets into one with a pool each', () => {
    const combined = PresetCombiner.combine(maps(), civs(), 'Maps + Civilisations');
    const pools = combined.pools;
    expect(pools.map(value => value.name)).toEqual(['Maps', 'Civilisations']);
    expect(pools[0].options.map(value => value.id)).toEqual(['arabia', 'arena']);
    expect(pools[1].options.map(value => value.id)).toEqual(['Franks', 'Britons']);
});

it('keeps the turns of both presets in order and pauses between them', () => {
    const combined = PresetCombiner.combine(maps(), civs(), 'Maps + Civilisations');
    expect(combined.turns.map(value => value.action)).toEqual(
        [Action.PICK, Action.PICK, Action.PAUSE, Action.PICK, Action.PICK]);
    expect(combined.turns.map(value => value.poolId)).toEqual(
        ['default', 'default', 'default', 'pool-2', 'pool-2']);
    expect(combined.turns.map(value => value.player)).toEqual(
        [Player.HOST, Player.GUEST, Player.NONE, Player.GUEST, Player.HOST]);
});

it('produces a preset the server accepts', () => {
    const combined = PresetCombiner.combine(maps(), civs(), 'Maps + Civilisations');
    expect(Validator.validatePreset(combined)).toEqual([]);
});

it('does not carry the turn ids of either preset into the combined one', () => {
    const shared = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST,
        ['default'], 'shared-id');
    const first = new Preset('First', [Pool.defaultWith([new DraftOption('arabia')])], [shared]);
    const second = new Preset('Second', [Pool.defaultWith([new DraftOption('Franks')])], [shared]);
    const combined = PresetCombiner.combine(first, second, 'Both');
    expect(combined.turns.map(value => value.id)).not.toContain('shared-id');
});

it('reports a category limit that would reach the other preset', () => {
    const limited = new Preset('Maps', [Pool.defaultWith([new DraftOption('arabia')])], [pick(Player.HOST)], undefined,
        {pick: {default: 2}, ban: {}});
    const unlimited = new Preset('Civs', [Pool.defaultWith([new DraftOption('Franks')])], [pick(Player.GUEST)]);
    // Both presets leave their options in the default category, so the limit would bind both halves.
    expect(PresetCombiner.leakingCategories(limited, unlimited)).toEqual(['default']);
});

it('leaves presets alone whose limited categories the other one does not use', () => {
    const maps = new Preset('Maps', [Pool.defaultWith([new DraftOption('arabia', 'arabia', undefined, '', 'land')])],
        [pick(Player.HOST)], undefined, {pick: {land: 2}, ban: {}});
    const civs = new Preset('Civs', [Pool.defaultWith([new DraftOption('Franks', 'Franks', undefined, '', 'civ')])],
        [pick(Player.GUEST)]);
    expect(PresetCombiner.leakingCategories(maps, civs)).toEqual([]);
});

it('takes the looser of two limits on the same category', () => {
    const first = new Preset('First', [Pool.defaultWith([new DraftOption('arabia')])], [pick(Player.HOST)], undefined,
        {pick: {default: 1}, ban: {}});
    const second = new Preset('Second', [Pool.defaultWith([new DraftOption('Franks')])], [pick(Player.GUEST)], undefined,
        {pick: {default: 3}, ban: {other: 2}});
    const combined = PresetCombiner.combine(first, second, 'Both');
    expect(combined.categoryLimits).toEqual({pick: {default: 3}, ban: {other: 2}});
});

it('reports option ids that both presets use', () => {
    const clashing = new Preset('Other maps', [Pool.defaultWith([new DraftOption('arabia')])], [pick(Player.HOST)]);
    expect(PresetCombiner.sharedOptionIds(maps(), clashing)).toEqual(['arabia']);
    expect(PresetCombiner.sharedOptionIds(maps(), civs())).toEqual([]);
});

it('keeps the category limits of both presets', () => {
    const first = new Preset('Maps', [Pool.defaultWith([new DraftOption('arabia')])], [pick(Player.HOST)], undefined,
        {pick: {default: 2}, ban: {}});
    const second = new Preset('Civilisations', [Pool.defaultWith([new DraftOption('Franks')])], [pick(Player.GUEST)], undefined,
        {pick: {}, ban: {default: 1}});
    const combined = PresetCombiner.combine(first, second, 'Both');
    expect(combined.categoryLimits).toEqual({pick: {default: 2}, ban: {default: 1}});
});

it('keeps the pools a preset already has, under ids of the combined preset', () => {
    const pooled = new Preset('Pooled', [
        new Pool('default', 'Land', [new DraftOption('arabia')]),
        new Pool('pool-2', 'Water', [new DraftOption('islands')]),
    ], [
        Turn.withPoolId(pick(Player.HOST), 'default'),
        Turn.withPoolId(pick(Player.GUEST), 'pool-2'),
    ]);
    const combined = PresetCombiner.combine(pooled, civs(), 'Pooled + Civilisations');
    expect(combined.pools.map(value => value.id)).toEqual(['default', 'pool-2', 'pool-3']);
    expect(combined.pools.map(value => value.name)).toEqual(['Land', 'Water', 'Civilisations']);
    expect(combined.turns.map(value => value.poolId)).toEqual(
        ['default', 'pool-2', 'default', 'pool-3', 'pool-3']);
    expect(Validator.validatePreset(combined)).toEqual([]);
});

it('a pool with a name of its own keeps it, even as the only pool of its preset', () => {
    const named = new Preset('Water maps', [new Pool('default', 'Islands', [new DraftOption('islands')])], [pick(Player.HOST)]);
    const combined = PresetCombiner.combine(named, civs(), 'Water + Civilisations');
    expect(combined.pools.map(value => value.name)).toEqual(['Islands', 'Civilisations']);
});

it('a pool called Default among several keeps its name, since it was named so on purpose', () => {
    const named = new Preset('Two pools', [new Pool('default', 'Default', [new DraftOption('arabia')]),
        new Pool('pool-2', 'Water', [new DraftOption('islands')])], [pick(Player.HOST)]);
    const combined = PresetCombiner.combine(named, civs(), 'Two + Civilisations');
    expect(combined.pools.map(value => value.name)).toEqual(['Default', 'Water', 'Civilisations']);
});
