import Preset from "../../models/Preset";
import Turn from "../../models/Turn";
import Segment from "../../models/Segment";
import DraftOption from "../../models/DraftOption";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";

const mapTurn = () => Turn.withSegmentId(new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL), 'maps');
const civTurn = () => Turn.withSegmentId(new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL), 'civs');
const pause = () => new Turn(Player.NONE, Action.PAUSE, Exclusivity.GLOBAL);

const preset = new Preset('Maps then civs', [], [mapTurn(), pause(), civTurn()], undefined, undefined,
    [new Segment('maps', 'Maps', [new DraftOption('arabia')]),
     new Segment('civs', 'Civilisations', [new DraftOption('Franks')])]);

it('names the pool of the turn being played', () => {
    expect(preset.segmentIdInPlay(0)).toEqual('maps');
    expect(preset.segmentIdInPlay(2)).toEqual('civs');
});

it('names the pool waiting behind a pause, not the one before it', () => {
    expect(preset.segmentIdInPlay(1)).toEqual('civs');
});

it('names no pool once the draft is over', () => {
    expect(preset.segmentIdInPlay(3)).toBeUndefined();
});

it('treats a draft that has not started as being on its first pool', () => {
    expect(preset.segmentIdInPlay(-1)).toEqual('maps');
});

it('names no pool when only pauses remain', () => {
    const trailing = new Preset('Trailing pause', [], [mapTurn(), pause()], undefined, undefined,
        [new Segment('maps', 'Maps', [new DraftOption('arabia')])]);
    expect(trailing.segmentIdInPlay(1)).toBeUndefined();
});
