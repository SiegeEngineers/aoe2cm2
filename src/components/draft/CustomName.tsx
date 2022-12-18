import * as React from "react";

interface IProps {
    name: string
}

class CustomName extends React.Component<IProps, object> {
    public render() {
        const trimmedName = this.props.name.trim();
        if (trimmedName.length > 32) {
            return <abbr title={trimmedName}>{trimmedName.substring(0, 30) + '…'}</abbr>
        }
        return <span>{trimmedName}</span>
    }
}

export default CustomName;
