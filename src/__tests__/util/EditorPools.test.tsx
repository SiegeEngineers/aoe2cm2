import {EditorPools} from "../../util/EditorPools";
import {IPresetEditorState} from "../../types";
import Preset from "../../models/Preset";
import Pool from "../../models/Pool";
import DraftOption from "../../models/DraftOption";

const maps = new Pool('default', 'Maps', [new DraftOption('arabia')]);
const civs = new Pool('pool-2', 'Civilisations', [new DraftOption('Franks')]);

const stateWith = (preset: Preset | null, activePool: number = 0): IPresetEditorState =>
    ({editorPreset: preset, activePool});

const pooled = new Preset('P', [maps, civs], []);

it('a preset offers its pools, and no preset offers none', () => {
    const flat = new Preset('P', [Pool.defaultWith([new DraftOption('arabia')])], []);
    expect(EditorPools.pools(stateWith(flat)).map(value => value.id)).toEqual([Pool.DEFAULT_ID]);
    expect(EditorPools.pools(stateWith(null))).toEqual([]);
});

it('the options shown are those of the pool on show', () => {
    expect(EditorPools.activeOptions(stateWith(pooled, 1)).map(value => value.id)).toEqual(['Franks']);
});

it('a preset with one pool offers all of its options whatever the index', () => {
    const flat = new Preset('P', [Pool.defaultWith([new DraftOption('arabia'), new DraftOption('arena')])], []);
    expect(EditorPools.activeOptions(stateWith(flat, 3)).map(value => value.id)).toEqual(['arabia', 'arena']);
});

it('an index past the last pool is read as the last one', () => {
    expect(EditorPools.activeIndex(stateWith(pooled, 7))).toEqual(1);
    expect(EditorPools.activeIndex(stateWith(pooled, 0))).toEqual(0);
});

it('a new pool takes the lowest number from two that no pool carries', () => {
    expect(EditorPools.nextPoolNumber([maps])).toEqual(2);
    expect(EditorPools.nextPoolNumber([maps, civs])).toEqual(3);
    expect(EditorPools.nextPoolNumber([maps, new Pool('pool-3', 'Third', [])])).toEqual(2);
});
