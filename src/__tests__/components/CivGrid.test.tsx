import {shallow} from "enzyme";
import DraftOptionGrid from "../../components/draft/DraftOptionGrid";
import Civilisation from "../../models/Civilisation";

it('DraftOptionGrid renders correctly', () => {
    const component = shallow(<DraftOptionGrid draftOptions={Civilisation.ALL} id="civgrid"/>);
    expect(component).toMatchSnapshot();
});
