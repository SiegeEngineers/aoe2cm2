import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import * as actions from "../../actions";
import {ISetEditorActiveSegment, ISetEditorSegments} from "../../actions";
import {ApplicationState} from "../../types";
import Segment from "../../models/Segment";
import {EditorSegments} from "../../util/EditorSegments";

interface Props extends WithTranslation {
    segments: Segment[],
    activeSegment: number,
    onSegmentsChange: (value: Segment[]) => ISetEditorSegments,
    onActiveSegmentChange: (value: number) => ISetEditorActiveSegment,
}

export class PresetEditorSegments extends React.Component<Props, object> {

    public render() {
        // One pool is the ordinary preset, and it is not worth a row of tabs until there are two.
        if (this.props.segments.length < 2) {
            return (
                <div className="mb-3">
                    <button className="button is-small" onClick={() => this.add()}>
                        <Trans i18nKey="presetEditor.addSegment">+ Add pool</Trans>
                    </button>
                </div>
            );
        }

        const active = this.props.segments[this.props.activeSegment];

        return (
            <div className="mb-3">
                <div className="tabs is-toggle is-small segment-tabs">
                    <ul>
                        {this.props.segments.map((segment, index) =>
                            <li key={segment.id} className={segment.id === active.id ? "is-active" : ""}>
                                <a href={'#segment-' + segment.id} onClick={event => {
                                    event.preventDefault();
                                    this.props.onActiveSegmentChange(index);
                                }}>
                                    {segment.name} ({segment.options.length})
                                </a>
                            </li>)}
                        <li>
                            <a href="#add-segment" onClick={event => {
                                event.preventDefault();
                                this.add();
                            }}>
                                <Trans i18nKey="presetEditor.addSegment">+ Add pool</Trans>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="field is-grouped">
                    <p className="control">
                        <input className="input is-small" value={active.name}
                               aria-label={this.props.t('presetEditor.segmentName', 'Pool name')}
                               onChange={event => this.rename(active, event.target.value)}/>
                    </p>
                    <p className="control">
                        <button className="button is-small is-danger is-outlined"
                                onClick={() => this.remove(active)}>
                            <Trans i18nKey="presetEditor.removeSegment">Remove pool</Trans>
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    private add() {
        const segments = this.props.segments;
        // Named after its number rather than a count of the pools, which would repeat a name after a removal.
        const number = EditorSegments.nextSegmentNumber(segments);
        this.props.onSegmentsChange([...segments, new Segment(Segment.idFor(number), this.defaultName(number), [])]);
        this.props.onActiveSegmentChange(segments.length);
    }

    private defaultName(number: number): string {
        return this.props.t('presetEditor.segmentDefaultName', {defaultValue: 'Pool {{number}}', number});
    }

    private rename(active: Segment, name: string) {
        this.props.onSegmentsChange(this.props.segments.map(segment =>
            segment.id === active.id ? new Segment(segment.id, name, segment.options) : segment));
    }

    private remove(active: Segment) {
        this.props.onSegmentsChange(this.props.segments.filter(segment => segment.id !== active.id));
    }
}

export function mapStateToProps(state: ApplicationState) {
    return {
        segments: EditorSegments.segments(state.presetEditor),
        activeSegment: EditorSegments.activeIndex(state.presetEditor),
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSegmentsChange: (value: Segment[]) => dispatch(actions.setEditorSegments(value)),
        onActiveSegmentChange: (value: number) => dispatch(actions.setEditorActiveSegment(value)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PresetEditorSegments));
