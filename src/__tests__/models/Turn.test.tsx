import Turn from "../../models/Turn";
import Pool from "../../models/Pool";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";

it('a turn belongs to the default pool unless told otherwise, and says so when stored', () => {
    const turn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL);
    expect(turn.poolId).toEqual(Pool.DEFAULT_ID);
    expect(JSON.parse(JSON.stringify(turn))).toHaveProperty('poolId', Pool.DEFAULT_ID);
});

it('a turn given a pool keeps and stores it', () => {
    const turn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST, ['default'], undefined, 'maps');
    expect(turn.poolId).toEqual('maps');
    expect(JSON.parse(JSON.stringify(turn))).toHaveProperty('poolId', 'maps');
});

it('a turn moved to another pool keeps everything else', () => {
    const turn = new Turn(Player.GUEST, Action.BAN, Exclusivity.NONEXCLUSIVE, true, false, Player.NONE, ['land'], 'id-1');
    const moved = Turn.withPoolId(turn, 'maps');
    expect(moved.poolId).toEqual('maps');
    expect({...moved, poolId: turn.poolId}).toEqual({...turn});
});

it('a turn stored before there were pools belongs to the default pool', () => {
    const turns = Turn.fromPojoArray([{
        player: Player.GUEST,
        action: Action.PICK,
        exclusivity: Exclusivity.NONEXCLUSIVE,
        hidden: false,
        parallel: false
    }] as Turn[]);
    expect(turns[0].poolId).toEqual(Pool.DEFAULT_ID);
});

it('a turn from a pojo keeps its pool', () => {
    const turns = Turn.fromPojoArray([{
        player: Player.GUEST,
        action: Action.PICK,
        exclusivity: Exclusivity.NONEXCLUSIVE,
        hidden: false,
        parallel: false,
        poolId: 'maps'
    }] as Turn[]);
    expect(turns[0].poolId).toEqual('maps');
});

it('a turn from a pojo with a pool that is not a string throws', () => {
    expect(() => {
        Turn.fromPojoArray([{
            player: Player.GUEST,
            action: Action.PICK,
            exclusivity: Exclusivity.NONEXCLUSIVE,
            hidden: false,
            parallel: false,
            poolId: 42
        } as unknown as Turn]);
    }).toThrowError("Expected argument to be string or undefined, but was number");
});
