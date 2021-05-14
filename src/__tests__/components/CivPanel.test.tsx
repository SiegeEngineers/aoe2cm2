import {shallow} from "enzyme";
import * as React from 'react';
import DraftOptionPanel from "../../components/draft/DraftOptionPanel";
import Civilisation from "../../models/Civilisation";
import DraftOptionPanelType from "../../constants/DraftOptionPanelType";

it('PICK CivPanels render correctly', () => {
    Civilisation.ALL.forEach((civ: Civilisation) => {
            renderDraftOptionPanelAndCheckSnapshot(DraftOptionPanelType.PICK, civ);
        }
    );
});

it('empty PICK CivPanel renders correctly', () => {
    renderDraftOptionPanelAndCheckSnapshot(DraftOptionPanelType.PICK);
});

it('BAN CivPanels render correctly', () => {
    Civilisation.ALL.forEach((civ: Civilisation) => {
            renderDraftOptionPanelAndCheckSnapshot(DraftOptionPanelType.BAN, civ);
        }
    );
});

it('empty BAN CivPanel renders correctly', () => {
    renderDraftOptionPanelAndCheckSnapshot(DraftOptionPanelType.BAN);
});

function renderDraftOptionPanelAndCheckSnapshot(draftOptionPanelType: DraftOptionPanelType, civ?: Civilisation) {
    const civpanel = shallow(<DraftOptionPanel draftOption={civ} active={false} draftOptionPanelType={draftOptionPanelType} nextAction={0} iconStyle={'units'}/>);
    expect(civpanel).toMatchSnapshot();
}
