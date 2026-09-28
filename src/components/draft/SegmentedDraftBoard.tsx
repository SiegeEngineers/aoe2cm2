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
 * every pool once there is nothing left to draft, as a record of what was taken.
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
        if (this.nextChoosingTurn() >= preset.turns.length) {
            return preset.segments.map(segment => segment.id);
        }
        const ids = new Set(preset.turns
            .filter((turn, index) => this.isInPlay(index))
            .map(turn => turn.segmentId));
        return [...ids];
    }

    /**
     * The turns being played, by the same reckoning the panels use: the next one and its pair.
     * A reveal or a pause drafts nothing, so while one runs the turn in play is the one behind it.
     */
    private isInPlay(index: number): boolean {
        const turns = this.props.preset.turns;
        const next = this.nextChoosingTurn();
        return index === next
            || (index + 1 === next && turns[index].parallel)
            || (index - 1 === next && index >= 1 && turns[index - 1].parallel);
    }

    /** The first turn from the next action on that takes an option, or the turn count when none is left. */
    private nextChoosingTurn(): number {
        const turns = this.props.preset.turns;
        let next = Math.max(this.props.nextAction, 0);
        while (next < turns.length && !turns[next].choosesDraftOption()) {
            next++;
        }
        return next;
    }
}

export default SegmentedDraftBoard;
