import * as React from 'react';
import DraftOptionPanel from "../../containers/DraftOptionPanel";
import DraftOptionPanelType from "../../constants/DraftOptionPanelType";
import DraftOption from "../../models/DraftOption";
import Civilisation from "../../models/Civilisation";

interface IProps {
    draftOptions: DraftOption[]
}

class DraftOptionGrid extends React.Component<IProps, object> {
    public render() {

        const panels = this.props.draftOptions.map((draftOption, index) => {
            return React.createElement(DraftOptionPanel, {
                civPanelType: DraftOptionPanelType.CHOICE,
                active: false,
                draftOption: draftOption,
                key: index
            });
        });

        const randomOption = React.createElement(DraftOptionPanel, {
            civPanelType: DraftOptionPanelType.CHOICE,
            active: false,
            draftOption: Civilisation.RANDOM,
            key: -1
        });

        return (
            <div id="civgrid" className="chooser">
                <div className="chooser-grid">
                    {randomOption}
                    {panels}
                </div>
            </div>
        );
    }
}

export default DraftOptionGrid;
