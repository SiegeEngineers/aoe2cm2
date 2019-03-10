import {shallow} from "enzyme";
import * as React from 'react';
import CivPanel from "../../components/CivPanel";
import Civilisation from "../../models/Civilisation";
import CivPanelType from "../../models/CivPanelType";

it('PICK CivPanels render correctly', () => {
    Civilisation.ALL.forEach((civ: Civilisation) => {
        renderCivPanelAndCheckSnapshot(CivPanelType.PICK, civ);
        }
    );
});

it('empty PICK CivPanel renders correctly', () => {
    renderCivPanelAndCheckSnapshot(CivPanelType.PICK);
});

it('BAN CivPanels render correctly', () => {
    Civilisation.ALL.forEach((civ: Civilisation) => {
        renderCivPanelAndCheckSnapshot(CivPanelType.BAN, civ);
        }
    );
});

it('empty BAN CivPanel renders correctly', () => {
    renderCivPanelAndCheckSnapshot(CivPanelType.BAN);
});

function renderCivPanelAndCheckSnapshot(civPanelType: CivPanelType, civ?: Civilisation) {
    const civpanel = shallow(<CivPanel civilisation={civ} active={false} civPanelType={civPanelType}/>);
    expect(civpanel).toMatchSnapshot();
}
