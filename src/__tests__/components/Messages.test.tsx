import {shallow} from "enzyme";
import * as React from "react";
import Messages from "../../components/Messages";


it('Messages renders correctly', () => {
    const component = shallow(<Messages/>);
    expect(component).toMatchSnapshot();
});
