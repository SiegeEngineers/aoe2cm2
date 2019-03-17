import NameGenerator from "../../models/NameGenerator";

it('NameGenerator throws error when initialized with 0', () => {
    expect(() => {
        new NameGenerator(0);
    }).toThrowError('LCG must not be initialized with 0');
});

it('NameGenerator yields deterministic results', () => {
    const nameGenerator = new NameGenerator(14);
    const values = [];
    for (let i = 0; i < 10; i++) {
        values.push(nameGenerator.nextName());
    }
    expect(values).toMatchSnapshot();
});
