import * as React from 'react';
import Preset from "../models/Preset";
import NewDraftButton from "./NewDraftButton";
import CustomiseButton from "./CustomiseButton";

interface IProps {
    preset: Preset;
}

class PresetListElement extends React.Component<IProps, object> {

    public render() {

        return (
            <li>{this.props.preset.name}
                <NewDraftButton preset={this.props.preset}/>
                <CustomiseButton preset={this.props.preset}/>
            </li>
        );
    }

}

export default PresetListElement;
