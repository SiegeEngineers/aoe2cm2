import {initialPresetEditorState, presetEditorReducer} from "../../reducers/presetEditor";
import * as actions from "../../actions";
import Preset from "../../models/Preset";
import Segment from "../../models/Segment";
import Turn from "../../models/Turn";
import DraftOption from "../../models/DraftOption";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";
import {IPresetEditorState} from "../../types";

const turnIn = (segmentId?: string) =>
    new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST, ['default'], undefined, segmentId);

const stateWith = (preset: Preset, activeSegment: number = 0): IPresetEditorState =>
    ({...initialPresetEditorState, editorPreset: preset, activeSegment});

const maps = () => new Segment('default', 'Maps', [new DraftOption('arabia')]);
const civs = () => new Segment('segment-2', 'Civilisations', [new DraftOption('Franks')]);

it('adding a pool to a preset keeps its turns in the first one', () => {
    const flat = new Preset('P', [Segment.defaultWith([new DraftOption('arabia')])], [turnIn(), turnIn()]);
    const state = presetEditorReducer(stateWith(flat), actions.setEditorSegments([maps(), civs()]));
    const preset = state.editorPreset as Preset;
    expect(preset.segments.map(value => value.id)).toEqual(['default', 'segment-2']);
    expect(preset.turns.map(value => value.segmentId)).toEqual(['default', 'default']);
});

it('draft options are written into the active pool only', () => {
    const preset = new Preset('P', [maps(), civs()], [turnIn('default')]);
    const state = presetEditorReducer(stateWith(preset, 1),
        actions.setEditorDraftOptions([new DraftOption('Britons'), new DraftOption('Mayans')]));
    const segments = (state.editorPreset as Preset).segments;
    expect(segments[0].options.map(value => value.id)).toEqual(['arabia']);
    expect(segments[1].options.map(value => value.id)).toEqual(['Britons', 'Mayans']);
});

it('removing a pool moves its turns to the first remaining pool', () => {
    const preset = new Preset('P', [maps(), civs(), new Segment('segment-3', 'Third', [new DraftOption('nomad')])], [turnIn('default'), turnIn('segment-2')]);
    const state = presetEditorReducer(stateWith(preset), actions.setEditorSegments([maps(), new Segment('segment-3', 'Third', [])]));
    const result = state.editorPreset as Preset;
    expect(result.segments.map(value => value.id)).toEqual(['default', 'segment-3']);
    expect(result.turns.map(value => value.segmentId)).toEqual(['default', 'default']);
});

it('the one pool left takes the default id, and every turn goes with it', () => {
    const preset = new Preset('P', [maps(), civs()], [turnIn('default'), turnIn('segment-2')]);
    const state = presetEditorReducer(stateWith(preset), actions.setEditorSegments([civs()]));
    const result = state.editorPreset as Preset;
    expect(result.segments.map(value => value.id)).toEqual(['default']);
    expect(result.options.map(value => value.id)).toEqual(['Franks']);
    expect(result.turns.map(value => value.segmentId)).toEqual(['default', 'default']);
});

it('a preset is never left without a pool', () => {
    const preset = new Preset('P', [maps(), civs()], [turnIn('default')]);
    const state = presetEditorReducer(stateWith(preset), actions.setEditorSegments([]));
    expect((state.editorPreset as Preset).segments).toHaveLength(2);
});

it('reveal turns are left alone when pools change', () => {
    const reveal = new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL);
    const preset = new Preset('P', [maps(), civs()], [reveal]);
    const state = presetEditorReducer(stateWith(preset), actions.setEditorSegments([civs(), maps()]));
    const result = state.editorPreset as Preset;
    expect(result.turns[0].segmentId).toEqual('default');
});

it('the active pool index is clamped and reset with a new preset', () => {
    const three = new Preset('P', [maps(), civs(), new Segment('segment-3', 'Third', [new DraftOption('Britons')])], [turnIn('default')]);
    const shrunk = presetEditorReducer(stateWith(three, 2), actions.setEditorSegments([maps(), civs()]));
    expect(shrunk.activeSegment).toEqual(1);
    const reloaded = presetEditorReducer(stateWith(three, 2), actions.setEditorPreset(Preset.SIMPLE));
    expect(reloaded.activeSegment).toEqual(0);
});

