import * as React from 'react';
import DraftOptionPanel from "../../containers/DraftOptionPanel";
import DraftOptionPanelType from "../../constants/DraftOptionPanelType";
import DraftOption from "../../models/DraftOption";

interface IProps {
    draftOptions: DraftOption[]
}

class DraftOptionGrid extends React.Component<IProps, object> {
    public render() {

        const panels = this.props.draftOptions.map((draftOption, index) => {
            return React.createElement(DraftOptionPanel, {
                draftOptionPanelType: DraftOptionPanelType.CHOICE,
                active: false,
                draftOption: draftOption,
                key: index,
                highlighted: false,
            });
        });

        const randomOption = React.createElement(DraftOptionPanel, {
            draftOptionPanelType: DraftOptionPanelType.CHOICE,
            active: false,
            draftOption: DraftOption.RANDOM,
            key: -1,
            highlighted: false,
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
