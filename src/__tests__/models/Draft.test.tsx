import Draft from "../../models/Draft";
import Preset from "../../models/Preset";
import Civilisation from "../../models/Civilisation";
import Turn from "../../models/Turn";
import Player from "../../constants/Player";
import Exclusivity from "../../constants/Exclusivity";
import Action from "../../constants/Action";
import PlayerEvent from "../../models/PlayerEvent";
import ActionType from "../../constants/ActionType";

it('test getGlobalPicks() with reverse parallel turns', () => {
    const turns = [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
    ];
    const draft = new Draft('nameHost', 'nameGuest', new Preset('presetName', Civilisation.ALL, turns));
    draft.events = [
        new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.GOTHS),
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.HUNS),
    ];
    expect(draft.getGlobalPicks()).toEqual([Civilisation.GOTHS, Civilisation.HUNS]);
});

it('test getExclusivePicks() with reverse parallel turns', () => {
    const turns = [
        new Turn(Player.HOST, Action.PICK, Exclusivity.EXCLUSIVE, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.EXCLUSIVE),
    ];
    const draft = new Draft('nameHost', 'nameGuest', new Preset('presetName', Civilisation.ALL, turns));
    draft.events = [
        new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.GOTHS),
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.HUNS),
    ];
    expect(draft.getExclusivePicks(Player.HOST)).toEqual([Civilisation.HUNS]);
    expect(draft.getExclusivePicks(Player.GUEST)).toEqual([Civilisation.GOTHS]);
});

it('test getPicks() with reverse parallel turns', () => {
    const turns = [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.PICK, Exclusivity.EXCLUSIVE, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.EXCLUSIVE),
    ];
    const draft = new Draft('nameHost', 'nameGuest', new Preset('presetName', Civilisation.ALL, turns));
    draft.events = [
        new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.GOTHS),
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.HUNS),
        new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.BRITONS),
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS),
    ];
    expect(draft.getPicks(Player.HOST)).toEqual([Civilisation.HUNS, Civilisation.AZTECS]);
    expect(draft.getPicks(Player.GUEST)).toEqual([Civilisation.GOTHS, Civilisation.BRITONS]);
});

it('test getGlobalBans() with reverse parallel turns', () => {
    const turns = [
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL),
    ];
    const draft = new Draft('nameHost', 'nameGuest', new Preset('presetName', Civilisation.ALL, turns));
    draft.events = [
        new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.GOTHS),
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.HUNS),
    ];
    expect(draft.getGlobalBans()).toEqual([Civilisation.GOTHS, Civilisation.HUNS]);
});

it('test getBansForPlayer() with reverse parallel turns', () => {
    const turns = [
        new Turn(Player.HOST, Action.BAN, Exclusivity.EXCLUSIVE, false, true),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.EXCLUSIVE),
    ];
    const draft = new Draft('nameHost', 'nameGuest', new Preset('presetName', Civilisation.ALL, turns));
    draft.events = [
        new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.GOTHS),
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.HUNS),
    ];
    expect(draft.getBansForPlayer(Player.HOST)).toEqual([Civilisation.GOTHS]);
    expect(draft.getBansForPlayer(Player.GUEST)).toEqual([Civilisation.HUNS]);
});

it('test getExclusiveBansByPlayer() with reverse parallel turns', () => {
    const turns = [
        new Turn(Player.HOST, Action.BAN, Exclusivity.EXCLUSIVE, false, true),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.EXCLUSIVE),
    ];
    const draft = new Draft('nameHost', 'nameGuest', new Preset('presetName', Civilisation.ALL, turns));
    draft.events = [
        new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.GOTHS),
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.HUNS),
    ];
    expect(draft.getExclusiveBansByPlayer(Player.HOST)).toEqual([Civilisation.HUNS]);
    expect(draft.getExclusiveBansByPlayer(Player.GUEST)).toEqual([Civilisation.GOTHS]);
});

it('test getExclusiveBansByPlayer() with reverse parallel turns', () => {
    const turns = [
        new Turn(Player.HOST, Action.PICK, Exclusivity.EXCLUSIVE, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.EXCLUSIVE),
        new Turn(Player.HOST, Action.SNIPE, Exclusivity.EXCLUSIVE, false, true),
        new Turn(Player.GUEST, Action.SNIPE, Exclusivity.EXCLUSIVE),
    ];
    const draft = new Draft('nameHost', 'nameGuest', new Preset('presetName', Civilisation.ALL, turns));
    draft.events = [
        new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.GOTHS),
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.HUNS),
        new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.HUNS),
        new PlayerEvent(Player.HOST, ActionType.SNIPE, Civilisation.GOTHS),
    ];
    expect(draft.getSnipes(Player.HOST)).toEqual([Civilisation.GOTHS]);
    expect(draft.getSnipes(Player.GUEST)).toEqual([Civilisation.HUNS]);
});
