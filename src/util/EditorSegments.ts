import {IPresetEditorState} from "../types";
import DraftOption from "../models/DraftOption";
import Segment from "../models/Segment";

/** What the preset editor shows of the pools of the preset being edited. */
export const EditorSegments = {
    segments(state: IPresetEditorState): Segment[] {
        const preset = state.editorPreset;
        return preset === null ? [] : preset.segments;
    },

    /** The index of the pool on show, held within the pools there are. */
    activeIndex(state: IPresetEditorState): number {
        const segments = EditorSegments.segments(state);
        return Math.max(0, Math.min(state.activeSegment, segments.length - 1));
    },

    /** The options of the pool on show. */
    activeOptions(state: IPresetEditorState): DraftOption[] {
        const segments = EditorSegments.segments(state);
        return segments.length === 0 ? [] : segments[EditorSegments.activeIndex(state)].options;
    },

    /**
     * The number of a pool added to these: the lowest one, from two, whose id none of them carries.
     * The first pool is the default one, so a new pool is never the first.
     */
    nextSegmentNumber(segments: Segment[]): number {
        const existing = segments.map(value => value.id);
        let number = 2;
        while (existing.includes(Segment.idFor(number))) {
            number++;
        }
        return number;
    },
};
