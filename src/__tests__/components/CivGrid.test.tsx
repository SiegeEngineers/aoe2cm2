import {shallow} from "enzyme";
import * as React from "react";
import CivGrid from "../../components/draft/CivGrid";
import Civilisation from "../../models/Civilisation";

it('CivGrid renders correctly', () => {
    const component = shallow(<CivGrid civilisations={Civilisation.ALL}/>);
    expect(component).toMatchSnapshot();
});
