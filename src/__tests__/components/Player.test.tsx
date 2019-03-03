import {shallow} from "enzyme";
import * as React from "react";
import Player from "../../components/Player";
import Preset from "../../models/Preset";
import {default as ModelPlayer} from "../../models/Player";


it('Player renders correctly', () => {
    const component = shallow(<Player preset={Preset.SAMPLE} name={"Host Player Name"} player={ModelPlayer.HOST}/>);
    expect(component).toMatchSnapshot();
});
