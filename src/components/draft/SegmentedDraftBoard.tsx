import * as React from 'react';
import DraftOptionGrid from "./DraftOptionGrid";
import Preset from "../../models/Preset";
import Segment from "../../models/Segment";

interface IProps {
    preset: Preset;
    nextAction: number;
}

/** Shows the options of the pool being drafted. What has been taken from it is shown by the sides. */
class SegmentedDraftBoard extends React.Component<IProps, object> {
    public render() {
        const inPlay = this.segmentIdsInPlay();
        return (
            <>
                {this.props.preset.segmentsOrDefault()
                    .filter((segment: Segment) => inPlay.includes(segment.id))
                    .map((segment: Segment) => (
                        <React.Fragment key={segment.id}>
                            <h3 className="segment-name">{segment.name}</h3>
                            <DraftOptionGrid draftOptions={segment.options}/>
                        </React.Fragment>
                    ))}
            </>
        );
    }

    private segmentIdsInPlay(): string[] {
        // A parallel pair shares a pool of its own (VLD_922), so this is one id in a valid preset.
        const ids = this.props.preset.turns
            .filter((turn, index) => turn.choosesDraftOption() && this.isInPlay(index))
            .map(turn => turn.segmentIdOrDefault());
        if (ids.length > 0) {
            return ids.filter((id, index) => ids.indexOf(id) === index);
        }
        // A pause drafts nothing, so the pool waiting behind it is the one worth showing.
        const waiting = this.props.preset.segmentIdInPlay(this.props.nextAction);
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
