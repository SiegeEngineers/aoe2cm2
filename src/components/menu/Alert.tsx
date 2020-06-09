import {IAlert} from "../../types";
import React from "react";

interface IProps {
    config: IAlert;
}

export const Alert = ({config}: IProps) => <article className={'message is-' + config.class}>
    <div className="message-header">
        {config.title}
        <button className="delete" aria-label="delete"></button>
    </div>
    <div className="message-body" dangerouslySetInnerHTML={{__html: config.content}}/>
</article>;