import * as React from "react";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import {IAlert} from "../../types";


interface IState {
    alerts: IAlert[];
}

class API extends React.Component<WithTranslation, IState> {

    state = {alerts: []};

    public render() {
    
        return (
            <div>
                <div className="content box" id="API">
                    <h3><Trans>API stuff</Trans></h3>
                        <h5>Preset</h5>
                            <p>Request the selected preset.</p>
                            <dl>
                                <dt>Endpoint</dt>
                                <dd>/api/preset</dd>   
                                <dt>Request Parameters</dt>
                                <dd>name</dd>
                                <dt>Example Request</dt>
                                <dd>https://aoe2cm.net/api/preset/simple</dd>
                                <dd>
                                <ul>
                                    <li>TECHNICAL = 0</li>
                                    <li>AOK = 1</li>
                                    <li>CONQUERORS = 2</li>
                                    <li>FORGOTTEN = 3</li>
                                    <li>AFRICAN_KINGDOMS = 4</li>
                                    <li>RISE_OF_RAJAS = 5</li>
                                    <li>DEFINITIVE_EDITION = 6</li>
                                    <li>LORDS_OF_THE_WEST = 7</li>
                                    </ul>
                                </dd>
                            </dl>
                            <h5>Draft</h5>
                            <p>Request the selected Draft.</p>
                            <dl>
                                <dt>Endpoint</dt>
                                <dd>/api/draft</dd>  
                                <dt>Request Parameters</dt>
                                <dd>name</dd>
                                <dt>Example Request</dt>
                                <dd>https://aoe2cm.net/api/draft/FQoju</dd>
                        </dl>
                </div>
            </div>
        );
    }
}

export default withTranslation()(API);