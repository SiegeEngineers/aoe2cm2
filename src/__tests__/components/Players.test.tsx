import {shallow} from "enzyme";
import * as React from "react";
import Players from "../../components/Players";
import Preset from "../../models/Preset";


it('CivGrid renders correctly', () => {
    const component = shallow(<Players nameHost={'Sneaky Saladin'} nameGuest={'Beastly Barbarossa'}
                                       preset={Preset.SAMPLE}/>);
    expect(component).toMatchSnapshot();
});
