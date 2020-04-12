import Civilisation from "./Civilisation";
import Turn from "./Turn";
import {CivilisationEncoder} from "../util/CivilisationEncoder";
import {Assert} from "../util/Assert";

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