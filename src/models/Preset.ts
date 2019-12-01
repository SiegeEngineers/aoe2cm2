import Civilisation from "./Civilisation";
import Turn from "./Turn";
import {CivilisationEncoder} from "../util/CivilisationEncoder";
import {Assert} from "../util/Assert";
import Player from "./Player";
import Action from "./Action";
import Exclusivity from "./Exclusivity";

class Preset {

    public static readonly EMPTY: Preset = new Preset('', [], []);

    public static readonly NEW: Preset = new Preset('Change me', Civilisation.ALL, []);

    public static readonly SAMPLE: Preset = new Preset('Default Preset', Civilisation.ALL, [
        Turn.HOST_GLOBAL_BAN,
        Turn.GUEST_GLOBAL_BAN,
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.REVEAL_ALL,
        Turn.HOST_GLOBAL_PICK,
        Turn.GUEST_GLOBAL_PICK,
        Turn.HOST_PICK,
        Turn.GUEST_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.REVEAL_ALL,
        Turn.HOST_HIDDEN_SNIPE,
        Turn.GUEST_HIDDEN_SNIPE,
        Turn.REVEAL_ALL
    ]);

    public static readonly SIMPLE: Preset = new Preset('Simple Preset', Civilisation.ALL, [
        Turn.HOST_NONEXCLUSIVE_BAN,
        Turn.GUEST_NONEXCLUSIVE_BAN,
        Turn.GUEST_NONEXCLUSIVE_PICK,
        Turn.HOST_NONEXCLUSIVE_PICK
    ]);

    public static readonly ILLEGAL: Preset = new Preset('Illegal Preset', Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
    ]);

    public static readonly SIMPLE_PARALLEL: Preset = new Preset('Simple Parallel', Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL),
    ]);

    public static readonly REVEAL_TEST: Preset = new Preset('Reveal Test', Civilisation.ALL, [
        new Turn(Player.HOST, Action.PICK, Exclusivity.NONEXCLUSIVE, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.NONEXCLUSIVE, true),
        new Turn(Player.HOST, Action.BAN, Exclusivity.NONEXCLUSIVE, true),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.NONEXCLUSIVE, true),
        new Turn(Player.NONE, Action.REVEAL_PICKS, Exclusivity.GLOBAL),
        new Turn(Player.HOST, Action.SNIPE, Exclusivity.NONEXCLUSIVE, true),
        new Turn(Player.GUEST, Action.SNIPE, Exclusivity.NONEXCLUSIVE, true),
        new Turn(Player.HOST, Action.PICK, Exclusivity.NONEXCLUSIVE, true),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.NONEXCLUSIVE, true),
        new Turn(Player.HOST, Action.BAN, Exclusivity.NONEXCLUSIVE, true),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.NONEXCLUSIVE, true),
        new Turn(Player.NONE, Action.REVEAL_PICKS, Exclusivity.GLOBAL),
        new Turn(Player.NONE, Action.REVEAL_BANS, Exclusivity.GLOBAL),
        new Turn(Player.NONE, Action.REVEAL_SNIPES, Exclusivity.GLOBAL),
    ]);

    public static readonly HIDDEN_1V1: Preset = new Preset('Hidden 1v1', Civilisation.ALL, [
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.HOST_HIDDEN_BAN,
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.REVEAL_ALL,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.REVEAL_ALL
    ]);

    public static readonly HIDDEN_2V2: Preset = new Preset('Hidden 2v2', Civilisation.ALL, [
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.REVEAL_ALL,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.REVEAL_ALL,
        Turn.GUEST_HIDDEN_BAN,
        Turn.HOST_HIDDEN_BAN,
        Turn.REVEAL_ALL,
        Turn.GUEST_HIDDEN_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.REVEAL_ALL,
    ]);

    public static readonly HIDDEN_3V3: Preset = new Preset('Hidden 3v3', Civilisation.ALL, [
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.REVEAL_ALL,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.REVEAL_ALL,
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.REVEAL_ALL,
        Turn.GUEST_HIDDEN_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.REVEAL_ALL,
        Turn.GUEST_HIDDEN_BAN,
        Turn.HOST_HIDDEN_BAN,
        Turn.REVEAL_ALL,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.REVEAL_ALL,
    ]);

    public static readonly HIDDEN_4V4: Preset = new Preset('Hidden 4v4', Civilisation.ALL, [
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.REVEAL_ALL,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.REVEAL_ALL,
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.REVEAL_ALL,
        Turn.GUEST_HIDDEN_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.REVEAL_ALL,
        Turn.GUEST_HIDDEN_BAN,
        Turn.HOST_HIDDEN_BAN,
        Turn.REVEAL_ALL,
        Turn.GUEST_HIDDEN_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.REVEAL_ALL,
    ]);

    public static readonly M_CIVS: Preset = new Preset('M Civs', [Civilisation.MAGYARS, Civilisation.MALAY, Civilisation.MALIANS, Civilisation.MAYANS, Civilisation.MONGOLS], [
        Turn.HOST_PICK, Turn.GUEST_PICK
    ]);

    public readonly name: string;
    public readonly encodedCivilisations: string;
    public readonly turns: Turn[];

    constructor(name: string, civilisations: Civilisation[], turns: Turn[] = []) {
        this.name = name;
        this.encodedCivilisations = CivilisationEncoder.encodeCivilisationArray(civilisations);
        this.turns = turns;
    }

    public static fromPojo(preset: { name: string, encodedCivilisations: string, turns: Turn[] } | undefined): Preset | undefined {
        if (preset === undefined) {
            return undefined;
        }
        Assert.isString(preset.name);
        Assert.isString(preset.encodedCivilisations);
        return new Preset(preset.name, CivilisationEncoder.decodeCivilisationArray(preset.encodedCivilisations), Turn.fromPojoArray(preset.turns));
    }

    public addTurn(turn: Turn) {
        this.turns.push(turn);
    }

    get civilisations(): Civilisation[] {
        return CivilisationEncoder.decodeCivilisationArray(this.encodedCivilisations);
    }
}

export default Preset;