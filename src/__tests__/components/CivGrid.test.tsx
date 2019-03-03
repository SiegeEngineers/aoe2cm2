import {shallow} from "enzyme";
import * as React from "react";
import CivGrid from "../../components/CivGrid";

it('CivGrid renders correctly', () => {
    const component = shallow(<CivGrid/>);
    expect(component).toMatchSnapshot();
});
