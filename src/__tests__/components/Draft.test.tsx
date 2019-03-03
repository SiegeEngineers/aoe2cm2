import {shallow} from "enzyme";
import * as React from "react";
import Draft from "../../components/Draft";
import {default as ModelDraft} from "../../models/Draft";
import Preset from "../../models/Preset";

it('Draft renders correctly', () => {
    const draft:ModelDraft= new ModelDraft('Sneaky Saladin', 'Beastly Barbarossa', Preset.SAMPLE);
    const component = shallow(<Draft config={draft}/>);
    expect(component).toMatchSnapshot();
});
