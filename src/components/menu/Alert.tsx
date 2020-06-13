import {IAlert} from "../../types";
import React from "react";

interface IProps {
    config: IAlert;
}

interface IState {
    isOpen: boolean;
}

class Alert extends React.Component<IProps, IState> {

    constructor(props:IProps) {
        super(props);
        this.closeAlert = this.closeAlert.bind(this);
    }

    state = {
        isOpen: true,
    } as IState;

    private closeAlert() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    public render() {
        const config = this.props.config;
        if (!this.state.isOpen) {
            return null;
        }
        return (<article className={'message is-' + config.class}>
            <div className="message-header">
                {config.title}
                {config.closable && <button className="delete" aria-label="delete" onClick={this.closeAlert}/>}
            </div>
            <div className="message-body" dangerouslySetInnerHTML={{__html: config.content}}/>
        </article>);
    }
}

export default Alert;