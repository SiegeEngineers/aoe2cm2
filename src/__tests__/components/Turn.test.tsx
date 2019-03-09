import * as enzyme from 'enzyme';
import * as React from 'react';
import Turn from "../../components/Turn";
import {default as ModelTurn} from "../../models/Turn";

it('gets rendered', () => {
    const turn = enzyme.shallow(<Turn turn={ModelTurn.HOST_PICK} turnNumber={0}/>);
    expect(turn).toMatchSnapshot();
});
