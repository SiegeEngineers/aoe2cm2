import {Validator} from "../../models/Validator";
import {DraftsStore} from "../../models/DraftsStore";
import Draft from "../../models/Draft";
import Preset from "../../models/Preset";
import PlayerEvent from "../../models/PlayerEvent";
import Player from "../../constants/Player";
import ActionType from "../../constants/ActionType";
import Civilisation from "../../models/Civilisation";
import {ValidationId} from "../../constants/ValidationId";
import Action from "../../constants/Action";
import Turn from "../../models/Turn";
import {DraftEvent} from "../../types/DraftEvent";
import AdminEvent from "../../models/AdminEvent";
import Exclusivity from "../../constants/Exclusivity";
import DraftOption from "../../models/DraftOption";

const NAME_HOST: string = 'Yodit';
const NAME_GUEST: string = 'Saladin';
const DRAFT_ID: string = 'draftid';

it('VLD_000: host not ready', () => {
    let preset = Preset.SIMPLE;
    let draftsStore = prepareStore(preset);

    draftsStore.setPlayerReady(DRAFT_ID, Player.GUEST);
    const validator = new Validator(draftsStore);
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id ));
    expect(errors).toEqual([ValidationId.VLD_000]);
});

it('VLD_000: guest not ready', () => {
    let preset = Preset.SIMPLE;
    let draftsStore = prepareStore(preset);

    draftsStore.setPlayerReady(DRAFT_ID, Player.HOST);
    const validator = new Validator(draftsStore);
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_000]);
});

it('VLD_000: draft finished', () => {
    let preset = Preset.SIMPLE;
    let draftsStore = prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id),
        new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id),
        new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.BRITONS.id),
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.BRITONS.id)
    ]);
    const validator = new Validator(draftsStore);
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_000]);
});

it('VLD_001: wrong player to act', () => {
    let preset = Preset.SIMPLE;
    const validator = new Validator(prepareReadyStore(preset));
    expect(preset.turns[0].player).toEqual(Player.HOST);
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_001]);
});

it('VLD_002: wrong action', () => {
    let preset = Preset.SIMPLE;
    const validator = new Validator(prepareReadyStore(preset));
    expect(preset.turns[0].action).toEqual(Action.BAN);
    expect(preset.turns[0].exclusivity).toEqual(Exclusivity.NONEXCLUSIVE);
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_002]);
});

it('VLD_010: civ already globally banned by same player', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_GLOBAL_BAN, Turn.HOST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: civ already globally banned by opponent', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_GLOBAL_BAN, Turn.GUEST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: civ already banned for host', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_NONEXCLUSIVE_BAN, Turn.GUEST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: civ already hidden/revealed banned for host', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_HIDDEN_BAN, Turn.REVEAL_ALL, Turn.GUEST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id), new AdminEvent(Player.NONE, Action.REVEAL_ALL)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: civ already hidden/revealed banned for guest', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.GUEST_HIDDEN_BAN, Turn.REVEAL_ALL, Turn.HOST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id), new AdminEvent(Player.NONE, Action.REVEAL_ALL)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: civ already banned for guest', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.GUEST_NONEXCLUSIVE_BAN, Turn.HOST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: civ already picked by host', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_PICK, Turn.HOST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: two nonexclusive picks in a row', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_NONEXCLUSIVE_PICK, Turn.HOST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('VLD_010: civ already picked by guest', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.GUEST_PICK, Turn.GUEST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: civ already picked by opponent', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_PICK, Turn.GUEST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('VLD_010: civ already globally picked by same player', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_GLOBAL_PICK, Turn.HOST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: civ already globally picked by opponent', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_GLOBAL_PICK, Turn.GUEST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: civ already banned by host', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_BAN, Turn.HOST_NONEXCLUSIVE_BAN]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: civ already banned by guest', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.GUEST_BAN, Turn.GUEST_NONEXCLUSIVE_BAN]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: two nonexclusive bans in a row', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.GUEST_NONEXCLUSIVE_BAN, Turn.GUEST_NONEXCLUSIVE_BAN]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('VLD_010: civ to snipe not yet picked by opponent', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_NONEXCLUSIVE_PICK, Turn.GUEST_SNIPE]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.BRITONS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: opponent does not have a non-sniped pick of the civ to snipe', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_NONEXCLUSIVE_PICK, Turn.HOST_NONEXCLUSIVE_PICK, Turn.GUEST_SNIPE, Turn.GUEST_SNIPE]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id),
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.BRITONS.id),
        new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.AZTECS.id)
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010: both pick same civ hidden for opponent', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, true, true, Player.GUEST),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, true, false, Player.HOST),
        Turn.REVEAL_ALL,
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id, false, Player.GUEST),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id, false, Player.HOST));
    expect(errors).toEqual([]);
});

