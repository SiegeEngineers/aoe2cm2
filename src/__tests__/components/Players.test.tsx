import {shallow} from "enzyme";
import DraftState from "../../components/draft/DraftState";
import Preset from "../../models/Preset";


it('DraftOptionGrid renders correctly', () => {
    const component = shallow(<DraftState nameHost={'Sneaky Saladin'} nameGuest={'Beastly Barbarossa'}
                                          preset={Preset.SAMPLE}/>);
    expect(component).toMatchSnapshot();
});

it('puts what it is given between the host and the guest, with the admin box and the draft code after them', () => {
    const component = shallow(<DraftState nameHost={'Sneaky Saladin'} nameGuest={'Beastly Barbarossa'}
                                          preset={Preset.SAMPLE} flipped={false} smooch={false} simplifiedUI={false}
                                          draftCode={<span id="the-code"/>}>
        <span id="the-options"/>
    </DraftState>);
    const board = component.find('.draft-board').children();
    expect(board.at(0).prop('player')).toEqual('HOST');
    expect(board.at(1).hasClass('draft-board-centre')).toBe(true);
    expect(board.at(1).find('#the-options')).toHaveLength(1);
    expect(board.at(1).find('#the-code')).toHaveLength(0);
    expect(board.at(2).prop('player')).toEqual('GUEST');
    expect(board.at(3).prop('player')).toEqual('NONE');
    expect(board.at(4).hasClass('draft-board-code')).toBe(true);
    expect(board.at(4).find('#the-code')).toHaveLength(1);
});
