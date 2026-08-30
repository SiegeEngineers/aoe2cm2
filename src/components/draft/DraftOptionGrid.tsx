import * as React from 'react';
import DraftOptionPanel from "../../containers/DraftOptionPanel";
import DraftOptionPanelType from "../../constants/DraftOptionPanelType";
import DraftOption from "../../models/DraftOption";
import i18next from "i18next";
import i18n from "i18next";
import {PanelAspect} from "../../util/PanelAspect";

interface IProps {
    draftOptions: DraftOption[]
}

class DraftOptionGrid extends React.Component<IProps, object> {
    private readonly grid = React.createRef<HTMLDivElement>();

    public componentDidMount(): void {
        PanelAspect.apply(this.grid.current, this.props.draftOptions);
    }

    public componentDidUpdate(): void {
        PanelAspect.apply(this.grid.current, this.props.draftOptions);
    }

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
            <div id="civgrid" className="chooser" ref={this.grid}>
                <div className="chooser-grid">
                    {randomOption}
                    {panels}
                </div>
            </div>
        );
    }

    private compareDraftOptions(a: DraftOption, b: DraftOption) {
        const aName = i18next.t(['civs.' + a.name, a.id]);
        const bName = i18next.t(['civs.' + b.name, b.id]);
        return aName.localeCompare(bName, i18n.language);
    }
}

export default DraftOptionGrid;
