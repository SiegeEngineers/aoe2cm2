import * as React from 'react';
import Civilisation from "../../models/Civilisation";
import CivPanel from "../../containers/CivPanel";
import CivPanelType from "../../constants/CivPanelType";

interface IProps {
    civilisations: Civilisation[]
}

class CivGrid extends React.Component<IProps, object> {
    public render() {

        const civPanels = this.props.civilisations.map((civ, index) => {
            return React.createElement(CivPanel, {civPanelType: CivPanelType.CHOICE, active: false, civilisation: civ});
        });

        const randomCiv = React.createElement(CivPanel, {civPanelType: CivPanelType.CHOICE, active: false, civilisation: Civilisation.RANDOM});

        return (
                <div id="civgrid" className="chooser">
                    <div className="chooser-grid">
                        {randomCiv}
                        {civPanels}
                    </div>
                </div>
        );
    }
}

export default CivGrid;
