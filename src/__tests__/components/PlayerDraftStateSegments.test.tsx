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

const preset = new Preset('Maps and civs', [], [mapBan(), mapPick(), civPick(), civPick()],
    undefined, undefined,
    [new Segment('maps', 'Maps', [new DraftOption('arabia'), new DraftOption('arena')]),
     new Segment('civs', 'Civilisations', [new DraftOption('Franks')])]);

const render = (segmentId: string | undefined, events: PlayerEvent[] = [], nextAction = 0) => shallow(
    <PlayerDraftState preset={preset} player={Player.HOST} name="Alice" events={events} segmentId={segmentId}
                      nextAction={nextAction} flipped={false} smooch={false} highlightedAction={null}/>
).dive();

it('draws a panel for every turn of the pool, played or not', () => {
    const component = render('maps');
    expect(component.find('.picks').children()).toHaveLength(1);
    expect(component.find('.bans').children()).toHaveLength(1);
});

it('leaves the turns of the other pool to the other band', () => {
    const component = render('civs');
    expect(component.find('.picks').children()).toHaveLength(2);
    expect(component.find('.bans')).toHaveLength(0);
});

it('draws every turn of the player when no pool is asked for', () => {
    const component = render(undefined);
    expect(component.find('.picks').children()).toHaveLength(3);
    expect(component.find('.bans').children()).toHaveLength(1);
});

it('fills the panels of the pool with what the player took there', () => {
    const events = [new PlayerEvent(Player.HOST, ActionType.BAN, 'arabia'),
                    new PlayerEvent(Player.HOST, ActionType.PICK, 'arena')];
    const component = render('maps', events, 2);
    const picks = component.find('.picks').children();
    expect(picks.at(0).prop('draftOption')).toEqual(new DraftOption('arena'));
    expect(component.find('.bans').children().at(0).prop('draftOption')).toEqual(new DraftOption('arabia'));
});
