import {shallow} from "enzyme";
import AdminDraftState from "../../components/draft/AdminDraftState";
import Preset from "../../models/Preset";
import Turn from "../../models/Turn";
import Segment from "../../models/Segment";
import DraftOption from "../../models/DraftOption";
import PlayerEvent from "../../models/PlayerEvent";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import ActionType from "../../constants/ActionType";
import Exclusivity from "../../constants/Exclusivity";

const adminBan = (segmentId: string) =>
    Turn.withSegmentId(new Turn(Player.NONE, Action.BAN, Exclusivity.GLOBAL), segmentId);
const adminPick = (segmentId: string) =>
    Turn.withSegmentId(new Turn(Player.NONE, Action.PICK, Exclusivity.GLOBAL), segmentId);

const pooled = new Preset('Maps and civs', [], [adminBan('maps'), adminBan('civs'), adminPick('civs')],
    undefined, undefined,
    [new Segment('maps', 'Maps', [new DraftOption('arabia'), new DraftOption('arena')]),
     new Segment('civs', 'Civilisations', [new DraftOption('Franks'), new DraftOption('Britons')])]);

const render = (preset: Preset, events: PlayerEvent[] = [], nextAction = 0, simplifiedUI = false) => shallow(
    <AdminDraftState preset={preset} player={Player.NONE} name="Admin" events={events} simplifiedUI={simplifiedUI}
                     nextAction={nextAction} flipped={false} smooch={false} highlightedAction={null}/>
).dive();

it('draws a section per pool, each with the admin turns of that pool', () => {
    const component = render(pooled);
    expect(component.find('.pool-name').map(name => name.text())).toEqual(['Maps', 'Civilisations']);
    expect(component.find('.bans')).toHaveLength(2);
    expect(component.find('.bans').at(0).children()).toHaveLength(1);
    expect(component.find('.bans').at(1).children()).toHaveLength(1);
    expect(component.find('.picks')).toHaveLength(1);
    expect(component.find('.picks').children()).toHaveLength(1);
});

it('names no pool when the preset has a single one', () => {
    const plain = new Preset('Plain', [new DraftOption('Franks')], [adminBan(Segment.DEFAULT_ID)]);
    const component = render(plain);
    expect(component.find('.pool-name')).toHaveLength(0);
    expect(component.find('.bans')).toHaveLength(1);
});

it('leaves out a pool the admin has no turn in', () => {
    const civsOnly = new Preset('Civs only', [], [adminBan('civs')], undefined, undefined, pooled.segments);
    expect(render(civsOnly).find('.pool-name').map(name => name.text())).toEqual(['Civilisations']);
});

it('in the simplified view, the bans of each pool share the one row of that pool', () => {
    const component = render(pooled, [], 0, true);
    expect(component.find('.bans')).toHaveLength(0);
    const rows = component.find('.picks');
    expect(rows).toHaveLength(2);
    expect(rows.at(0).children()).toHaveLength(1);
    expect(rows.at(1).children()).toHaveLength(2);
});

it('fills the panels of the pool with what the admin took there', () => {
    const events = [new PlayerEvent(Player.NONE, ActionType.BAN, 'arabia'),
                    new PlayerEvent(Player.NONE, ActionType.BAN, 'Franks')];
    const component = render(pooled, events, 2);
    expect(component.find('.bans').at(0).children().at(0).prop('draftOption')).toEqual(new DraftOption('arabia'));
    expect(component.find('.bans').at(1).children().at(0).prop('draftOption')).toEqual(new DraftOption('Franks'));
});
