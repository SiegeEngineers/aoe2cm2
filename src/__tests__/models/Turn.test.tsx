import Turn from "../../models/Turn";
import Segment from "../../models/Segment";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";

it('turn without explicit segment belongs to the default segment', () => {
    const turn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL);
    expect(turn.segmentIdOrDefault()).toEqual(Segment.DEFAULT_ID);
});

it('turn without explicit segment does not serialise a segmentId', () => {
    const turn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL);
    expect(JSON.parse(JSON.stringify(turn))).not.toHaveProperty('segmentId');
});

it('turn with explicit segment keeps and serialises it', () => {
    const turn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST, ['default'], undefined, 'maps');
    expect(turn.segmentIdOrDefault()).toEqual('maps');
    expect(JSON.parse(JSON.stringify(turn))).toHaveProperty('segmentId', 'maps');
});

it('turn from legacy pojo without segmentId falls back to the default segment', () => {
    const turns = Turn.fromPojoArray([{
        player: Player.GUEST,
        action: Action.PICK,
        exclusivity: Exclusivity.NONEXCLUSIVE,
        hidden: false,
        parallel: false
    }] as Turn[]);
    expect(turns[0].segmentIdOrDefault()).toEqual(Segment.DEFAULT_ID);
    expect(JSON.parse(JSON.stringify(turns[0]))).not.toHaveProperty('segmentId');
});

it('turn from pojo preserves segmentId', () => {
    const turns = Turn.fromPojoArray([{
        player: Player.GUEST,
        action: Action.PICK,
        exclusivity: Exclusivity.NONEXCLUSIVE,
        hidden: false,
        parallel: false,
        segmentId: 'maps'
    }] as Turn[]);
    expect(turns[0].segmentIdOrDefault()).toEqual('maps');
});

it('turn from pojo with non-string segmentId throws', () => {
    expect(() => {
        Turn.fromPojoArray([{
            player: Player.GUEST,
            action: Action.PICK,
            exclusivity: Exclusivity.NONEXCLUSIVE,
            hidden: false,
            parallel: false,
            segmentId: 42
        } as unknown as Turn]);
    }).toThrowError("Expected argument to be string or undefined, but was number");
});
