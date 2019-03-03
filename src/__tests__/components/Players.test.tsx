import {shallow} from "enzyme";
import * as React from "react";
import Players from "../../components/Players";
import Draft from "../../models/Draft";
import Preset from "../../models/Preset";


it('CivGrid renders correctly', () => {
    const draft: Draft = new Draft('Sneaky Saladin', 'Beastly Barbarossa', Preset.SAMPLE);
    const component = shallow(<Players config={draft}/>);
    expect(component).toMatchSnapshot();
});
