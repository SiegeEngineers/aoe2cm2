import {ApplicationState} from "../types";
import DraftOption from "../models/DraftOption";
import Segment from "../models/Segment";

export const EditorSegments = {
    segments(state: ApplicationState): Segment[] {
        const preset = state.presetEditor.editorPreset;
        if (preset === null || preset.segments === undefined) {
            return [];
        }
        return preset.segments;
    },

    activeIndex(state: ApplicationState): number {
        const segments = EditorSegments.segments(state);
        if (segments.length === 0) {
            return 0;
        }
        return Math.min(state.presetEditor.activeSegment, segments.length - 1);
    },

    activeOptions(state: ApplicationState): DraftOption[] {
        const preset = state.presetEditor.editorPreset;
        if (preset === null) {
            return [];
        }
        const segments = EditorSegments.segments(state);
        if (segments.length === 0) {
            return preset.options;
        }
        return segments[EditorSegments.activeIndex(state)].options;
    },

    /** The first pool keeps the default id, so turns that carry none of their own belong to it. */
    nextSegmentId(segments: Segment[]): string {
        if (segments.length === 0) {
            return Segment.DEFAULT_ID;
        }
        const existing = segments.map(value => value.id);
        let index = 2;
        while (existing.includes(`segment-${index}`)) {
            index++;
        }
        return `segment-${index}`;
    },

    /** The number in a pool id, which is what a pool made with it is named after. */
    numberOf(segmentId: string): number {
        const number = Number(segmentId.replace('segment-', ''));
        return isNaN(number) ? 1 : number;
    },
};
