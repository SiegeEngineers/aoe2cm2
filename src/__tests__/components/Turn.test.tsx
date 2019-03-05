import * as enzyme from 'enzyme';
import * as React from 'react';
import Turn from "../../components/Turn";
import {default as ModelTurn} from "../../models/Turn";

it('labels the turn with PICK', () => {
    const turn = enzyme.shallow(<Turn turn={ModelTurn.HOST_PICK} turnNumber={0}/>);
    expect(turn.find(".turn-host").text()).toEqual('PICK')
});

it('labels the turn with xPICK', () => {
    const turn = enzyme.shallow(<Turn turn={ModelTurn.HOST_HIDDEN_EXCLUSIVE_PICK} turnNumber={0}/>);
    expect(turn.find(".turn-host").text()).toEqual('xPICK')
});

it('labels the turn with GPICK', () => {
    const turn = enzyme.shallow(<Turn turn={ModelTurn.HOST_GLOBAL_PICK} turnNumber={0}/>);
    expect(turn.find(".turn-host").text()).toEqual('gPICK')
});
