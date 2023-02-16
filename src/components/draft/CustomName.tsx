import * as React from "react";

interface IProps {
    name: string
    length?: number
}

class CustomName extends React.Component<IProps, object> {
    public render() {
        const trimmedName = this.props.name.trim();
        const targetLength = this.props.length || 30;
        if (trimmedName.length > (targetLength + 2)) {
            return <abbr title={trimmedName}>{trimmedName.substring(0, targetLength) + '…'}</abbr>
        }
        return <span>{trimmedName}</span>
    }
}

export default CustomName;
