import Civilisation from "./Civilisation";
import Turn from "./Turn";

class Preset {

    public static readonly SAMPLE: Preset = new Preset('Default Preset', Civilisation.ALL, [
        Turn.HOST_GLOBAL_BAN,
        Turn.GUEST_GLOBAL_BAN,
        Turn.HOST_HIDDEN_BAN,
        Turn.GUEST_HIDDEN_BAN,
        Turn.REVEAL_ALL,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
        Turn.HOST_HIDDEN_PICK,
        Turn.GUEST_HIDDEN_PICK,
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
        Turn.HOST_BAN,
        Turn.GUEST_BAN,
        Turn.GUEST_PICK,
        Turn.HOST_PICK
    ]);

    public readonly name: string;
    public readonly civilisations: Civilisation[];
    public readonly turns: Turn[];

    constructor(name: string, civilisations: Civilisation[], turns: Turn[] = []) {
        this.name = name;
        this.civilisations = civilisations;
        this.turns = turns;
    }

    public addTurn(turn: Turn) {
        this.turns.push(turn);
    }
}

export default Preset;