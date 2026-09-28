import {shallow} from "enzyme";
import {Trans, WithTranslation} from "react-i18next";
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

it('offers only the add button while there is one pool, and tabs with a name and a remove button from two', () => {
    const one = render([Segment.defaultWith([])]).component;
    expect(one.find('button')).toHaveLength(1);
    expect(one.find('.segment-tabs')).toHaveLength(0);

    const two = render([Segment.defaultWith([]), new Segment('segment-2', 'Civs', [])], 1).component;
    const tabs = two.find('.segment-tabs li');
    expect(tabs).toHaveLength(3);
    expect(tabs.slice(0, 2).map(item => item.text())).toEqual(['Default (0)', 'Civs (0)']);
    expect(tabs.at(2).find(Trans).prop('i18nKey')).toEqual('presetEditor.addSegment');
    expect(two.find('.segment-tabs li.is-active').text()).toEqual('Civs (0)');
    expect(two.find('input').prop('value')).toEqual('Civs');
    expect(two.find('button')).toHaveLength(1);
});

it('renames the pool on show and removes it, leaving the other one', () => {
    const civs = new Segment('segment-2', 'Civs', []);
    const {component, onSegmentsChange} = render([Segment.defaultWith([]), civs], 1);
    component.find('input').simulate('change', {target: {value: 'Civilisations'}});
    expect(onSegmentsChange.mock.calls[0][0].map((value: Segment) => value.name)).toEqual(['Default', 'Civilisations']);
    component.find('button').simulate('click');
    expect(onSegmentsChange.mock.calls[1][0].map((value: Segment) => value.id)).toEqual(['default']);
});
