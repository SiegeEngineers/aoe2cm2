import {shallow} from "enzyme";
import PooledDraftBoard from "../../components/draft/PooledDraftBoard";
import DraftOptionGrid from "../../components/draft/DraftOptionGrid";
import Preset from "../../models/Preset";
import Pool from "../../models/Pool";
import Turn from "../../models/Turn";
import DraftOption from "../../models/DraftOption";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";

const maps = new Pool('maps', 'Maps', [new DraftOption('arabia'), new DraftOption('arena')]);
const civs = new Pool('civs', 'Civilisations', [new DraftOption('Franks')]);
// A third pool no turn of these presets draws from, so "every pool" is not the same as "both in play".
const gods = new Pool('gods', 'Gods', [new DraftOption('Zeus')]);

const turnIn = (poolId: string, parallel: boolean = false) =>
    new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, parallel, Player.HOST, ['default'], undefined, poolId);

const preset = (...turns: Turn[]) =>
    new Preset('Pooled Preset', [maps, civs], turns);

it('renders the grid for the pool of the current turn only', () => {
    const component = shallow(<PooledDraftBoard preset={preset(turnIn('maps'), turnIn('civs'))}
                                                   nextAction={0}/>);
    expect(component.find(DraftOptionGrid)).toHaveLength(1);
    expect(component.find(DraftOptionGrid).prop('draftOptions')).toEqual(maps.options);
});

it('follows the active pool as the draft advances', () => {
    const component = shallow(<PooledDraftBoard preset={preset(turnIn('maps'), turnIn('civs'))}
                                                   nextAction={1}/>);
    expect(component.find(DraftOptionGrid).prop('draftOptions')).toEqual(civs.options);
});

it('shows both pools of a parallel pair that spans two of them', () => {
    const component = shallow(<PooledDraftBoard preset={preset(turnIn('maps', true), turnIn('civs'))}
                                                   nextAction={0}/>);
    expect(component.find(DraftOptionGrid)).toHaveLength(2);
});

it('shows every pool once the draft is over, so what was taken stays on view', () => {
    const component = shallow(<PooledDraftBoard preset={preset(turnIn('maps'), turnIn('civs'))}
                                                   nextAction={2}/>);
    expect(component.find('.pool-name').map(name => name.text())).toEqual(['Maps', 'Civilisations']);
    expect(component.find(DraftOptionGrid)).toHaveLength(2);
});

it('keeps the one grid of a plain preset up after the draft, as it always was', () => {
    const plain = new Preset('Plain', [Pool.defaultWith([new DraftOption('Franks')])], [new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL)]);
    const component = shallow(<PooledDraftBoard preset={plain} nextAction={1}/>);
    expect(component.find(DraftOptionGrid)).toHaveLength(1);
    expect(component.find(DraftOptionGrid).prop('draftOptions')).toEqual(plain.options);
});

it('keeps both pools up until a parallel pair has been taken by both players', () => {
    const hostTurn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true, Player.HOST, ['default'], undefined, 'maps');
    const guestTurn = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST, ['default'], undefined, 'civs');
    const parallelPreset = new Preset('Parallel', [maps, civs], [hostTurn, guestTurn]);

    const component = shallow(<PooledDraftBoard preset={parallelPreset} nextAction={1}/>);

    expect(component.find(DraftOptionGrid)).toHaveLength(2);
});

it('shows the pool waiting behind a pause', () => {
    const pause = new Turn(Player.NONE, Action.PAUSE, Exclusivity.GLOBAL);
    const pausedPreset = new Preset('Paused', [maps, civs], [turnIn('maps'), pause, turnIn('civs')]);

    const component = shallow(<PooledDraftBoard preset={pausedPreset} nextAction={1}/>);

    expect(component.find(DraftOptionGrid)).toHaveLength(1);
    expect(component.find(DraftOptionGrid).prop('draftOptions')).toEqual(civs.options);
});

it('shows both pools of a parallel pair waiting behind a pause', () => {
    const pause = new Turn(Player.NONE, Action.PAUSE, Exclusivity.GLOBAL);
    const paused = new Preset('Paused', [maps, civs, gods], [turnIn('maps'), pause, turnIn('maps', true), turnIn('civs')]);
    const component = shallow(<PooledDraftBoard preset={paused} nextAction={1}/>);
    expect(component.find('.pool-name').map(name => name.text())).toEqual(['Maps', 'Civilisations']);
});

it('shows both pools of a parallel pair waiting behind a reveal and a pause', () => {
    const reveal = new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL);
    const pause = new Turn(Player.NONE, Action.PAUSE, Exclusivity.GLOBAL);
    const held = new Preset('Held', [maps, civs, gods], [turnIn('maps'), reveal, pause, turnIn('civs', true), turnIn('maps')]);
    const component = shallow(<PooledDraftBoard preset={held} nextAction={1}/>);
    expect(component.find('.pool-name').map(name => name.text())).toEqual(['Maps', 'Civilisations']);
});

it('shows every pool while a trailing reveal runs, as nothing is left to draft', () => {
    const reveal = new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL);
    const revealed = new Preset('Revealed', [maps, civs], [turnIn('maps'), turnIn('civs'), reveal]);
    const component = shallow(<PooledDraftBoard preset={revealed} nextAction={2}/>);
    expect(component.find(DraftOptionGrid)).toHaveLength(2);
});

it('shows the first pool before the draft has started', () => {
    const component = shallow(<PooledDraftBoard preset={preset(turnIn('civs'), turnIn('maps'))} nextAction={-1}/>);
    expect(component.find(DraftOptionGrid)).toHaveLength(1);
    expect(component.find(DraftOptionGrid).prop('draftOptions')).toEqual(civs.options);
});

it('names the pool over its options only when there are several pools', () => {
    const pooled = shallow(<PooledDraftBoard preset={preset(turnIn('maps'), turnIn('civs'))} nextAction={0}/>);
    expect(pooled.find('.pool-name').text()).toEqual('Maps');

    const plain = new Preset('Plain', [Pool.defaultWith([new DraftOption('Franks')])], [new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL)]);
    const single = shallow(<PooledDraftBoard preset={plain} nextAction={0}/>);
    expect(single.find('.pool-name')).toHaveLength(0);
    expect(single.find(DraftOptionGrid).prop('draftOptions')).toEqual(plain.options);
});

it('gives every grid it shows its own id, the default pool keeping the one it always had', () => {
    const second = new Pool(Pool.idFor(2), 'Civilisations', [new DraftOption('Franks')]);
    const first = Pool.defaultWith([new DraftOption('arabia')]);
    const pair = new Preset('Pair', [first, second], [turnIn(Pool.DEFAULT_ID, true), turnIn(Pool.idFor(2))]);
    const ids = shallow(<PooledDraftBoard preset={pair} nextAction={0}/>).find(DraftOptionGrid).map(grid => grid.prop('id'));
    expect(ids).toEqual(['civgrid', 'civgrid-pool-2']);
});

it('puts the id it is given on the grid', () => {
    expect(shallow(<DraftOptionGrid draftOptions={[]} id="civgrid-pool-2"/>).find('#civgrid-pool-2')).toHaveLength(1);
});
