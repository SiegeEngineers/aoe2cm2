import {shallow} from "enzyme";
import {TurnPoolDropdown} from "../../components/PresetEditor/TurnPoolDropdown";
import Pool from "../../models/Pool";
import Turn from "../../models/Turn";
import DraftOption from "../../models/DraftOption";

const maps = new Pool('default', 'Default', [new DraftOption('arabia')]);
const civs = new Pool('pool-2', 'Civilisations', [new DraftOption('Franks')]);

const render = (turn: Turn, pools: Pool[]) => {
    const onValueChange = jest.fn();
    const component = shallow(<TurnPoolDropdown turn={turn} index={3} pools={pools} onValueChange={onValueChange}/>);
    return {component, onValueChange};
};

it('offers the one pool of a plain preset, so a turn always shows where it draws from', () => {
    const {component} = render(Turn.HOST_PICK, [maps]);
    expect(component.find('option').map(option => option.text())).toEqual(['Default']);
    expect(component.find('select').prop('value')).toEqual('default');
});

it('lists every pool with the pool of the turn selected', () => {
    const {component} = render(Turn.withPoolId(Turn.HOST_PICK, 'pool-2'), [maps, civs]);
    expect(component.find('option').map(option => option.text())).toEqual(['Default', 'Civilisations']);
    expect(component.find('select').prop('value')).toEqual('pool-2');
});

it('is not shown for a turn that takes no option', () => {
    expect(render(Turn.REVEAL_ALL, [maps, civs]).component.isEmptyRender()).toBe(true);
    expect(render(Turn.PAUSE, [maps, civs]).component.isEmptyRender()).toBe(true);
});

it('hands back the same turn in the chosen pool', () => {
    const {component, onValueChange} = render(Turn.HOST_PICK, [maps, civs]);
    component.find('select').simulate('change', {target: {value: 'pool-2'}});
    const turn: Turn = onValueChange.mock.calls[0][0];
    expect(turn.poolId).toEqual('pool-2');
    expect(turn.id).toEqual(Turn.HOST_PICK.id);
    expect(onValueChange.mock.calls[0][1]).toEqual(3);
});
