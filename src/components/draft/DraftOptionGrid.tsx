import * as React from 'react';
import DraftOptionPanel from "../../containers/DraftOptionPanel";
import DraftOptionPanelType from "../../constants/DraftOptionPanelType";
import DraftOption from "../../models/DraftOption";
import i18next from "i18next";
import i18n from "i18next";

interface IProps {
    draftOptions: DraftOption[]
}

class DraftOptionGrid extends React.Component<IProps, object> {
    public render() {

        const panels = this.props.draftOptions.sort(this.compareDraftOptions).map((draftOption, index) => {
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

    private compareDraftOptions(a: DraftOption, b: DraftOption) {
        const aName = i18next.t(['civs.' + a.name, a.name]);
        const bName = i18next.t(['civs.' + b.name, b.name]);
        return aName.localeCompare(bName, i18n.language);
    }
}

export default DraftOptionGrid;
