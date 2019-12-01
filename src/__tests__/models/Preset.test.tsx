import Preset from "../../models/Preset";
import Turn from "../../models/Turn";
import Exclusivity from "../../constants/Exclusivity";

it('preset from invalid pojo throws', () => {
    expect(() => {
        Preset.fromPojo({turns: [{} as Turn, {} as Turn]} as { name: string, encodedCivilisations: string, turns: Turn[] });
    }).toThrowError("Expected argument to be string, but was undefined");
});

it('preset from valid pojo works', () => {
    const fromPojo = Preset.fromPojo({
        name: "some-name",
        encodedCivilisations: "0x1",
        turns: [{
            player: "GUEST",
            action: "PICK",
            exclusivity: Exclusivity.NONEXCLUSIVE,
            hidden: false,
            parallel: false
        }]
    } as { name: string, encodedCivilisations: string, turns: Turn[] });
    expect(fromPojo).toMatchSnapshot();
});