it('VLD_900: preset deserialisation failed', () => {
    const errors: ValidationId[] = Validator.validatePreset(undefined);
    expect(errors).toEqual([ValidationId.VLD_900]);
});

it('VLD_901: no parallel turns at all', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_NONEXCLUSIVE_PICK, Turn.HOST_NONEXCLUSIVE_PICK, Turn.GUEST_SNIPE, Turn.GUEST_SNIPE]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([]);
});

it('VLD_901: two parallel turns, but separate', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([]);
});

it('VLD_901: two parallel turns right after each other', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_901]);
});

it('VLD_902: preset with non-player parallel turn', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL, false, true),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_902]);
});

it('VLD_903: non-player turn after parallel turn', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_903]);
});

it('VLD_904: last turn is parallel turn', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, true),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_904]);
});

it('VLD_905: parallel turns by only HOST', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_905]);
});

it('VLD_905: parallel turns by only GUEST', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_905]);
});

it('VLD_906: hidden ban before pick', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_906]);
});

it('VLD_907: hidden ban without reveal', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_PICKS, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_907]);
});

it('VLD_907: hidden pick without reveal', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_SNIPES, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_907]);
});

it('VLD_907: hidden snipe without reveal', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.SNIPE, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_PICKS, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_907]);
});

it('VLD_907: hidden steal without reveal snipes', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.STEAL, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_PICKS, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_907]);
});

it('VLD_907: hidden steal without reveal picks', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.STEAL, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_SNIPES, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_907]);
});

it('VLD_907: hidden steal with reveals', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.STEAL, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_PICKS, Exclusivity.GLOBAL),
        new Turn(Player.NONE, Action.REVEAL_SNIPES, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([]);
});

it('VLD_908: no turns', () => {
    let preset = new Preset("test", Civilisation.ALL, []);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_908, ValidationId.VLD_917]);
});

it('VLD_909: illegal preset id', () => {
    let preset = new Preset("test", Civilisation.ALL, [new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL)], 'abc/123');
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_909]);
});

it('VLD_910: illegal draft option id', () => {
    let preset = new Preset("test", [new DraftOption('', 'name')], [Turn.HOST_PICK, Turn.GUEST_PICK]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_910]);
});

it('VLD_911: draft option ids not unique', () => {
    let preset = new Preset("test", [new DraftOption('id', 'name 1'), new DraftOption('id', 'name 2')], [Turn.HOST_PICK, Turn.GUEST_PICK]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_911]);
});

it('VLD_911: draft option names not unique but ids unique', () => {
    let preset = new Preset("test", [new DraftOption('id1', 'name'), new DraftOption('id2', 'name')], [Turn.HOST_PICK, Turn.GUEST_PICK]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([]);
});

it('VLD_912: admin snipes are forbidden', () => {
    let preset = new Preset("test", Civilisation.ALL, [new Turn(Player.NONE, Action.SNIPE, Exclusivity.NONEXCLUSIVE)]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_912]);
});

it('VLD_912: admin snipes as other player are allowed', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.SNIPE, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
        new Turn(Player.GUEST, Action.SNIPE, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([]);
});

it('VLD_912: admin steals are forbidden', () => {
    let preset = new Preset("test", Civilisation.ALL, [new Turn(Player.NONE, Action.STEAL, Exclusivity.NONEXCLUSIVE)]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_912]);
});

