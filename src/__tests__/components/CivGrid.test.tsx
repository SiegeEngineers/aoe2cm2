import {shallow} from "enzyme";
import * as React from "react";
import CivGrid from "../../components/CivGrid";
import Civilisation from "../../models/Civilisation";
import {Socket} from "socket.io-client";
jest.mock('socket.io-client');

it('CivGrid renders correctly', () => {
    const component = shallow(<CivGrid civilisations={Civilisation.ALL} socket={Socket}/>);
    expect(component).toMatchSnapshot();
});
