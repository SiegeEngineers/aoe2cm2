import Draft from "../../models/Draft";
import Preset from "../../models/Preset";
import Pool from "../../models/Pool";
import Turn from "../../models/Turn";
import DraftOption from "../../models/DraftOption";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";

const maps = new Pool('maps', 'Maps', [new DraftOption('arabia')]);
const civs = new Pool('civs', 'Civilisations', [new DraftOption('Franks')]);

/** A parallel pair for the same player: the host picks a map, the guest picks a civilisation for the host. */
const sharedPlayerPair = () => new Preset('Shared player pair', [maps, civs], [
    new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true, Player.HOST, ['default'], undefined, 'maps'),
    new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST, ['default'], undefined, 'civs'),
]);

it('the expected action of an executing player is their own half of a parallel pair', () => {
    const draft = new Draft('Yodit', 'Saladin', sharedPlayerPair(), false);
    draft.hostReady = true;
    draft.guestReady = true;
    expect(draft.getExpectedActionFor(Player.HOST)?.poolId).toEqual('maps');
    expect(draft.getExpectedActionFor(Player.GUEST)?.poolId).toEqual('civs');
    expect(draft.getExpectedActionFor(Player.NONE)).toBeUndefined();
});

it('nobody has an expected action before both players are ready', () => {
    const draft = new Draft('Yodit', 'Saladin', sharedPlayerPair(), false);
    expect(draft.getExpectedActionFor(Player.HOST)).toBeUndefined();
});
