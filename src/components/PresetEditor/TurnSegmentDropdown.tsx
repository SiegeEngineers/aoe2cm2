import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {Trans} from "react-i18next";
import * as actions from "../../actions";
import {ISetEditorTurn} from "../../actions";
import {ApplicationState} from "../../types";
import Segment from "../../models/Segment";
import Turn from "../../models/Turn";
import {EditorSegments} from "../../util/EditorSegments";

interface Props {
    turn: Turn,
    index: number,
    segments: Segment[],
    onValueChange: (turn: Turn, index: number) => ISetEditorTurn,
}

class TurnSegmentDropdown extends React.Component<Props, object> {

    public render() {
        if (this.props.segments.length < 2 || !this.props.turn.choosesDraftOption()) {
            return null;
        }
        return (
            <div className="field is-horizontal">
                <div className="field-label is-small">
                    <label htmlFor={'segmentinput-' + this.props.index} className="label">
                        <Trans i18nKey="presetEditor.turnSegment">Pool</Trans>
                    </label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <div className="control">
                            <div className="select is-small">
                                <select id={'segmentinput-' + this.props.index}
                                        value={this.props.turn.segmentIdOrDefault()}
                                        onChange={event => this.updateSegment(event.target.value)}>
                                    {this.props.segments.map(segment =>
                                        <option value={segment.id} key={segment.id}>{segment.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private updateSegment(segmentId: string) {
        this.props.onValueChange(Turn.withSegmentId(this.props.turn, segmentId), this.props.index);
    }
}

export function mapStateToProps(state: ApplicationState) {
    return {
        segments: EditorSegments.segments(state),
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onValueChange: (turn: Turn, index: number) => dispatch(actions.setEditorTurn(turn, index)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TurnSegmentDropdown);
