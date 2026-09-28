import {shallow} from "enzyme";
import {WithTranslation} from "react-i18next";
import {PresetEditorSegments} from "../../components/PresetEditor/PresetEditorSegments";
import Segment from "../../models/Segment";
import DraftOption from "../../models/DraftOption";

const translation = {
    t: (key: string, options?: { defaultValue?: string, number?: number }) =>
        (options?.defaultValue ?? key).replace('{{number}}', String(options?.number)),
} as unknown as WithTranslation;

const render = (segments: Segment[], activeSegment = 0) => {
    const onSegmentsChange = jest.fn();
    const onActiveSegmentChange = jest.fn();
    const component = shallow(
        <PresetEditorSegments {...translation} segments={segments} activeSegment={activeSegment}
                              onSegmentsChange={onSegmentsChange} onActiveSegmentChange={onActiveSegmentChange}/>);
    return {component, onSegmentsChange, onActiveSegmentChange};
};

it('adding a pool to the default one names the new pool after its number and shows it', () => {
    const only = Segment.defaultWith([new DraftOption('arabia')]);
    const {component, onSegmentsChange, onActiveSegmentChange} = render([only]);
    component.find('button').simulate('click');
    const segments: Segment[] = onSegmentsChange.mock.calls[0][0];
    expect(segments.map(value => value.name)).toEqual(['Default', 'Pool 2']);
    expect(segments.map(value => value.id)).toEqual(['default', 'segment-2']);
    expect(segments[0].options).toEqual(only.options);
    expect(onActiveSegmentChange).toHaveBeenCalledWith(1);
});
