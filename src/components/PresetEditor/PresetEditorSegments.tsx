import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import * as actions from "../../actions";
import {ISetEditorActiveSegment, ISetEditorSegments} from "../../actions";
import {ApplicationState} from "../../types";
import Preset from "../../models/Preset";
import Segment from "../../models/Segment";
import {EditorSegments} from "../../util/EditorSegments";

interface Props extends WithTranslation {
    preset: Preset | null,
    segments: Segment[],
    activeSegment: number,
    onSegmentsChange: (value: Segment[]) => ISetEditorSegments,
    onActiveSegmentChange: (value: number) => ISetEditorActiveSegment,
}

class PresetEditorSegments extends React.Component<Props, object> {

    public render() {
        if (this.props.preset === null) {
            return null;
        }
        if (this.props.segments.length === 0) {
            return (
                <div className="mb-3">
                    <button className="button is-small" onClick={() => this.split()}>
                        <Trans i18nKey="presetEditor.splitIntoSegments">Split into several option pools</Trans>
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
                    {this.props.segments.length > 1 && <p className="control">
                        <button className="button is-small is-danger is-outlined"
                                onClick={() => this.remove(active)}>
                            <Trans i18nKey="presetEditor.removeSegment">Remove pool</Trans>
                        </button>
                    </p>}
                </div>
            </div>
        );
    }

    private split() {
        const preset = this.props.preset as Preset;
        const first = new Segment(EditorSegments.nextSegmentId([]), this.defaultName(1), preset.options);
        this.props.onSegmentsChange([
            first,
            new Segment(EditorSegments.nextSegmentId([first]), this.defaultName(2), []),
        ]);
        this.props.onActiveSegmentChange(0);
    }

    private add() {
        const segments = this.props.segments;
        const id = EditorSegments.nextSegmentId(segments);
        // Named after the id it was given: counting the pools would repeat a name after a removal.
        this.props.onSegmentsChange([...segments, new Segment(id, this.defaultName(EditorSegments.numberOf(id)), [])]);
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
        preset: state.presetEditor.editorPreset,
        segments: EditorSegments.segments(state),
        activeSegment: EditorSegments.activeIndex(state),
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSegmentsChange: (value: Segment[]) => dispatch(actions.setEditorSegments(value)),
        onActiveSegmentChange: (value: number) => dispatch(actions.setEditorActiveSegment(value)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PresetEditorSegments));
