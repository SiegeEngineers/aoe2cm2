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

const NAME_HOST: string = 'Yodit';
const NAME_GUEST: string = 'Saladin';
const DRAFT_ID: string = 'draftid';

it('VLD_000: host not ready', () => {
    let preset = Preset.SIMPLE;
    let draftsStore = prepareStore(preset);

    draftsStore.setPlayerReady(DRAFT_ID, Player.GUEST);
    const validator = new Validator(draftsStore);
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_000]);
});

it('VLD_000: guest not ready', () => {
    let preset = Preset.SIMPLE;
    let draftsStore = prepareStore(preset);

    draftsStore.setPlayerReady(DRAFT_ID, Player.HOST);
    const validator = new Validator(draftsStore);
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_000]);
});

it('VLD_000: draft finished', () => {
    let preset = Preset.SIMPLE;
    let draftsStore = prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS),
        new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS),
        new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.BRITONS),
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.BRITONS)
    ]);
    const validator = new Validator(draftsStore);
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_000]);
});

it('VLD_001: wrong player to act', () => {
    let preset = Preset.SIMPLE;
    const validator = new Validator(prepareReadyStore(preset));
    expect(preset.turns[0].player).toEqual(Player.HOST);
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_001]);
});

it('VLD_002: wrong action', () => {
    let preset = Preset.SIMPLE;
    const validator = new Validator(prepareReadyStore(preset));
    expect(preset.turns[0].action).toEqual(Action.BAN);
    expect(preset.turns[0].exclusivity).toEqual(Exclusivity.NONEXCLUSIVE);
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_002]);
});

it('VLD_100: civ already globally banned by same player', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_GLOBAL_BAN, Turn.HOST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_100]);
});

it('VLD_100: civ already globally banned by opponent', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_GLOBAL_BAN, Turn.GUEST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_100]);
});

it('VLD_101: civ already banned for host', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_NONEXCLUSIVE_BAN, Turn.GUEST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_101]);
});

it('VLD_101: civ already hidden/revealed banned for host', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_HIDDEN_BAN, Turn.REVEAL_ALL, Turn.GUEST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS), new AdminEvent(Player.NONE, Action.REVEAL_ALL)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_101]);
});

it('VLD_101: civ already hidden/revealed banned for guest', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.GUEST_HIDDEN_BAN, Turn.REVEAL_ALL, Turn.HOST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS), new AdminEvent(Player.NONE, Action.REVEAL_ALL)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_101]);
});

it('VLD_101: civ already banned for guest', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.GUEST_NONEXCLUSIVE_BAN, Turn.HOST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_101]);
});

it('VLD_102: civ already picked by host', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_PICK, Turn.HOST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_102]);
});

it('VLD_102: two nonexclusive picks in a row', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_NONEXCLUSIVE_PICK, Turn.HOST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([]);
});

it('VLD_102: civ already picked by guest', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.GUEST_PICK, Turn.GUEST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_102]);
});

it('VLD_102: civ already picked by opponent', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_PICK, Turn.GUEST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([]);
});

it('VLD_103: civ already globally picked by same player', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_GLOBAL_PICK, Turn.HOST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_103]);
});

it('VLD_103: civ already globally picked by opponent', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_GLOBAL_PICK, Turn.GUEST_NONEXCLUSIVE_PICK]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_103]);
});

it('VLD_200: civ already banned by host', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_BAN, Turn.HOST_NONEXCLUSIVE_BAN]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_200]);
});

it('VLD_200: civ already banned by guest', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.GUEST_BAN, Turn.GUEST_NONEXCLUSIVE_BAN]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_200]);
});

it('VLD_200: two nonexclusive bans in a row', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.GUEST_NONEXCLUSIVE_BAN, Turn.GUEST_NONEXCLUSIVE_BAN]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS));
    expect(errors).toEqual([]);
});

it('VLD_300: civ to snipe not yet picked by opponent', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_NONEXCLUSIVE_PICK, Turn.GUEST_SNIPE]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.BRITONS));
    expect(errors).toEqual([ValidationId.VLD_300]);
});

it('VLD_301: opponent does not have a non-sniped pick of the civ to snipe', () => {
    let preset = new Preset("test", Civilisation.ALL, [Turn.HOST_NONEXCLUSIVE_PICK, Turn.HOST_NONEXCLUSIVE_PICK, Turn.GUEST_SNIPE, Turn.GUEST_SNIPE]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS),
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.BRITONS),
        new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.AZTECS)
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_301]);
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

it('VLD_908: no turns', () => {
    let preset = new Preset("test", Civilisation.ALL, []);
    const errors: ValidationId[] = Validator.validatePreset(preset);
    expect(errors).toEqual([ValidationId.VLD_908]);
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
        const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, actionType, Civilisation.AZTECS));
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
        const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.GUEST, actionType, Civilisation.AZTECS)]));
        const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, actionType, Civilisation.BRITONS));
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
            new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS),
            new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.BRITONS)
        ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.AZTECS));
    expect(errors).toEqual([]);
    const errors2: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.SNIPE, Civilisation.BRITONS));
    expect(errors2).toEqual([]);
});

it('Execute parallel turn: Regular order (1)', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, []));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([]);
});

it('Execute parallel turn: Regular order (2)', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.BRITONS));
    expect(errors).toEqual([]);
});

it('Snipe globally banned civ', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.SNIPE, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS),
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.AZTECS));
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
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS),
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.BRITONS),
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.CHINESE),
        new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.BRITONS),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.SNIPE, Civilisation.CHINESE));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global pick', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global pick 2', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global pick parallel inverse', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, true, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global pick 2 parallel inverse', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, true, true),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global ban', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global ban 2', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global ban parallel inverse', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, true, true),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS));
    expect(errors).toEqual([]);
});

it('Duplicate hidden global ban 2 parallel inverse', () => {
    let preset = new Preset("test", Civilisation.ALL, [
        new Turn(Player.GUEST, Action.BAN, Exclusivity.GLOBAL, true, true),
        new Turn(Player.HOST, Action.BAN, Exclusivity.GLOBAL, true),
        new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL),
    ]);
    const validator = new Validator(prepareReadyStore(preset, [
        new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS),
    ]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS));
    expect(errors).toEqual([]);
});

const prepareStore = (preset: Preset, events: DraftEvent[] = []): DraftsStore => {
    const draft = new Draft(NAME_HOST, NAME_GUEST, preset);
    draft.events.push(...events);
    const draftsStore = new DraftsStore();
    draftsStore.createDraft(DRAFT_ID, draft);
    return draftsStore;
};

const prepareReadyStore = (preset: Preset, events: DraftEvent[] = []): DraftsStore => {
    const draftsStore = prepareStore(preset, events);
    draftsStore.setPlayerReady(DRAFT_ID, Player.HOST);
    draftsStore.setPlayerReady(DRAFT_ID, Player.GUEST);
    return draftsStore;
};
