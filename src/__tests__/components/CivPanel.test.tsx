import {shallow} from "enzyme";
import * as React from 'react';
import CivPanel from "../../components/CivPanel";
import ActionType from "../../models/ActionType";
import Civilisation from "../../models/Civilisation";

it('PICK CivPanels render correctly', () => {
    Civilisation.ALL.forEach((civ: Civilisation) => {
            renderCivPanelAndCheckSnapshot(ActionType.PICK, civ);
        }
    );
});

it('empty PICK CivPanel renders correctly', () => {
    renderCivPanelAndCheckSnapshot(ActionType.PICK);
});

it('BAN CivPanels render correctly', () => {
    Civilisation.ALL.forEach((civ: Civilisation) => {
            renderCivPanelAndCheckSnapshot(ActionType.BAN, civ);
        }
    );
});

it('empty BAN CivPanel renders correctly', () => {
    renderCivPanelAndCheckSnapshot(ActionType.BAN);
});

function renderCivPanelAndCheckSnapshot(actionType: ActionType, civ?: Civilisation) {
    const civpanel = shallow(<CivPanel civilisation={civ} active={false} actionType={actionType}/>);
    expect(civpanel).toMatchSnapshot();
}
