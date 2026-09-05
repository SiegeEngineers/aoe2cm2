import {shallow} from "enzyme";
import PlayerDraftState from "../../components/draft/PlayerDraftState";
import Preset from "../../models/Preset";
import Turn from "../../models/Turn";
import Segment from "../../models/Segment";
import DraftOption from "../../models/DraftOption";
import PlayerEvent from "../../models/PlayerEvent";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import ActionType from "../../constants/ActionType";
import Exclusivity from "../../constants/Exclusivity";

const mapPick = () => Turn.withSegmentId(new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL), 'maps');
const mapBan = () => Turn.withSegmentId(new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL), 'maps');
const civPick = () => Turn.withSegmentId(new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL), 'civs');

const pooled = new Preset('Maps and civs', [], [mapBan(), mapPick(), civPick(), civPick()],
    undefined, undefined,
    [new Segment('maps', 'Maps', [new DraftOption('arabia'), new DraftOption('arena')]),
     new Segment('civs', 'Civilisations', [new DraftOption('Franks')])]);

const render = (preset: Preset, events: PlayerEvent[] = [], nextAction = 0, simplifiedUI = false) => shallow(
    <PlayerDraftState preset={preset} player={Player.HOST} name="Alice" events={events} simplifiedUI={simplifiedUI}
                      nextAction={nextAction} flipped={false} smooch={false} highlightedAction={null}/>
).dive();

it('draws a section per pool, each with the panels of its own turns, played or not', () => {
    const component = render(pooled);
    expect(component.find('.pool-name').map(name => name.text())).toEqual(['Maps', 'Civilisations']);
    const picks = component.find('.picks');
    expect(picks).toHaveLength(2);
    expect(picks.at(0).children()).toHaveLength(1);
    expect(picks.at(1).children()).toHaveLength(2);
    expect(component.find('.bans')).toHaveLength(1);
    expect(component.find('.bans').children()).toHaveLength(1);
});

it('names no pool and draws one section when the preset has a single pool', () => {
    const plain = new Preset('Plain', [new DraftOption('Franks')],
        [new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL), new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL)]);
    const component = render(plain);
    expect(component.find('.pool-name')).toHaveLength(0);
    expect(component.find('.picks')).toHaveLength(1);
    expect(component.find('.bans')).toHaveLength(1);
});

it('leaves out a pool the player has no turn in', () => {
    const spectating = new Preset('Guest only civs', [], [mapPick(),
        Turn.withSegmentId(new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL), 'civs')],
        undefined, undefined, pooled.segments);
    expect(render(spectating).find('.pool-name').map(name => name.text())).toEqual(['Maps']);
});

it('fills the panels of the pool with what the player took there', () => {
    const events = [new PlayerEvent(Player.HOST, ActionType.BAN, 'arabia'),
                    new PlayerEvent(Player.HOST, ActionType.PICK, 'arena')];
    const component = render(pooled, events, 2);
    expect(component.find('.picks').at(0).children().at(0).prop('draftOption')).toEqual(new DraftOption('arena'));
    expect(component.find('.bans').children().at(0).prop('draftOption')).toEqual(new DraftOption('arabia'));
});

it('in the simplified view, a pool with bans alone still shows them, in the one row there is', () => {
    const component = render(pooled, [], 0, true);
    expect(component.find('.bans')).toHaveLength(0);
    const rows = component.find('.picks');
    expect(rows).toHaveLength(2);
    expect(rows.at(0).children()).toHaveLength(2);
    expect(rows.at(1).children()).toHaveLength(2);
});
