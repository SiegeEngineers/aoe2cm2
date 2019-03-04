import * as React from 'react';
import ActionType from "../models/ActionType";
import Civilisation from "../models/Civilisation";
import '../pure-min.css'
import '../style2.css'

import CivPanel from "./CivPanel";

class AllCivsPanel extends React.Component<object, object> {
    public render() {

        const items = Civilisation.ALL.map(civ => {
            return React.createElement(CivPanel, {civilisation: civ, actionType: ActionType.PICK, active: true});
        });

        return (
            <div>{items}</div>
        );
    }
}

export default AllCivsPanel;