it('the first pool keeps the id that turns without one point at', () => {
    const preset = new Preset('P', [maps(), civs(), new Segment('segment-3', 'Third', [new DraftOption('Britons')])], [turnIn('default'), turnIn('segment-2')]);
    const state = presetEditorReducer(stateWith(preset), actions.setEditorSegments([civs(),
        new Segment('segment-3', 'Third', [new DraftOption('Britons')])]));
    const result = state.editorPreset as Preset;
    expect(result.segments.map(value => value.id)).toEqual(['default', 'segment-3']);
    // The turns of the pool that took the default id come with it.
    expect(result.turns.map(value => value.segmentId)).toEqual(['default', 'default']);
});

it('a category limit goes when the pool that used the category does', () => {
    const land = new Segment('default', 'Maps', [new DraftOption('arabia', 'arabia', undefined, '', 'land')]);
    const civ = new Segment('segment-2', 'Civs', [new DraftOption('Franks', 'Franks', undefined, '', 'civ')]);
    const preset = new Preset('P', [land, civ], [turnIn('default')], undefined,
        {pick: {land: 2, civ: 1}, ban: {}});
    const state = presetEditorReducer(stateWith(preset), actions.setEditorSegments([civ]));
    expect((state.editorPreset as Preset).categoryLimits).toEqual({pick: {civ: 1}, ban: {}});
});

it('pools survive renaming, reordering and category limit edits', () => {
    const preset = new Preset('P', [maps(), civs()], [turnIn('default'), turnIn('segment-2')]);
    const renamed = presetEditorReducer(stateWith(preset), actions.setEditorName('New name'));
    expect((renamed.editorPreset as Preset).segments).toHaveLength(2);

    const reordered = presetEditorReducer(stateWith(preset), actions.setEditorTurnOrder([turnIn('segment-2')]));
    expect((reordered.editorPreset as Preset).segments).toHaveLength(2);

    const limited = presetEditorReducer(stateWith(preset), actions.setEditorCategoryLimitPick('default', 2));
    expect((limited.editorPreset as Preset).segments).toHaveLength(2);

    const banLimited = presetEditorReducer(stateWith(preset), actions.setEditorCategoryLimitBan('default', 1));
    expect((banLimited.editorPreset as Preset).segments).toHaveLength(2);
});

it('a duplicated turn stays in its pool', () => {
    const preset = new Preset('P', [maps(), civs()], [turnIn('segment-2')]);
    const state = presetEditorReducer(stateWith(preset), actions.duplicateEditorTurn(0));
    const turns = (state.editorPreset as Preset).turns;
    expect(turns).toHaveLength(2);
    expect(turns.map(value => value.segmentId)).toEqual(['segment-2', 'segment-2']);
});

it('category limits of other pools survive editing the active pool', () => {
    const tagged = (id: string, category: string) =>
        new DraftOption(id, id, DraftOption.defaultImageUrlsForCivilisation(id), '', category);
    const preset = new Preset('P', [new Segment('default', 'Maps', [tagged('arabia', 'maps')]),
         new Segment('segment-2', 'Civilisations', [tagged('Franks', 'civs')])], [turnIn('default'), turnIn('segment-2')], undefined,
        {pick: {maps: 2, civs: 1}, ban: {}});
    const state = presetEditorReducer(stateWith(preset, 1), actions.setEditorDraftOptions([tagged('Britons', 'civs')]));
    expect((state.editorPreset as Preset).categoryLimits.pick).toEqual({maps: 2, civs: 1});
});

it('every pool gets a numbered name, not its id', () => {
    const named = (segments: Segment[]) => segments.map(value => value.name);
    const two = [new Segment('default', 'Pool 1', []), new Segment('segment-2', 'Pool 2', [])];
    const state = presetEditorReducer(stateWith(new Preset('P', two, [turnIn('default')])),
        actions.setEditorSegments([...two, new Segment('segment-3', 'Pool 3', [])]));
    expect(named((state.editorPreset as Preset).segments)).toEqual(['Pool 1', 'Pool 2', 'Pool 3']);
});

it('turns handed back by the drag-and-drop list are rebuilt as real turns', () => {
    const preset = new Preset('P', [maps(), civs()], [turnIn('default')]);
    // react-sortablejs spreads the items, so they come back as plain objects
    const dragged = JSON.parse(JSON.stringify([turnIn('segment-2'), turnIn('default')])) as Turn[];
    const state = presetEditorReducer(stateWith(preset), actions.setEditorTurnOrder(dragged));
    const turns = (state.editorPreset as Preset).turns;
    expect(turns.map(value => value.segmentId)).toEqual(['segment-2', 'default']);
    expect(turns.every(value => typeof value.choosesDraftOption === 'function')).toBe(true);
});
