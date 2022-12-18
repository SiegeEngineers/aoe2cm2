import * as enzyme from 'enzyme';
import * as React from 'react';
import CustomName from "../../components/draft/CustomName";

it('Short name is not shortened', () => {
    const customName = enzyme.shallow(<CustomName name={'Player Name'}/>);
    expect(customName).toMatchSnapshot();
});

it('Long name is shortened', () => {
    const customName = enzyme.shallow(<CustomName name={'123456789012345678901234567890123456789'}/>);
    expect(customName).toMatchSnapshot();
});

it('32 long name is not shortened', () => {
    const customName = enzyme.shallow(<CustomName name={'12345678901234567890123456789012'}/>);
    expect(customName).toMatchSnapshot();
});

it('33 long name is shortened after 30 characters', () => {
    const customName = enzyme.shallow(<CustomName name={'123456789012345678901234567890123'}/>);
    expect(customName).toMatchSnapshot();
});

it('Whitespace is trimmed before shortening', () => {
    const customName = enzyme.shallow(<CustomName name={'          1234567890123          '}/>);
    expect(customName).toMatchSnapshot();
});
