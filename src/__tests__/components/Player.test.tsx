import {shallow} from "enzyme";
import {default as ModelPlayer} from "../../constants/Player";
import Preset from "../../models/Preset";
import Player from "../../components/draft/PlayerDraftState";

it('Player renders correctly', () => {
    const component = shallow(<Player preset={Preset.SAMPLE} name={"Host Player Name"} player={ModelPlayer.HOST}/>);
    expect(component).toMatchSnapshot();
});
