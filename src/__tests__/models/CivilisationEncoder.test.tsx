import {CivilisationEncoder} from "../../util/CivilisationEncoder";
import Civilisation from "../../models/Civilisation";

it('encode empty yields 0', () => {
    const encoded = CivilisationEncoder.encodeCivilisationArray([]);
    expect(encoded).toEqual(CivilisationEncoder.toHexString(0));
    expect(encoded).toEqual('0');
});

it('aztecs only yields 1', () => {
    const encoded = CivilisationEncoder.encodeCivilisationArray([Civilisation.AZTECS]);
    expect(encoded).toEqual(CivilisationEncoder.toHexString(1));
    expect(encoded).toEqual('1');
});

it('vikings only yields 2^30', () => {
    const encoded = CivilisationEncoder.encodeCivilisationArray([Civilisation.VIKINGS]);
    expect(encoded).toEqual(CivilisationEncoder.toHexString(Math.pow(2, 30)));
    expect(encoded).toEqual('40000000');
});

it('all 60 civs yield 2^60-1', () => {
    const encoded = CivilisationEncoder.encodeCivilisationArray(Civilisation.ALL);
    expect(Civilisation.ALL.length).toEqual(60);
    expect(Civilisation.ALL_ACTIVE.length).toEqual(53);
    expect(encoded).toEqual('fffffffffffffff');
});

it('decode 0 yields empty array', () => {
    const decoded = CivilisationEncoder.decodeCivilisationArray('0');
    expect(decoded).toEqual([]);
});

it('decode 1 yields aztecs', () => {
    const decoded = CivilisationEncoder.decodeCivilisationArray('1');
    expect(decoded).toEqual([Civilisation.AZTECS]);

});

it('decode 2^30 yields vikings', () => {
    const decoded = CivilisationEncoder.decodeCivilisationArray('40000000');
    expect(decoded).toEqual([Civilisation.VIKINGS]);

});

it('decode 2^60-1 yields all civs', () => {
    const decoded = CivilisationEncoder.decodeCivilisationArray('fffffffffffffff');
    expect(decoded).toEqual([...Civilisation.ALL].sort((a, b) => a.name.localeCompare(b.name)));
});

it('decode invalid yields empty array', () => {
    const decoded = CivilisationEncoder.decodeCivilisationArray('invalid');
    expect(decoded).toEqual([]);
});

it('assert order of civilisations has not changed', () => {
    expect(Civilisation.ALL).toMatchSnapshot();
});


describe('The decoding shortcut does not lie', () => {
    it.each`
    civilisationArray | expectedLength
    ${'7ffffffff'}    | ${35}
    ${'1fffffffff'}   | ${37}
    ${'7fffffffff'}   | ${39}
    ${'7ffffffffff'}   | ${43}
    ${'7ffffffefff'}   | ${42}
    ${'fffffffefff'}   | ${43}
    ${'3fffffffefff'}   | ${45}
    ${'1ffffffffefff'}   | ${48}
    ${'3e3fffffffefff'}   | ${50}
    ${'e3e3fffffffefff'}   | ${53}
  `('$civilisationArray', ({civilisationArray, expectedLength}) => {
        const decoded = CivilisationEncoder.decodeCivilisationArray(civilisationArray);
        expect(decoded.length).toEqual(expectedLength);
    });
});

describe('toBits works well', () => {
    it.each`
    encoded | result
    ${''}    | ${[]}
    ${'1'}    | ${[true]}
    ${'2'}    | ${[true, false]}
    ${'3'}    | ${[true, true]}
    ${'4'}    | ${[true, false, false]}
    ${'8'}    | ${[true, false, false, false]}
    ${'f'}    | ${[true, true, true, true]}
    ${'3f'}    | ${[true, true, true, true, true, true]}
    ${'ff'}    | ${[true, true, true, true, true, true, true, true]}
  `('$civilisationArray', ({encoded, result}) => {
        const bits = CivilisationEncoder.toBits(encoded);
        expect(bits).toEqual(result);
    });
});
