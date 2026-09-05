import Turn from "../../models/Turn";
import Segment from "../../models/Segment";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";

it('a turn belongs to the default pool unless told otherwise, and says so when stored', () => {
    const turn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL);
    expect(turn.segmentId).toEqual(Segment.DEFAULT_ID);
    expect(JSON.parse(JSON.stringify(turn))).toHaveProperty('segmentId', Segment.DEFAULT_ID);
});

it('a turn given a pool keeps and stores it', () => {
    const turn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST, ['default'], undefined, 'maps');
    expect(turn.segmentId).toEqual('maps');
    expect(JSON.parse(JSON.stringify(turn))).toHaveProperty('segmentId', 'maps');
});

it('a turn moved to another pool keeps everything else', () => {
    const turn = new Turn(Player.GUEST, Action.BAN, Exclusivity.NONEXCLUSIVE, true, false, Player.NONE, ['land'], 'id-1');
    const moved = Turn.withSegmentId(turn, 'maps');
    expect(moved.segmentId).toEqual('maps');
    expect({...moved, segmentId: turn.segmentId}).toEqual({...turn});
});

it('a turn stored before there were pools belongs to the default pool', () => {
    const turns = Turn.fromPojoArray([{
        player: Player.GUEST,
        action: Action.PICK,
        exclusivity: Exclusivity.NONEXCLUSIVE,
        hidden: false,
        parallel: false
    }] as Turn[]);
    expect(turns[0].segmentId).toEqual(Segment.DEFAULT_ID);
});

it('a turn from a pojo keeps its pool', () => {
    const turns = Turn.fromPojoArray([{
        player: Player.GUEST,
        action: Action.PICK,
        exclusivity: Exclusivity.NONEXCLUSIVE,
        hidden: false,
        parallel: false,
        segmentId: 'maps'
    }] as Turn[]);
    expect(turns[0].segmentId).toEqual('maps');
});

it('a turn from a pojo with a pool that is not a string throws', () => {
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
