import {IAlert} from "../../types";
import React from "react";

interface IProps {
    config: IAlert;
}

class Alert extends React.Component<IProps, object> {
    public render() {
        const config = this.props.config
        return (<article className={'message is-' + config.class}>
            <div className="message-header">
                {config.title}
                <button className="delete" aria-label="delete"/>
            </div>
            <div className="message-body" dangerouslySetInnerHTML={{__html: config.content}}/>
        </article>);
    }
}

export default Alert;