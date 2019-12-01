import * as React from 'react';
import Civilisation from "../../models/Civilisation";
import CivPanel from "../../containers/CivPanel";
import CivPanelType from "../../models/CivPanelType";

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
            <div>
                <div id="civgrid" className="chooser card">
                    <div className="pure-g chooser-grid box-content">
                        {randomCiv}
                        {civPanels}
                    </div>
                    <div className="card-background">cbg</div>
                </div>
            </div>
        );
    }
}

export default CivGrid;
