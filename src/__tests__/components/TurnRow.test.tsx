import {shallow} from "enzyme";
import * as React from "react";
import TurnRow from "../../components/draft/TurnRow";
import Preset from "../../models/Preset";


it('TurnRow renders correctly', () => {
    const component = shallow(<TurnRow turns={Preset.SAMPLE.turns}/>);
    expect(component).toMatchSnapshot();
});
