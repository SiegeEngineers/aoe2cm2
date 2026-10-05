import {shallow} from "enzyme";
import {ReactElement} from "react";
import Draft, {Draft as DraftPage} from "../../components/draft/Draft";
import DraftState from "../../components/draft/DraftState";
import PooledDraftBoard from "../../components/draft/PooledDraftBoard";
import ReplayControls from "../../containers/ReplayControls";
import DraftIdInfo from "../../containers/DraftIdInfo";
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

const draftPageProps = (search: string) => ({
    preset: Preset.SAMPLE, nameGuest: 'Beastly Barbarossa', nameHost: 'Sneaky Saladin', nextAction: 0,
    whoAmI: Player.HOST, hostConnected: false, guestConnected: false, ownName: '', replayEvents: [],
    triggerConnect: () => {}, triggerSetRole: () => {}, showNameModal: () => {}, showRoleModal: () => {},
    setCountdownValue: () => {}, setOwnRole: () => {}, setEvents: () => {}, act: () => {},
    location: {search}, t: (key: string) => key,
} as unknown as ConstructorParameters<typeof DraftPage>[0]);

it('puts the message line, the replay controls and the options between the captains, and the draft code under the admin box', () => {
    const board = shallow(<DraftPage {...draftPageProps('')}/>).find(DraftState);
    const centre = board.children();
    expect(centre).toHaveLength(3);
    expect(centre.at(0).prop('id')).toEqual('messages');
    expect(centre.at(1).type()).toBe(ReplayControls);
    expect(centre.at(2).type()).toBe(PooledDraftBoard);
    expect(board.find(DraftIdInfo)).toHaveLength(0);
    expect((board.prop('draftCode') as ReactElement).type).toBe(DraftIdInfo);
});

it('leaves the draft code out of the simplified UI', () => {
    const board = shallow(<DraftPage {...draftPageProps('?simplified=true')}/>).find(DraftState);
    expect(board.prop('draftCode')).toBeFalsy();
});
