import {shallow} from "enzyme";
import * as React from 'react';
import DraftOptionPanel from "../../components/draft/DraftOptionPanel";
import Civilisation from "../../models/Civilisation";
import DraftOptionPanelType from "../../constants/DraftOptionPanelType";
import DraftOption from "../../models/DraftOption";

it('PICK CivPanels render correctly', () => {
    Civilisation.ALL.forEach((civ: Civilisation) => {
            renderDraftOptionPanelAndCheckSnapshot(DraftOptionPanelType.PICK, civ);
        }
    );
});

it('technical PICK DraftOptionPanels render correctly', () => {
    DraftOption.TECHNICAL_DRAFT_OPTIONS.forEach((draftOption: DraftOption) => {
            renderDraftOptionPanelAndCheckSnapshot(DraftOptionPanelType.PICK, draftOption);
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

function renderDraftOptionPanelAndCheckSnapshot(draftOptionPanelType: DraftOptionPanelType, draftOption?: DraftOption) {
    const civpanel = shallow(<DraftOptionPanel draftOption={draftOption} active={false} draftOptionPanelType={draftOptionPanelType} nextAction={0} iconStyle={'units'}/>);
    expect(civpanel).toMatchSnapshot();
}
