import {shallow} from "enzyme";
import {Trans, WithTranslation} from "react-i18next";
import {PresetEditorPools} from "../../components/PresetEditor/PresetEditorPools";
import Pool from "../../models/Pool";
import DraftOption from "../../models/DraftOption";

const translation = {
    t: (key: string, options?: { defaultValue?: string, number?: number }) =>
        (options?.defaultValue ?? key).replace('{{number}}', String(options?.number)),
} as unknown as WithTranslation;

const render = (pools: Pool[], activePool = 0) => {
    const onPoolsChange = jest.fn();
    const onActivePoolChange = jest.fn();
    const component = shallow(
        <PresetEditorPools {...translation} pools={pools} activePool={activePool}
                              onPoolsChange={onPoolsChange} onActivePoolChange={onActivePoolChange}/>);
    return {component, onPoolsChange, onActivePoolChange};
};

it('adding a pool to the default one names the new pool after its number and shows it', () => {
    const only = Pool.defaultWith([new DraftOption('arabia')]);
    const {component, onPoolsChange, onActivePoolChange} = render([only]);
    component.find('button').simulate('click');
    const pools: Pool[] = onPoolsChange.mock.calls[0][0];
    expect(pools.map(value => value.name)).toEqual(['Default', 'Pool 2']);
    expect(pools.map(value => value.id)).toEqual(['default', 'pool-2']);
    expect(pools[0].options).toEqual(only.options);
    expect(onActivePoolChange).toHaveBeenCalledWith(1);
});

it('offers only the add button while there is one pool, and tabs with a name and a remove button from two', () => {
    const one = render([Pool.defaultWith([])]).component;
    expect(one.find('button')).toHaveLength(1);
    expect(one.find('.pool-tabs')).toHaveLength(0);

    const two = render([Pool.defaultWith([]), new Pool('pool-2', 'Civs', [])], 1).component;
    const tabs = two.find('.pool-tabs li');
    expect(tabs).toHaveLength(3);
    expect(tabs.slice(0, 2).map(item => item.text())).toEqual(['Default (0)', 'Civs (0)']);
    expect(tabs.at(2).find(Trans).prop('i18nKey')).toEqual('presetEditor.addPool');
    expect(two.find('.pool-tabs li.is-active').text()).toEqual('Civs (0)');
    expect(two.find('input').prop('value')).toEqual('Civs');
    expect(two.find('button')).toHaveLength(1);
});

it('renames the pool on show and removes it, leaving the other one', () => {
    const civs = new Pool('pool-2', 'Civs', []);
    const {component, onPoolsChange} = render([Pool.defaultWith([]), civs], 1);
    component.find('input').simulate('change', {target: {value: 'Civilisations'}});
    expect(onPoolsChange.mock.calls[0][0].map((value: Pool) => value.name)).toEqual(['Default', 'Civilisations']);
    component.find('button').simulate('click');
    expect(onPoolsChange.mock.calls[1][0].map((value: Pool) => value.id)).toEqual(['default']);
});
