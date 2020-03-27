import * as React from 'react';
import {Link} from "react-router-dom";

interface IProps {
    name: string;
    presetId: string;
}

class PresetListElement extends React.Component<IProps, object> {

    public render() {

        return (
            <li>
                <Link to={'/preset/' + this.props.presetId}>{this.props.name}</Link>
            </li>
        );
    }

}

export default PresetListElement;
