import Preset from "../../models/Preset";
import Pool from "../../models/Pool";
import Turn from "../../models/Turn";
import DraftOption from "../../models/DraftOption";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";
import {Validator} from "../../models/Validator";
import {ValidationId} from "../../constants/ValidationId";

const turnInPool = (poolId?: string) =>
    new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST, ['default'], undefined, poolId);

const pooledPreset = (pools: Pool[], turns: Turn[]) =>
    new Preset('Preset name', pools, turns);

const maps = new Pool('maps', 'Maps', [new DraftOption('arabia')]);
const civs = new Pool('civs', 'Civilisations', [new DraftOption('Franks')]);

it('a preset with one pool is valid, its pool named Default', () => {
    const preset = new Preset('Preset name', [Pool.defaultWith([new DraftOption('arabia')])], [turnInPool()]);
    expect(preset.pools[0].name).toEqual('Default');
    expect(Validator.validatePreset(preset)).toEqual([]);
});

it('VLD_922: a lone pool without a name is rejected too', () => {
    const preset = new Preset('Preset name', [new Pool('default', ' ', [new DraftOption('arabia')])], [turnInPool()]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_922);
});

it('pooled preset whose turns reference existing pools is valid', () => {
    const preset = pooledPreset([maps, civs], [turnInPool('maps'), turnInPool('civs')]);
    expect(Validator.validatePreset(preset)).toEqual([]);
});

it('turn referencing an unknown pool is rejected', () => {
    const preset = pooledPreset([maps, civs], [turnInPool('nope')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_919);
});

it('turn left in the default pool of a pooled preset is rejected', () => {
    const preset = pooledPreset([maps, civs], [turnInPool('maps'), turnInPool()]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_919);
});

it('duplicate pool ids are rejected', () => {
    const duplicate = new Pool('maps', 'Maps again', [new DraftOption('arena')]);
    const preset = pooledPreset([maps, duplicate], [turnInPool('maps')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_920);
});

it('reveal and pause turns do not need to belong to a pool', () => {
    const revealTurn = new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL);
    const pauseTurn = new Turn(Player.NONE, Action.PAUSE, Exclusivity.GLOBAL);
    const preset = pooledPreset([maps, civs], [turnInPool('maps'), revealTurn, pauseTurn, turnInPool('civs')]);
    expect(Validator.validatePreset(preset)).toEqual([]);
});

it('an admin ban does need a pool, since it draws an option', () => {
    const adminBan = new Turn(Player.NONE, Action.BAN, Exclusivity.GLOBAL);
    const preset = pooledPreset([maps, civs], [adminBan, turnInPool('maps'), turnInPool('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_919);
});

it('an admin ban bound to a pool is accepted', () => {
    const adminBan = new Turn(Player.NONE, Action.BAN, Exclusivity.GLOBAL, false, false, Player.NONE, ['default'], undefined, 'civs');
    const preset = pooledPreset([maps, civs], [adminBan, turnInPool('maps'), turnInPool('civs')]);
    expect(Validator.validatePreset(preset)).toEqual([]);
});

it('an option id repeated across pools is rejected', () => {
    const duplicate = new Pool('civs', 'Civilisations', [new DraftOption('arabia')]);
    const preset = pooledPreset([maps, duplicate], [turnInPool('maps'), turnInPool('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_911);
});

it('an empty option id inside a pool is rejected', () => {
    const broken = new Pool('civs', 'Civilisations', [new DraftOption('')]);
    const preset = pooledPreset([maps, broken], [turnInPool('maps'), turnInPool('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_910);
});

it('a turn whose pool has no options is rejected', () => {
    const empty = new Pool('civs', 'Civilisations', []);
    const preset = pooledPreset([maps, empty], [turnInPool('maps'), turnInPool('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_921);
});

it('an empty pool nobody plays in is accepted', () => {
    const empty = new Pool('civs', 'Civilisations', []);
    const preset = pooledPreset([maps, empty], [turnInPool('maps')]);
    expect(Validator.validatePreset(preset)).toEqual([]);
});

it('a turn whose pool holds no option of its categories is rejected', () => {
    const land = new Pool('maps', 'Maps', [new DraftOption('arabia', 'arabia', undefined, '', 'land')]);
    const civ = new Pool('civs', 'Civilisations', [new DraftOption('Franks', 'Franks', undefined, '', 'civ')]);
    const turn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST, ['civ'], undefined, 'maps');
    const preset = pooledPreset([land, civ], [turn, turnInPool('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_921);
});

it('a parallel pair may span two pools', () => {
    const parallel = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true, Player.HOST, ['default'], undefined, 'maps');
    const partner = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST, ['default'], undefined, 'civs');
    const preset = pooledPreset([maps, civs], [parallel, partner]);
    expect(Validator.validatePreset(preset)).toEqual([]);
});

it('a pool without a name is rejected', () => {
    const nameless = new Pool('civs', '  ', [new DraftOption('Franks')]);
    const preset = pooledPreset([maps, nameless], [turnInPool('maps'), turnInPool('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_922);
});

it('an option no turn of its own pool could take is rejected', () => {
    const land = new DraftOption('arabia', 'arabia', undefined, '', 'land');
    const water = new DraftOption('islands', 'islands', undefined, '', 'water');
    const pool = new Pool('maps', 'Maps', [land, water]);
    const turn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST, ['land'], undefined, 'maps');
    const preset = pooledPreset([pool, civs], [turn, turnInPool('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_923);
});

it('a pool nobody drafts from keeps its options', () => {
    const spare = new Pool('spare', 'Spare', [new DraftOption('islands')]);
    const preset = pooledPreset([maps, civs, spare], [turnInPool('maps'), turnInPool('civs')]);
    expect(Validator.validatePreset(preset)).toEqual([]);
});
