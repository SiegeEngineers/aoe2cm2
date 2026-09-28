import {shallow} from "enzyme";
import SegmentedDraftBoard from "../../components/draft/SegmentedDraftBoard";
import DraftOptionGrid from "../../components/draft/DraftOptionGrid";
import Preset from "../../models/Preset";
import Segment from "../../models/Segment";
import Turn from "../../models/Turn";
import DraftOption from "../../models/DraftOption";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";

const maps = new Segment('maps', 'Maps', [new DraftOption('arabia'), new DraftOption('arena')]);
const civs = new Segment('civs', 'Civilisations', [new DraftOption('Franks')]);

const turnIn = (segmentId: string, parallel: boolean = false) =>
    new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, parallel, Player.HOST, ['default'], undefined, segmentId);

const preset = (...turns: Turn[]) =>
    new Preset('Segmented Preset', [], turns, undefined, undefined, [maps, civs]);

it('renders the grid for the pool of the current turn only', () => {
    const component = shallow(<SegmentedDraftBoard preset={preset(turnIn('maps'), turnIn('civs'))}
                                                   nextAction={0}/>);
    expect(component.find(DraftOptionGrid)).toHaveLength(1);
    expect(component.find(DraftOptionGrid).prop('draftOptions')).toEqual(maps.options);
});

it('follows the active segment as the draft advances', () => {
    const component = shallow(<SegmentedDraftBoard preset={preset(turnIn('maps'), turnIn('civs'))}
                                                   nextAction={1}/>);
    expect(component.find(DraftOptionGrid).prop('draftOptions')).toEqual(civs.options);
});

it('shows both pools of a parallel pair that spans two of them', () => {
    const component = shallow(<SegmentedDraftBoard preset={preset(turnIn('maps', true), turnIn('civs'))}
                                                   nextAction={0}/>);
    expect(component.find(DraftOptionGrid)).toHaveLength(2);
});

it('shows every pool once the draft is over, so what was taken stays on view', () => {
    const component = shallow(<SegmentedDraftBoard preset={preset(turnIn('maps'), turnIn('civs'))}
                                                   nextAction={2}/>);
    expect(component.find('.pool-name').map(name => name.text())).toEqual(['Maps', 'Civilisations']);
    expect(component.find(DraftOptionGrid)).toHaveLength(2);
});

it('keeps the one grid of a plain preset up after the draft, as it always was', () => {
    const plain = new Preset('Plain', [new DraftOption('Franks')], [new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL)]);
    const component = shallow(<SegmentedDraftBoard preset={plain} nextAction={1}/>);
    expect(component.find(DraftOptionGrid)).toHaveLength(1);
    expect(component.find(DraftOptionGrid).prop('draftOptions')).toEqual(plain.options);
});

it('keeps both pools up until a parallel pair has been taken by both players', () => {
    const hostTurn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true, Player.HOST, ['default'], undefined, 'maps');
    const guestTurn = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST, ['default'], undefined, 'civs');
    const parallelPreset = new Preset('Parallel', [], [hostTurn, guestTurn], undefined, undefined, [maps, civs]);

    const component = shallow(<SegmentedDraftBoard preset={parallelPreset} nextAction={1}/>);

    expect(component.find(DraftOptionGrid)).toHaveLength(2);
});

it('shows the pool waiting behind a pause', () => {
    const pause = new Turn(Player.NONE, Action.PAUSE, Exclusivity.GLOBAL);
    const pausedPreset = new Preset('Paused', [], [turnIn('maps'), pause, turnIn('civs')], undefined, undefined, [maps, civs]);

    const component = shallow(<SegmentedDraftBoard preset={pausedPreset} nextAction={1}/>);

    expect(component.find(DraftOptionGrid)).toHaveLength(1);
    expect(component.find(DraftOptionGrid).prop('draftOptions')).toEqual(civs.options);
});

it('shows both pools of a parallel pair waiting behind a pause', () => {
    const pause = new Turn(Player.NONE, Action.PAUSE, Exclusivity.GLOBAL);
    const paused = new Preset('Paused', [], [turnIn('maps'), pause, turnIn('maps', true), turnIn('civs')],
        undefined, undefined, [maps, civs]);
    const component = shallow(<SegmentedDraftBoard preset={paused} nextAction={1}/>);
    expect(component.find(DraftOptionGrid)).toHaveLength(2);
});

it('shows both pools of a parallel pair waiting behind a reveal and a pause', () => {
    const reveal = new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL);
    const pause = new Turn(Player.NONE, Action.PAUSE, Exclusivity.GLOBAL);
    const held = new Preset('Held', [], [turnIn('maps'), reveal, pause, turnIn('civs', true), turnIn('maps')],
        undefined, undefined, [maps, civs]);
    const component = shallow(<SegmentedDraftBoard preset={held} nextAction={1}/>);
    expect(component.find(DraftOptionGrid)).toHaveLength(2);
});

it('shows every pool while a trailing reveal runs, as nothing is left to draft', () => {
    const reveal = new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL);
    const revealed = new Preset('Revealed', [], [turnIn('maps'), turnIn('civs'), reveal],
        undefined, undefined, [maps, civs]);
    const component = shallow(<SegmentedDraftBoard preset={revealed} nextAction={2}/>);
    expect(component.find(DraftOptionGrid)).toHaveLength(2);
});

it('shows the first pool before the draft has started', () => {
    const component = shallow(<SegmentedDraftBoard preset={preset(turnIn('civs'), turnIn('maps'))} nextAction={-1}/>);
    expect(component.find(DraftOptionGrid)).toHaveLength(1);
    expect(component.find(DraftOptionGrid).prop('draftOptions')).toEqual(civs.options);
});

it('names the pool over its options only when there are several pools', () => {
    const pooled = shallow(<SegmentedDraftBoard preset={preset(turnIn('maps'), turnIn('civs'))} nextAction={0}/>);
    expect(pooled.find('.pool-name').text()).toEqual('Maps');

    const plain = new Preset('Plain', [new DraftOption('Franks')], [new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL)]);
    const single = shallow(<SegmentedDraftBoard preset={plain} nextAction={0}/>);
    expect(single.find('.pool-name')).toHaveLength(0);
    expect(single.find(DraftOptionGrid).prop('draftOptions')).toEqual(plain.options);
});
