import Preset from "../../models/Preset";
import Segment from "../../models/Segment";
import Turn from "../../models/Turn";
import DraftOption from "../../models/DraftOption";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";
import {Validator} from "../../models/Validator";
import {ValidationId} from "../../constants/ValidationId";

const turnInSegment = (segmentId?: string) =>
    new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST, ['default'], undefined, segmentId);

const segmentedPreset = (segments: Segment[], turns: Turn[]) =>
    new Preset('Preset name', [], turns, undefined, undefined, segments);

const maps = new Segment('maps', 'Maps', [new DraftOption('arabia')]);
const civs = new Segment('civs', 'Civilisations', [new DraftOption('Franks')]);

it('legacy preset without segments is valid', () => {
    const preset = new Preset('Preset name', [new DraftOption('arabia')], [turnInSegment()]);
    expect(Validator.validatePreset(preset)).toEqual([]);
});

it('segmented preset whose turns reference existing segments is valid', () => {
    const preset = segmentedPreset([maps, civs], [turnInSegment('maps'), turnInSegment('civs')]);
    expect(Validator.validatePreset(preset)).toEqual([]);
});

it('turn referencing an unknown segment is rejected', () => {
    const preset = segmentedPreset([maps, civs], [turnInSegment('nope')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_919);
});

it('turn left in the default segment of a segmented preset is rejected', () => {
    const preset = segmentedPreset([maps, civs], [turnInSegment('maps'), turnInSegment()]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_919);
});

it('duplicate segment ids are rejected', () => {
    const duplicate = new Segment('maps', 'Maps again', [new DraftOption('arena')]);
    const preset = segmentedPreset([maps, duplicate], [turnInSegment('maps')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_920);
});

it('reveal and pause turns do not need to belong to a segment', () => {
    const revealTurn = new Turn(Player.NONE, Action.REVEAL_ALL, Exclusivity.GLOBAL);
    const pauseTurn = new Turn(Player.NONE, Action.PAUSE, Exclusivity.GLOBAL);
    const preset = segmentedPreset([maps, civs], [turnInSegment('maps'), revealTurn, pauseTurn, turnInSegment('civs')]);
    expect(Validator.validatePreset(preset)).toEqual([]);
});

it('an admin ban does need a segment, since it draws an option', () => {
    const adminBan = new Turn(Player.NONE, Action.BAN, Exclusivity.GLOBAL);
    const preset = segmentedPreset([maps, civs], [adminBan, turnInSegment('maps'), turnInSegment('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_919);
});

it('an admin ban bound to a pool is accepted', () => {
    const adminBan = new Turn(Player.NONE, Action.BAN, Exclusivity.GLOBAL, false, false, Player.NONE, ['default'], undefined, 'civs');
    const preset = segmentedPreset([maps, civs], [adminBan, turnInSegment('maps'), turnInSegment('civs')]);
    expect(Validator.validatePreset(preset)).toEqual([]);
});

it('an option id repeated across pools is rejected', () => {
    const duplicate = new Segment('civs', 'Civilisations', [new DraftOption('arabia')]);
    const preset = segmentedPreset([maps, duplicate], [turnInSegment('maps'), turnInSegment('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_911);
});

it('an empty option id inside a pool is rejected', () => {
    const broken = new Segment('civs', 'Civilisations', [new DraftOption('')]);
    const preset = segmentedPreset([maps, broken], [turnInSegment('maps'), turnInSegment('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_910);
});

it('a turn whose pool has no options is rejected', () => {
    const empty = new Segment('civs', 'Civilisations', []);
    const preset = segmentedPreset([maps, empty], [turnInSegment('maps'), turnInSegment('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_921);
});

it('an empty pool nobody plays in is accepted', () => {
    const empty = new Segment('civs', 'Civilisations', []);
    const preset = segmentedPreset([maps, empty], [turnInSegment('maps')]);
    expect(Validator.validatePreset(preset)).toEqual([]);
});

it('a turn whose pool holds no option of its categories is rejected', () => {
    const land = new Segment('maps', 'Maps', [new DraftOption('arabia', 'arabia', undefined, '', 'land')]);
    const civ = new Segment('civs', 'Civilisations', [new DraftOption('Franks', 'Franks', undefined, '', 'civ')]);
    const turn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST, ['civ'], undefined, 'maps');
    const preset = segmentedPreset([land, civ], [turn, turnInSegment('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_921);
});

it('a parallel pair split across two pools is rejected', () => {
    const parallel = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true, Player.HOST, ['default'], undefined, 'maps');
    const partner = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST, ['default'], undefined, 'civs');
    const preset = segmentedPreset([maps, civs], [parallel, partner]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_922);
});

it('a parallel pair inside one pool is accepted', () => {
    const parallel = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true, Player.HOST, ['default'], undefined, 'maps');
    const partner = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.GUEST, ['default'], undefined, 'maps');
    const preset = segmentedPreset([maps, civs], [parallel, partner, turnInSegment('civs')]);
    expect(Validator.validatePreset(preset)).toEqual([]);
});

it('a pool without a name is rejected', () => {
    const nameless = new Segment('civs', '  ', [new DraftOption('Franks')]);
    const preset = segmentedPreset([maps, nameless], [turnInSegment('maps'), turnInSegment('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_923);
});

it('an option no turn of its own pool could take is rejected', () => {
    const land = new DraftOption('arabia', 'arabia', undefined, '', 'land');
    const water = new DraftOption('islands', 'islands', undefined, '', 'water');
    const pool = new Segment('maps', 'Maps', [land, water]);
    const turn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, false, Player.HOST, ['land'], undefined, 'maps');
    const preset = segmentedPreset([pool, civs], [turn, turnInSegment('civs')]);
    expect(Validator.validatePreset(preset)).toContain(ValidationId.VLD_924);
});

it('a pool nobody drafts from keeps its options', () => {
    const spare = new Segment('spare', 'Spare', [new DraftOption('islands')]);
    const preset = segmentedPreset([maps, civs, spare], [turnInSegment('maps'), turnInSegment('civs')]);
    expect(Validator.validatePreset(preset)).toEqual([]);
});
