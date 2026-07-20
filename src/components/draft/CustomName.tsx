import * as React from "react";
import {Util} from "../../util/Util";

interface IProps {
    name: string
    length?: number
}

class CustomName extends React.Component<IProps, object> {
    public render() {
        const trimmedName = this.props.name.trim();
        const familyFriendlyName = Util.applyChatFilter(trimmedName)
        const targetLength = this.props.length || 30;
        if (familyFriendlyName.length > (targetLength + 2)) {
            return <abbr title={trimmedName}>{familyFriendlyName.substring(0, targetLength) + '…'}</abbr>
        } else if (trimmedName !== familyFriendlyName) {
            return <abbr title={trimmedName}>{familyFriendlyName}</abbr>
        }
        return <span>{familyFriendlyName}</span>
    }
}


export default CustomName;
