import {shallow} from "enzyme";
import DraftState from "../../components/draft/DraftState";
import Preset from "../../models/Preset";


it('DraftOptionGrid renders correctly', () => {
    const component = shallow(<DraftState nameHost={'Sneaky Saladin'} nameGuest={'Beastly Barbarossa'}
                                          preset={Preset.SAMPLE}/>);
    expect(component).toMatchSnapshot();
});
