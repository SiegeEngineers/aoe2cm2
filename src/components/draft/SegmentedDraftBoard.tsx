import * as React from 'react';
import DraftOptionGrid from "./DraftOptionGrid";
import Preset from "../../models/Preset";
import Segment from "../../models/Segment";

interface IProps {
    preset: Preset;
    nextAction: number;
}

/**
 * The options of the pool being drafted, of both pools when a parallel pair spans two, and of
 * every pool once the draft is over, as a record of what was taken.
 */
class SegmentedDraftBoard extends React.Component<IProps, object> {
    public render() {
        const inPlay = this.segmentIdsInPlay();
        return (
            <>
                {this.props.preset.segments
                    .filter((segment: Segment) => inPlay.includes(segment.id))
                    .map((segment: Segment) => (
                        <React.Fragment key={segment.id}>
                            {this.props.preset.hasSeveralSegments() && <h4 className="pool-name has-text-centered">{segment.name}</h4>}
                            <DraftOptionGrid draftOptions={segment.options}/>
                        </React.Fragment>
                    ))}
            </>
        );
    }

    private segmentIdsInPlay(): string[] {
        const preset = this.props.preset;
        if (this.props.nextAction >= preset.turns.length) {
            return preset.segments.map(segment => segment.id);
        }
        const ids = new Set(preset.turns
            .filter((turn, index) => turn.choosesDraftOption() && this.isInPlay(index))
            .map(turn => turn.segmentId));
        if (ids.size > 0) {
            return [...ids];
        }
        // A pause drafts nothing, so the pool waiting behind it is the one worth showing.
        const waiting = preset.segmentIdInPlay(this.props.nextAction);
        return waiting === undefined ? [] : [waiting];
    }

    /** The turns being played, by the same reckoning the panels use: the next one and its pair. */
    private isInPlay(index: number): boolean {
        const turns = this.props.preset.turns;
        const next = this.props.nextAction;
        return index === next
            || (index + 1 === next && turns[index].parallel)
            || (index - 1 === next && index >= 1 && turns[index - 1].parallel);
    }
}

export default SegmentedDraftBoard;
