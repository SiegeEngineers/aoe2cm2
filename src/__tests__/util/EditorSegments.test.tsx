import {EditorSegments} from "../../util/EditorSegments";
import {IPresetEditorState} from "../../types";
import Preset from "../../models/Preset";
import Segment from "../../models/Segment";
import DraftOption from "../../models/DraftOption";

const maps = new Segment('default', 'Maps', [new DraftOption('arabia')]);
const civs = new Segment('segment-2', 'Civilisations', [new DraftOption('Franks')]);

const stateWith = (preset: Preset | null, activeSegment: number = 0): IPresetEditorState =>
    ({editorPreset: preset, activeSegment});

const segmented = new Preset('P', [maps, civs], []);

it('a preset offers its pools, and no preset offers none', () => {
    const flat = new Preset('P', [Segment.defaultWith([new DraftOption('arabia')])], []);
    expect(EditorSegments.segments(stateWith(flat)).map(value => value.id)).toEqual([Segment.DEFAULT_ID]);
    expect(EditorSegments.segments(stateWith(null))).toEqual([]);
});

it('the options shown are those of the pool on show', () => {
    expect(EditorSegments.activeOptions(stateWith(segmented, 1)).map(value => value.id)).toEqual(['Franks']);
});

it('a preset with one pool offers all of its options whatever the index', () => {
    const flat = new Preset('P', [Segment.defaultWith([new DraftOption('arabia'), new DraftOption('arena')])], []);
    expect(EditorSegments.activeOptions(stateWith(flat, 3)).map(value => value.id)).toEqual(['arabia', 'arena']);
});

it('an index past the last pool is read as the last one', () => {
    expect(EditorSegments.activeIndex(stateWith(segmented, 7))).toEqual(1);
    expect(EditorSegments.activeIndex(stateWith(segmented, 0))).toEqual(0);
});

it('a new pool takes the lowest number from two that no pool carries', () => {
    expect(EditorSegments.nextSegmentNumber([maps])).toEqual(2);
    expect(EditorSegments.nextSegmentNumber([maps, civs])).toEqual(3);
    expect(EditorSegments.nextSegmentNumber([maps, new Segment('segment-3', 'Third', [])])).toEqual(2);
});
