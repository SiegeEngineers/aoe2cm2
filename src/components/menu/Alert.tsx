import {IAlert} from "../../types";
import React from "react";

interface IProps {
    config: IAlert;
}

export const Alert = ({config}: IProps) => <div className={'box alert ' + config.class}>
    <h2>{config.title}</h2>
    <div dangerouslySetInnerHTML={{__html: config.content}}/>
</div>;