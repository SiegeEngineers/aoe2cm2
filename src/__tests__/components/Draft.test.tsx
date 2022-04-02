import {shallow} from "enzyme";
import Draft from "../../components/draft/Draft";
import Player from "../../constants/Player";
import Preset from "../../models/Preset";

it('Draft renders correctly', () => {
    Date.now = jest.fn(() => 1111111111111);
    const component = shallow(<Draft preset={Preset.SAMPLE} nameGuest={'Beastly Barbarossa'} nameHost={'Sneaky Saladin'}
                                     nextAction={0} whoAmI={Player.HOST} hostConnected={false} guestConnected={false}
                                     ownName={''} replayEvents={[]} triggerConnect={()=>{}} triggerSetRole={()=>{}}
                                     showNameModal={()=>{}} showRoleModal={()=>{}} setCountdownValue={()=>{}}
                                     setOwnRole={()=>{}} setEvents={()=>{}} act={()=>{}}/>);
    expect(component).toMatchSnapshot();
});
