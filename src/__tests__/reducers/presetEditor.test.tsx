import {initialPresetEditorState, presetEditorReducer} from "../../reducers/presetEditor";
import * as actions from "../../actions";
import Preset from "../../models/Preset";
import Pool from "../../models/Pool";
import Turn from "../../models/Turn";
import DraftOption from "../../models/DraftOption";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";
import {IPresetEditorState} from "../../types";

const turnIn = (poolId?: string) =>
    new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST, ['default'], undefined, poolId);

const stateWith = (preset: Preset, activePool: number = 0): IPresetEditorState =>
    ({...initialPresetEditorState, editorPreset: preset, activePool});

const maps = () => new Pool('default', 'Maps', [new DraftOption('arabia')]);
const civs = () => new Pool('pool-2', 'Civilisations', [new DraftOption('Franks')]);

it('adding a pool to a preset keeps its turns in the first one', () => {
    const flat = new Preset('P', [Pool.defaultWith([new DraftOption('arabia')])], [turnIn(), turnIn()]);
    const state = presetEditorReducer(stateWith(flat), actions.setEditorPools([maps(), civs()]));
    const preset = state.editorPreset as Preset;
    expect(preset.pools.map(value => value.id)).toEqual(['default', 'pool-2']);
    expect(preset.turns.map(value => value.poolId)).toEqual(['default', 'default']);
});

it('draft options are written into the active pool only', () => {
    const preset = new Preset('P', [maps(), civs()], [turnIn('default')]);
    const state = presetEditorReducer(stateWith(preset, 1),
        actions.setEditorDraftOptions([new DraftOption('Britons'), new DraftOption('Mayans')]));
    const pools = (state.editorPreset as Preset).pools;
    expect(pools[0].options.map(value => value.id)).toEqual(['arabia']);
    expect(pools[1].options.map(value => value.id)).toEqual(['Britons', 'Mayans']);
});

it('removing a pool moves its turns to the first remaining pool', () => {
    const preset = new Preset('P', [maps(), civs(), new Pool('pool-3', 'Third', [new DraftOption('nomad')])], [turnIn('default'), turnIn('pool-2')]);
    const state = presetEditorReducer(stateWith(preset), actions.setEditorPools([maps(), new Pool('pool-3', 'Third', [])]));
    const result = state.editorPreset as Preset;
    expect(result.pools.map(value => value.id)).toEqual(['default', 'pool-3']);
    expect(result.turns.map(value => value.poolId)).toEqual(['default', 'default']);
});

it('the one pool left takes the default id, and every turn goes with it', () => {
    const preset = new Preset('P', [maps(), civs()], [turnIn('default'), turnIn('pool-2')]);
    const state = presetEditorReducer(stateWith(preset), actions.setEditorPools([civs()]));
    const result = state.editorPreset as Preset;
    expect(result.pools.map(value => value.id)).toEqual(['default']);
    expect(result.options.map(value => value.id)).toEqual(['Franks']);
    expect(result.turns.map(value => value.poolId)).toEqual(['default', 'default']);
});

it('a preset is never left without a pool', () => {
    const preset = new Preset('P', [maps(), civs()], [turnIn('default')]);
    const state = presetEditorReducer(stateWith(preset), actions.setEditorPools([]));
    expect((state.editorPreset as Preset).pools).toHaveLength(2);
});

it('reveal turns are left alone when pools change', () => {
    const reveal = new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL);
    const preset = new Preset('P', [maps(), civs()], [reveal]);
    const state = presetEditorReducer(stateWith(preset), actions.setEditorPools([civs(), maps()]));
    const result = state.editorPreset as Preset;
    expect(result.turns[0].poolId).toEqual('default');
});

it('the active pool index is clamped and reset with a new preset', () => {
    const three = new Preset('P', [maps(), civs(), new Pool('pool-3', 'Third', [new DraftOption('Britons')])], [turnIn('default')]);
    const shrunk = presetEditorReducer(stateWith(three, 2), actions.setEditorPools([maps(), civs()]));
    expect(shrunk.activePool).toEqual(1);
    const reloaded = presetEditorReducer(stateWith(three, 2), actions.setEditorPreset(Preset.SIMPLE));
    expect(reloaded.activePool).toEqual(0);
});

it('the first pool keeps the id that turns without one point at', () => {
    const preset = new Preset('P', [maps(), civs(), new Pool('pool-3', 'Third', [new DraftOption('Britons')])], [turnIn('default'), turnIn('pool-2')]);
    const state = presetEditorReducer(stateWith(preset), actions.setEditorPools([civs(),
        new Pool('pool-3', 'Third', [new DraftOption('Britons')])]));
    const result = state.editorPreset as Preset;
    expect(result.pools.map(value => value.id)).toEqual(['default', 'pool-3']);
    // The turns of the pool that took the default id come with it.
    expect(result.turns.map(value => value.poolId)).toEqual(['default', 'default']);
});