it('VLD_912: admin steals as other player are allowed', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.STEAL, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
        new Turn(Player.GUEST, Action.STEAL, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([]);
});

it('VLD_913: admin turns must not be hidden', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.NONE, Action.PICK, Exclusivity.NONEXCLUSIVE, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_913]);
});

it('VLD_914: only admins may do the admin turns', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.REVEAL_ALL, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_914]);
});

it('VLD_915: no spec player in turns', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.SPEC, Action.PICK, Exclusivity.GLOBAL),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_915]);
});

it('VLD_915: no executing spec player in turns', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.SPEC),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_915]);
});

it('VLD_916: turn category not found in draftoptions', () => {
    let preset = new Preset("test", [
        new DraftOption('idB', 'nameB', undefined, undefined, 'CATEGORY_B'),
        new DraftOption('idC', 'nameC', undefined, undefined, 'CATEGORY_C'),
    ], [
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST,
            ['CATEGORY_A']),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST,
            ['CATEGORY_B']),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST,
            ['CATEGORY_C']),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_916]);
});

it('VLD_917: draftoption category not found in turns', () => {
    let preset = new Preset("test", [
        new DraftOption('idA', 'nameA', undefined, undefined, 'CATEGORY_A'),
        new DraftOption('idB', 'nameB', undefined, undefined, 'CATEGORY_B'),
        new DraftOption('idC', 'nameC', undefined, undefined, 'CATEGORY_C'),
    ], [
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST,
            ['CATEGORY_B']),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST,
            ['CATEGORY_C']),
    ]);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_917]);
});

it('VLD_918: categoryLimits pick category not found in turns', () => {
    let preset = new Preset("test", [
        new DraftOption('idB', 'nameB', undefined, undefined, 'CATEGORY_A'),
        new DraftOption('idC', 'nameC', undefined, undefined, 'CATEGORY_B'),
    ], [
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST,
            ['CATEGORY_A']),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST,
            ['CATEGORY_B']),
    ], 'presetID', {pick: {"CATEGORY_A": 1, "CATEGORY_B": 1, "CATEGORY_C": 1}, ban: {}});
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_918]);
});

it('VLD_918: categoryLimits ban category not found in turns', () => {
    let preset = new Preset("test", [
        new DraftOption('idB', 'nameB', undefined, undefined, 'CATEGORY_A'),
        new DraftOption('idC', 'nameC', undefined, undefined, 'CATEGORY_B'),
    ], [
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST,
            ['CATEGORY_A']),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST,
            ['CATEGORY_B']),
    ], 'presetID', {pick: {}, ban: {"CATEGORY_A": 1, "CATEGORY_B": 1, "CATEGORY_C": 1}});
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_918]);
});

it('VLD_999: totally wrong preset format', () => {
    let preset = {absolute: "garbage"} as unknown as Preset;
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_999]);
});

describe('Execute parallel turn: Inverse order (1)', () => {
    it.each`
    action          | actionType         | exclusivity
    ${Action.PICK}  | ${ActionType.PICK} | ${Exclusivity.GLOBAL}
    ${Action.PICK}  | ${ActionType.PICK} | ${Exclusivity.NONEXCLUSIVE}
    ${Action.PICK}  | ${ActionType.PICK} | ${Exclusivity.EXCLUSIVE}
    ${Action.BAN}   | ${ActionType.BAN}  | ${Exclusivity.GLOBAL}
    ${Action.BAN}   | ${ActionType.BAN}  | ${Exclusivity.NONEXCLUSIVE}
    ${Action.BAN}   | ${ActionType.BAN}  | ${Exclusivity.EXCLUSIVE}
  `('$exclusivity $action', ({action, actionType, exclusivity}) => {
        let preset = new Preset("test", Civilisation.ALL, [
            new Turn(Player.HOST, action, exclusivity, false, true),
            new Turn(Player.GUEST, action, exclusivity),
        ]);
        const validator = new Validator(prepareReadyStore(preset, []));
        const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, actionType, Civilisation.AZTECS.id));
        expect(errors).toEqual([]);
    });
});

