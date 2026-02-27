import * as React from "react";
import {Trans} from "react-i18next";

interface IProps {
    display: boolean | undefined,
}

class CustomName extends React.Component<IProps, object> {
    public render() {
        if (!this.props.display) {
            return null;
        }
        return <section className="section has-background-danger-dark has-text-centered has-text-white">
            <Trans i18nKey="topPrivateDraftWarning">PRIVATE PRACTICE DRAFT – WILL NOT BE SAVED</Trans>
        </section>
    }
}

export default CustomName;