it('a category limit goes when the pool that used the category does', () => {
    const land = new Pool('default', 'Maps', [new DraftOption('arabia', 'arabia', undefined, '', 'land')]);
    const civ = new Pool('pool-2', 'Civs', [new DraftOption('Franks', 'Franks', undefined, '', 'civ')]);
    const preset = new Preset('P', [land, civ], [turnIn('default')], undefined,
        {pick: {land: 2, civ: 1}, ban: {}});
    const state = presetEditorReducer(stateWith(preset), actions.setEditorPools([civ]));
    expect((state.editorPreset as Preset).categoryLimits).toEqual({pick: {civ: 1}, ban: {}});
});

it('pools survive renaming, reordering and category limit edits', () => {
    const preset = new Preset('P', [maps(), civs()], [turnIn('default'), turnIn('pool-2')]);
    const renamed = presetEditorReducer(stateWith(preset), actions.setEditorName('New name'));
    expect((renamed.editorPreset as Preset).pools).toHaveLength(2);

    const reordered = presetEditorReducer(stateWith(preset), actions.setEditorTurnOrder([turnIn('pool-2')]));
    expect((reordered.editorPreset as Preset).pools).toHaveLength(2);

    const limited = presetEditorReducer(stateWith(preset), actions.setEditorCategoryLimitPick('default', 2));
    expect((limited.editorPreset as Preset).pools).toHaveLength(2);

    const banLimited = presetEditorReducer(stateWith(preset), actions.setEditorCategoryLimitBan('default', 1));
    expect((banLimited.editorPreset as Preset).pools).toHaveLength(2);
});

it('a duplicated turn stays in its pool', () => {
    const preset = new Preset('P', [maps(), civs()], [turnIn('pool-2')]);
    const state = presetEditorReducer(stateWith(preset), actions.duplicateEditorTurn(0));
    const turns = (state.editorPreset as Preset).turns;
    expect(turns).toHaveLength(2);
    expect(turns.map(value => value.poolId)).toEqual(['pool-2', 'pool-2']);
});

it('category limits of other pools survive editing the active pool', () => {
    const tagged = (id: string, category: string) =>
        new DraftOption(id, id, DraftOption.defaultImageUrlsForCivilisation(id), '', category);
    const preset = new Preset('P', [new Pool('default', 'Maps', [tagged('arabia', 'maps')]),
         new Pool('pool-2', 'Civilisations', [tagged('Franks', 'civs')])], [turnIn('default'), turnIn('pool-2')], undefined,
        {pick: {maps: 2, civs: 1}, ban: {}});
    const state = presetEditorReducer(stateWith(preset, 1), actions.setEditorDraftOptions([tagged('Britons', 'civs')]));
    expect((state.editorPreset as Preset).categoryLimits.pick).toEqual({maps: 2, civs: 1});
});

it('the names of the pools pass through as they are', () => {
    const named = (pools: Pool[]) => pools.map(value => value.name);
    const two = [new Pool('default', 'Default', []), new Pool('pool-2', 'Pool 2', [])];
    const state = presetEditorReducer(stateWith(new Preset('P', two, [turnIn('default')])),
        actions.setEditorPools([...two, new Pool('pool-3', 'Pool 3', [])]));
    expect(named((state.editorPreset as Preset).pools)).toEqual(['Default', 'Pool 2', 'Pool 3']);
});

it('turns handed back by the drag-and-drop list are rebuilt as real turns', () => {
    const preset = new Preset('P', [maps(), civs()], [turnIn('default')]);
    // react-sortablejs spreads the items, so they come back as plain objects
    const dragged = JSON.parse(JSON.stringify([turnIn('pool-2'), turnIn('default')])) as Turn[];
    const state = presetEditorReducer(stateWith(preset), actions.setEditorTurnOrder(dragged));
    const turns = (state.editorPreset as Preset).turns;
    expect(turns.map(value => value.poolId)).toEqual(['pool-2', 'default']);
    expect(turns.every(value => typeof value.choosesDraftOption === 'function')).toBe(true);
});

it('a pool left alone without a name goes by the default one', () => {
    const blank = new Pool('default', '', [new DraftOption('arabia')]);
    const preset = new Preset('P', [blank, civs()], [turnIn('default'), turnIn('pool-2')]);
    const state = presetEditorReducer(stateWith(preset, 1), actions.setEditorPools([blank]));
    expect((state.editorPreset as Preset).pools.map(value => value.name)).toEqual(['Default']);
    expect(state.activePool).toEqual(0);
});