describe('Execute parallel turn: Inverse order (2)', () => {
    it.each`
    action          | actionType         | exclusivity
    ${Action.PICK}  | ${ActionType.PICK} | ${Exclusivity.GLOBAL}
    ${Action.PICK}  | ${ActionType.PICK} | ${Exclusivity.NONEXCLUSIVE}
    ${Action.PICK}  | ${ActionType.PICK} | ${Exclusivity.EXCLUSIVE}
    ${Action.BAN}   | ${ActionType.BAN}  | ${Exclusivity.GLOBAL}
    ${Action.BAN}   | ${ActionType.BAN}  | ${Exclusivity.NONEXCLUSIVE}
    ${Action.BAN}   | ${ActionType.BAN}  | ${Exclusivity.EXCLUSIVE}
  `('$exclusivity $action', ({action, actionType, exclusivity}) => {
        let preset = new Preset("test", Civilisation.ALL, [
            new Turn(Player.HOST, action, exclusivity, false, true),
            new Turn(Player.GUEST, action, exclusivity),
        ]);
        const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.GUEST, actionType, Civilisation.AZTECS.id)]));
        const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, actionType, Civilisation.BRITONS.id));
        expect(errors).toEqual([]);
    });
});

it('Execute parallel turn: Inverse snipe order (2)', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.SNIPE, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.SNIPE, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset,
        [
            new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id),
            new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.BRITONS.id)
        ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
    const errors2: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.SNIPE, Civilisation.BRITONS.id));
    expect(errors2).toEqual([]);
});

it('Execute parallel turn: Regular order (1)', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, []));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('Execute parallel turn: Regular order (2)', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.BRITONS.id));
    expect(errors).toEqual([]);
});

it('Snipe globally banned civ', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.SNIPE, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id),
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('Double Snipe', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.SNIPE, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.SNIPE, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id),
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.BRITONS.id),
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.CHINESE.id),
        new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.BRITONS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.CHINESE.id));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global pick', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global pick 2', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global pick parallel inverse', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, true, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global pick 2 parallel inverse', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, true, true),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global ban', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global ban 2', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global ban parallel inverse', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, true, true),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global ban 2 parallel inverse', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL, true, true),
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('Hidden pick first and last', ()=>{
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, true),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.VIKINGS.id));
    expect(errors).toEqual([]);
});

it('Hidden ban first and last', ()=>{
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL, true),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.VIKINGS.id));
    expect(errors).toEqual([]);
});

it('Inverse turn', ()=>{
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, false, false, Player.GUEST),
    ]);
    const validator = new Validator(prepareReadyStore(preset, []));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.VIKINGS.id, false, Player.GUEST));
    expect(errors).toEqual([]);
});

it('Inverse turns inverse order', ()=>{
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, false, true, Player.GUEST),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL, false, false, Player.HOST),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.VIKINGS.id, false, Player.HOST)
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.VIETNAMESE.id, false, Player.GUEST));
    expect(errors).toEqual([]);
});

it('VLD_001: Inverse turn by wrong player', ()=>{
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, false, false, Player.GUEST),
    ]);
    const validator = new Validator(prepareReadyStore(preset, []));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.VIKINGS.id, false, Player.HOST));
    expect(errors).toEqual([ValidationId.VLD_001]);
});

it('VLD_001: Inverse turns inverse order 1', ()=>{
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, false, true, Player.GUEST),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL, false, false, Player.HOST),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.VIKINGS.id, false, Player.HOST));
    expect(errors).toEqual([ValidationId.VLD_001]);
});

it('VLD_001: Inverse turns inverse order 2', ()=>{
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, false, true, Player.GUEST),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL, false, false, Player.HOST),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.VIKINGS.id, false, Player.HOST)
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.VIETNAMESE.id, false, Player.HOST));
    expect(errors).toEqual([ValidationId.VLD_001]);
});

