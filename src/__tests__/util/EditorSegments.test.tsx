import {EditorSegments} from "../../util/EditorSegments";
import {ApplicationState} from "../../types";
import Preset from "../../models/Preset";
import Segment from "../../models/Segment";
import DraftOption from "../../models/DraftOption";

const maps = new Segment('default', 'Maps', [new DraftOption('arabia')]);
const civs = new Segment('segment-2', 'Civilisations', [new DraftOption('Franks')]);

const stateWith = (preset: Preset | null, activeSegment: number = 0) =>
    ({presetEditor: {editorPreset: preset, activeSegment}}) as ApplicationState;

const segmented = new Preset('P', [], [], undefined, undefined, [maps, civs]);

it('a preset without pools has none to offer', () => {
    const flat = new Preset('P', [new DraftOption('arabia')], []);
    expect(EditorSegments.segments(stateWith(flat))).toEqual([]);
    expect(EditorSegments.segments(stateWith(null))).toEqual([]);
});

it('the options shown are those of the pool on show', () => {
    expect(EditorSegments.activeOptions(stateWith(segmented, 1)).map(value => value.id)).toEqual(['Franks']);
});

it('a preset without pools offers all of its options', () => {
    const flat = new Preset('P', [new DraftOption('arabia'), new DraftOption('arena')], []);
    expect(EditorSegments.activeOptions(stateWith(flat, 3)).map(value => value.id)).toEqual(['arabia', 'arena']);
});

it('an index past the last pool is read as the last one', () => {
    expect(EditorSegments.activeIndex(stateWith(segmented, 7))).toEqual(1);
    expect(EditorSegments.activeIndex(stateWith(segmented, 0))).toEqual(0);
});

it('the first pool takes the default id and later ones are numbered from two', () => {
    expect(EditorSegments.nextSegmentId([])).toEqual(Segment.DEFAULT_ID);
    expect(EditorSegments.nextSegmentId([maps])).toEqual('segment-2');
    expect(EditorSegments.nextSegmentId([maps, civs])).toEqual('segment-3');
});
