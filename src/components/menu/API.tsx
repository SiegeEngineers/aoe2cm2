import * as React from "react";

class API extends React.Component<object, object> {

    public render() {
    
        return (
            <div>
                <div className="content box" id="API">
                    <h3>API</h3>
                        <h4>Preset</h4>
                        <h5>Preset</h5>
                            <p>Request the selected preset.</p>
                            <dl>
                                <dt>Endpoint</dt>
                                <dd>/api/preset/:id</dd>   
                                <dt>Example Request</dt>
                                <dd>https://aoe2cm.net/api/preset/simple</dd>
                            </dl>

                            <h5>Add Preset</h5>
                            <p>Request the selected preset.</p>
                            <dl>
                                <dt>Endpoint</dt>
                                <dd>/api/preset/new</dd>   
                                <dt>Request Parameters</dt>
                                <dd>No Clue</dd>
                                <dt>Example Request</dt>
                                <dd>https://aoe2cm.net/api/preset/new</dd>
                                <dt>Reply</dt>
                                <dd>"status": "ok", "presetId": "abcdef"</dd>
                            </dl>

                            <h5>List Preset</h5>
                            <p>Lists public presets with name and id.</p>
                            <dl>
                                <dt>Endpoint</dt>
                                <dd>/api/preset/list</dd>   
                                <dt>Request Parameters</dt>
                                <dd>No parameters</dd>
                                <dt>Example Request</dt>
                                <dd>https://aoe2cm.net/api/preset/list</dd>
                            </dl>

                            <h4>Draft</h4>
                            <h5>Draft</h5>
                            <p>Request the selected Draft.</p>
                            <dl>
                                <dt>Endpoint</dt>
                                <dd>/api/draft/:id</dd>  
                                <dt>Request Parameters</dt>
                                <dd>id</dd>
                                <dt>Example Request</dt>
                                <dd>https://aoe2cm.net/api/draft/FQoju</dd>
                            </dl>
                            <h5>Add draft</h5>
                            <p>Request the selected preset.</p>
                            <dl>
                                <dt>Endpoint</dt>
                                <dd>/api/preset</dd>   
                                <dt>Request Parameters</dt>
                                <dd>No Clue</dd>
                                <dt>Example Request</dt>
                                <dd>https://aoe2cm.net/api/draft/new</dd>
                            </dl>

                            <h5>See recent Drafts</h5>
                            <p>Get a list of recent Drafts</p>
                            <dl>
                                <dt>Endpoint</dt>
                                <dd>/api/recentdrafts</dd>   
                                <dt>Request Parameters</dt>
                                <dd>No parameters</dd>
                                <dt>Example Request</dt>
                                <dd>https://aoe2cm.net/api/recentdrafts</dd>
                            </dl>

                            

                            <h4>Open Connections</h4>
                            <p>Shows the number of current connections.</p>
                            <dl>
                                <dt>Endpoint</dt>
                                <dd>/api/connections</dd>   
                                <dt>Request Parameters</dt>
                                <dd>No parameters</dd>
                                <dt>Example Request</dt>
                                <dd>https://aoe2cm.net/api/connections</dd>
                            </dl>

                            <h4>Alerts</h4>
                            <p>Shows alert message.</p>
                            <dl>
                                <dt>Endpoint</dt>
                                <dd>/api/alerts</dd>   
                                <dt>Request Parameters</dt>
                                <dd>No parameters</dd>
                                <dt>Example Request</dt>
                                <dd>https://aoe2cm.net/api/alerts</dd>
                            </dl>
                </div>
            </div>
        );
    }
}

export default API;