it('Steal picked civ', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.STEAL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.STEAL, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('Steal nonpicked civ', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.STEAL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.STEAL, Civilisation.BRITONS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('Steal back stolen civ', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.STEAL, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.STEAL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id),
        new PlayerEvent(Player.GUEST, ActionType.STEAL, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.STEAL, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('Steal banned civ', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.STEAL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id),
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.STEAL, Civilisation.AZTECS.id));
    expect(errors).toEqual([]);
});

it('Steal previously sniped civ', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.SNIPE, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.STEAL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id),
        new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.STEAL, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010 Cannot ban a globally banned civ again 1', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

it('VLD_010 Cannot ban a globally banned civ again 2', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.BAN, Exclusivity.NONEXCLUSIVE),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS.id),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id));
    expect(errors).toEqual([ValidationId.VLD_010]);
});

describe('VLD_010 dumb bans: globally ban an exclusively picked civ by opponent', () => {
    it.each`
    player1         | player2
    ${Player.HOST}  | ${Player.GUEST}
    ${Player.GUEST} | ${Player.HOST}
  `('$player1 $player2', ({player1, player2}) => {
        let preset = new Preset("test", Civilisation.ALL, [
            new Turn(player1, Action.PICK, Exclusivity.EXCLUSIVE),
            new Turn(player2, Action.BAN, Exclusivity.GLOBAL),
        ]);
        const validator = new Validator(prepareReadyStore(preset, [
            new PlayerEvent(player1, ActionType.PICK, Civilisation.AZTECS.id),
        ]));
        const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(player2, ActionType.BAN, Civilisation.AZTECS.id));
        expect(errors).toEqual([ValidationId.VLD_010]);
    })
});

describe('VLD_010 bans: globally ban an exclusively picked civ by yourself', () => {
    it.each`
    player1         | player2
    ${Player.HOST}  | ${Player.HOST}
    ${Player.GUEST} | ${Player.GUEST}
  `('$player1 $player2', ({player1, player2}) => {
        let preset = new Preset("test", Civilisation.ALL, [
            new Turn(player1, Action.PICK, Exclusivity.EXCLUSIVE),
            new Turn(player2, Action.BAN, Exclusivity.GLOBAL),
        ]);
        const validator = new Validator(prepareReadyStore(preset, [
            new PlayerEvent(player1, ActionType.PICK, Civilisation.AZTECS.id),
        ]));
        const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(player2, ActionType.BAN, Civilisation.AZTECS.id));
        expect(errors).toEqual([]);
    })
});

describe('VLD_010 dumb bans: ban a globally picked civ', () => {
    it.each`
    player1         | player2         | banExclusivity
    ${Player.HOST}  | ${Player.GUEST} | ${Exclusivity.GLOBAL}
    ${Player.HOST}  | ${Player.GUEST} | ${Exclusivity.EXCLUSIVE}
    ${Player.GUEST} | ${Player.HOST}  | ${Exclusivity.GLOBAL}
    ${Player.GUEST} | ${Player.HOST}  | ${Exclusivity.EXCLUSIVE}
  `('$player1 $player2 $banExclusivity', ({player1, player2, banExclusivity}) => {
        let preset = new Preset("test", Civilisation.ALL, [
            new Turn(player1, Action.PICK, Exclusivity.GLOBAL),
            new Turn(player2, Action.BAN, banExclusivity),
        ]);
        const validator = new Validator(prepareReadyStore(preset, [
            new PlayerEvent(player1, ActionType.PICK, Civilisation.AZTECS.id),
        ]));
        const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(player2, ActionType.BAN, Civilisation.AZTECS.id));
        expect(errors).toEqual([ValidationId.VLD_010]);
    })
});

describe('VLD_010 bans: globally ban an exclusively banned civ by opponent', () => {
    it.each`
    player1         | player2
    ${Player.HOST}  | ${Player.GUEST}
    ${Player.GUEST} | ${Player.HOST}
  `('$player1 $player2', ({player1, player2}) => {
        let preset = new Preset("test", Civilisation.ALL, [
            new Turn(player1, Action.BAN, Exclusivity.EXCLUSIVE),
            new Turn(player2, Action.BAN, Exclusivity.GLOBAL),
        ]);
        const validator = new Validator(prepareReadyStore(preset, [
            new PlayerEvent(player1, ActionType.BAN, Civilisation.AZTECS.id),
        ]));
        const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(player2, ActionType.BAN, Civilisation.AZTECS.id));
        expect(errors).toEqual([]);
    })
});

