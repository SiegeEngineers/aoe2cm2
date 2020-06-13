import * as React from 'react';
import PresetListElement from "./PresetListElement";

interface IProps {
    items: any[];
}

class PresetList extends React.Component<IProps, object> {

    public render() {
        const presetListElements = this.props.items.map((item) => <PresetListElement name={item.name}
                                                                                     key={item.id}
                                                                                     presetId={item.id}/>);
        return (
            <ul>
                {presetListElements}
            </ul>
        );
    }

}

export default PresetList;
