import {Validator} from "../../models/Validator";
import {DraftsStore} from "../../models/DraftsStore";
import Draft from "../../models/Draft";
import Preset from "../../models/Preset";
import PlayerEvent from "../../models/PlayerEvent";
import Player from "../../models/Player";
import ActionType from "../../models/ActionType";
import Civilisation from "../../models/Civilisation";
import {ValidationId} from "../../models/ValidationId";
import Action from "../../models/Action";
import Turn from "../../models/Turn";
import {DraftEvent} from "../../models/DraftEvent";
import AdminEvent from "../../models/AdminEvent";

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
    expect(preset.turns[0].action).toEqual(Action.NONEXCLUSIVE_BAN);
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
    let preset = new Preset("test", Civilisation.ALL, [Turn.GUEST_NONEXLCUSIVE_BAN, Turn.HOST_NONEXCLUSIVE_PICK]);
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
    let preset = new Preset("test", Civilisation.ALL, [Turn.GUEST_BAN, Turn.GUEST_NONEXLCUSIVE_BAN]);
    const validator = new Validator(prepareReadyStore(preset, [new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS)]));
    const errors: ValidationId[] = validator.validateAndApply(DRAFT_ID, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.AZTECS));
    expect(errors).toEqual([ValidationId.VLD_200]);
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