describe('VLD_010 dumb bans: globally ban an exclusively banned civ by yourself', () => {
    it.each`
    player1         | player2
    ${Player.HOST}  | ${Player.HOST}
    ${Player.GUEST} | ${Player.GUEST}
  `('$player1 $player2', ({player1, player2}) => {
        let preset = new Preset("test", Civilisation.ALL, [
            new Turn(player1, Action.BAN, Exclusivity.EXCLUSIVE),
            new Turn(player2, Action.BAN, Exclusivity.GLOBAL),
        ]);
        const validator = new Validator(prepareReadyStore(preset, [
            new PlayerEvent(player1, ActionType.BAN, Civilisation.AZTECS.id),
        ]));
        const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(player2, ActionType.BAN, Civilisation.AZTECS.id));
        expect(errors).toEqual([ValidationId.VLD_010]);
    })
});

describe('VLD_010 no more options left, must choose random', () => {
    it.each`
    player1         | player2         | actionType         | action
    ${Player.HOST}  | ${Player.GUEST} | ${ActionType.PICK} | ${Action.PICK}
    ${Player.HOST}  | ${Player.GUEST} | ${ActionType.BAN}  | ${Action.BAN}
    ${Player.GUEST} | ${Player.HOST}  | ${ActionType.PICK} | ${Action.PICK}
    ${Player.GUEST} | ${Player.HOST}  | ${ActionType.BAN}  | ${Action.BAN}
  `('$player1 $player2 $actionType', ({player1, player2, actionType, action}) => {
        let preset = new Preset("test", [Civilisation.AZTECS], [
            new Turn(player1, action, Exclusivity.GLOBAL),
            new Turn(player2, action, Exclusivity.GLOBAL),
        ]);
        const validator = new Validator(prepareReadyStore(preset, [
            new PlayerEvent(player1, actionType, Civilisation.AZTECS.id),
        ]));
        const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(player2, actionType, Civilisation.RANDOM.id));
        expect(errors).toEqual([]);
    })
});

describe('VLD_010 cannot use civ from wrong category', () => {
    it.each`
    player1         | player2         | actionType         | action
    ${Player.HOST}  | ${Player.GUEST} | ${ActionType.PICK} | ${Action.PICK}
    ${Player.HOST}  | ${Player.GUEST} | ${ActionType.BAN}  | ${Action.BAN}
    ${Player.GUEST} | ${Player.HOST}  | ${ActionType.PICK} | ${Action.PICK}
    ${Player.GUEST} | ${Player.HOST}  | ${ActionType.BAN}  | ${Action.BAN}
  `('$player1 $player2 $actionType', ({player1, player2, actionType, action}) => {
        let preset = new Preset("test", [
            new DraftOption('first', 'first', DraftOption.defaultImageUrlsForCivilisation('first'), 'civs.', 'categoryA'),
            new DraftOption('second', 'second', DraftOption.defaultImageUrlsForCivilisation('second'), 'civs.', 'categoryB'),
        ], [
            new Turn(player1, action, Exclusivity.GLOBAL, false, false, player1, ['categoryA']),
            new Turn(player2, action, Exclusivity.GLOBAL, false, false, player2, ['categoryB']),
        ]);
        const validator = new Validator(prepareReadyStore(preset, []));
        const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(player1, actionType, 'second'));
        expect(errors).toEqual([ValidationId.VLD_010]);
    });
});

