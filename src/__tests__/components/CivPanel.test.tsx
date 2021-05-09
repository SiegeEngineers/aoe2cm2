import {shallow} from "enzyme";
import * as React from 'react';
import DraftOptionPanel from "../../components/draft/DraftOptionPanel";
import Civilisation from "../../models/Civilisation";
import DraftOptionPanelType from "../../constants/DraftOptionPanelType";

it('PICK CivPanels render correctly', () => {
    Civilisation.ALL.forEach((civ: Civilisation) => {
            renderCivPanelAndCheckSnapshot(DraftOptionPanelType.PICK, civ);
        }
    );
});

it('empty PICK CivPanel renders correctly', () => {
    renderCivPanelAndCheckSnapshot(DraftOptionPanelType.PICK);
});

it('BAN CivPanels render correctly', () => {
    Civilisation.ALL.forEach((civ: Civilisation) => {
            renderCivPanelAndCheckSnapshot(DraftOptionPanelType.BAN, civ);
        }
    );
});

it('empty BAN CivPanel renders correctly', () => {
    renderCivPanelAndCheckSnapshot(DraftOptionPanelType.BAN);
});

function renderCivPanelAndCheckSnapshot(civPanelType: DraftOptionPanelType, civ?: Civilisation) {
    const civpanel = shallow(<DraftOptionPanel draftOption={civ} active={false} civPanelType={civPanelType} nextAction={0} iconStyle={'units'}/>);
    expect(civpanel).toMatchSnapshot();
}