describe('VLD_010 can use civ from right category', () => {
    it.each`
    player1         | player2         | actionType         | action
    ${Player.HOST}  | ${Player.GUEST} | ${ActionType.PICK} | ${Action.PICK}
    ${Player.HOST}  | ${Player.GUEST} | ${ActionType.BAN}  | ${Action.BAN}
    ${Player.GUEST} | ${Player.HOST}  | ${ActionType.PICK} | ${Action.PICK}
    ${Player.GUEST} | ${Player.HOST}  | ${ActionType.BAN}  | ${Action.BAN}
  `('$player1 $player2 $actionType', ({player1, player2, actionType, action}) => {
        let preset = new Preset("test", [
            new DraftOption('first', 'first', DraftOption.defaultImageUrlsForCivilisation('first'), 'civs.', 'categoryA'),
            new DraftOption('second', 'second', DraftOption.defaultImageUrlsForCivilisation('second'), 'civs.', 'categoryB'),
        ], [
            new Turn(player1, action, Exclusivity.GLOBAL, false, false, player1, ['categoryA']),
            new Turn(player2, action, Exclusivity.GLOBAL, false, false, player2, ['categoryB']),
        ]);
        const validator = new Validator(prepareReadyStore(preset, []));
        const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(player1, actionType, 'first'));
        expect(errors).toEqual([]);
    });
});

describe('VLD_010 cannot exceed category limit', () => {
    it.each`
    player1         | player2         | actionType         | action
    ${Player.HOST}  | ${Player.GUEST} | ${ActionType.PICK} | ${Action.PICK}
    ${Player.HOST}  | ${Player.GUEST} | ${ActionType.BAN}  | ${Action.BAN}
    ${Player.GUEST} | ${Player.HOST}  | ${ActionType.PICK} | ${Action.PICK}
    ${Player.GUEST} | ${Player.HOST}  | ${ActionType.BAN}  | ${Action.BAN}
  `('$player1 $player2 $actionType', ({player1, player2, actionType, action}) => {
        let preset = new Preset("test", [
            new DraftOption('first', 'first', DraftOption.defaultImageUrlsForCivilisation('first'), 'civs.', 'categoryA'),
            new DraftOption('second', 'second', DraftOption.defaultImageUrlsForCivilisation('second'), 'civs.', 'categoryB'),
            new DraftOption('third', 'third', DraftOption.defaultImageUrlsForCivilisation('third'), 'civs.', 'categoryB'),
        ], [
            new Turn(player1, action, Exclusivity.GLOBAL, false, false, player1, ['categoryA']),
            new Turn(player2, action, Exclusivity.GLOBAL, false, false, player2, ['categoryB']),
        ], 'presetID', {pick: {categoryB: 1}, ban: {categoryB: 1}});
        const validator = new Validator(prepareReadyStore(preset, [
            new PlayerEvent(player1, actionType, 'second'),
        ]));
        const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(player2, actionType, 'third'));
        expect(errors).toEqual([ValidationId.VLD_010]);
    });
});

it('Validator does not modify offsets', () => {
    const expectedOffset = -1337;
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL)
    ]);
    const firstEvent = new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id);
    firstEvent.offset = expectedOffset;
    const secondEvent = new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.BRITONS.id);
    const draftsStore = prepareReadyStore(preset, [firstEvent]);
    expect(draftsStore.getEvents(DRAFT_ID)[0].offset).toEqual(expectedOffset);

    Validator.checkAllValidations(DRAFT_ID, draftsStore, secondEvent);

    expect(draftsStore.getEvents(DRAFT_ID)[0].offset).toEqual(expectedOffset);
});

const prepareStore = (preset: Preset, events: DraftEvent[] = []): DraftsStore => {
    const draft = new Draft(NAME_HOST, NAME_GUEST, preset);
    draft.events.push(...events);
    const draftsStore = new DraftsStore(null);
    draftsStore.createDraft(DRAFT_ID, draft);
    return draftsStore;
};

const prepareReadyStore = (preset: Preset, events: DraftEvent[] = []): DraftsStore => {
    const draftsStore = prepareStore(preset, events);
    draftsStore.setPlayerReady(DRAFT_ID, Player.HOST);
    draftsStore.setPlayerReady(DRAFT_ID, Player.GUEST);
    return draftsStore;
};
