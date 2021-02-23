import * as React from "react";

class API extends React.Component<object, object> {

    public render() {

        return (
            <div>
                <div className="content box" id="API">
                    <h3>API documentation</h3>
                    {/*<details>*/}
                        {/*<summary><hr/<h4>Preset</h4></summary>*/}
                        <h4>Presets</h4>
                        <h5>Get Preset</h5>
                        <p>Request the selected preset.</p>
                        <dl>
                            <dt>Endpoint</dt>
                            <dd><pre>GET /api/preset/:id</pre></dd>
                            <dt>Example URL</dt>
                            <dd><pre>https://aoe2cm.net/api/preset/simple</pre></dd>
                            <dt>Response</dt>
                            <dd><pre>A JSON encoded valid <a
                                href={'https://github.com/SiegeEngineers/aoe2cm2/blob/master/src/models/Preset.ts'}>Preset</a> object.</pre>
                            </dd>
                        </dl>

                        <h5>Add Preset</h5>
                        <p>Create a new preset.</p>
                        <dl>
                            <dt>Endpoint</dt>
                            <dd><pre>POST /api/preset/new</pre></dd>
                            <dt>Payload</dt>
                            <dd><pre>A JSON encoded valid <a
                                href={'https://github.com/SiegeEngineers/aoe2cm2/blob/master/src/models/Preset.ts'}>Preset</a> object.</pre>
                            </dd>
                            <dt>Example URL</dt>
                            <dd><pre>https://aoe2cm.net/api/preset/new</pre></dd>
                            <dt>Example Response</dt>
                            <dd><pre>{
`{
    "status": "ok", 
    "presetId": "abCdE"
}`
                            }</pre></dd>
                        </dl>

                        <h5>List Presets</h5>
                        <p>List ID and name of publicly listed presets.</p>
                        <dl>
                            <dt>Endpoint</dt>
                            <dd><pre>GET /api/preset/list</pre></dd>
                            <dt>Example URL</dt>
                            <dd><pre>https://aoe2cm.net/api/preset/list</pre></dd>
                            <dt>Example Response</dt>
                            <dd><pre>{
`[
    {
        "name": "Simple Preset",
        "id": "simple"
    },
    {
        "id": "Hidden_1v1",
        "name": "Hidden 1v1"
    }
]`
                            }</pre></dd>
                        </dl>
                    {/*</details>*/}
                    <hr/><h4>Drafts</h4>
                    <h5>Get Draft</h5>
                    <p>Get the data of a finished draft.</p>
                    <dl>
                        <dt>Endpoint</dt>
                        <dd><pre>GET /api/draft/:id</pre></dd>
                        <dt>Example URL</dt>
                        <dd><pre>https://aoe2cm.net/api/draft/FQoju</pre></dd>
                        <dt>Response</dt>
                        <dd>
                            <pre>A JSON encoded <a
                            href={'https://github.com/SiegeEngineers/aoe2cm2/blob/master/src/models/Draft.ts'}>Draft</a> object.
                            </pre>
                        </dd>
                    </dl>
                    <h5>Create draft</h5>
                    <p>Create a new draft based on a preset.</p>
                    <dl>
                        <dt>Endpoint</dt>
                        <dd><pre>POST /api/draft/new</pre></dd>
                        <dt>Payload</dt>
                        <dd><pre>A JSON encoded valid <a
                            href={'https://github.com/SiegeEngineers/aoe2cm2/blob/master/src/models/Preset.ts'}>Preset</a> object.
                        </pre>
                        </dd>
                        <dt>Example URL</dt>
                        <dd><pre>https://aoe2cm.net/api/draft/new</pre></dd>
                        <dt>Example Response</dt>
                        <dd><pre>{
`{
    "status": "ok", 
    "draftId": "abCdE"
}`
                        }</pre></dd>
                    </dl>

                    <h5>List recent Drafts</h5>
                    <p>Get a list of recent Drafts with <code>title</code>, <code>draftId</code>, <code>ongoing</code>, <code>nameHost</code>, and <code>nameGuest</code> for each of the
                        drafts.</p>
                    <dl>
                        <dt>Endpoint</dt>
                        <dd><pre>GET /api/recentdrafts</pre></dd>
                        <dt>Example URL</dt>
                        <dd><pre>https://aoe2cm.net/api/recentdrafts</pre></dd>
                        <dt>Example Response</dt>
                        <dd><pre>{
`[
    {
        "title": "Simple 1v1",
        "draftId": "abcdef",
        "ongoing": true,
        "nameHost": "Macbeth",
        "nameGuest": "General Kyebaek"
    },{
        "title": "Hidden 3v3",
        "draftId": "fghij",
        "ongoing": false,
        "nameHost": "Wenceslaus I",
        "nameGuest": "Pepin the Short"
    }
]`
                        }</pre></dd>
                    </dl>


                    <hr/><h4>Open Connections</h4>
                    <p>Show the number of current connections.</p>
                    <dl>
                        <dt>Endpoint</dt>
                        <dd><pre>GET /api/connections</pre></dd>
                        <dt>Example URL</dt>
                        <dd><pre>https://aoe2cm.net/api/connections</pre></dd>
                        <dt>Example Response</dt>
                        <dd><pre>{
`{
    "connections":6
}`
                        }</pre></dd>
                    </dl>

                    <hr/><h4>Alerts</h4>
                    <p>List alerts that are displayed on the main page.</p>
                    <dl>
                        <dt>Endpoint</dt>
                        <dd><pre>GET /api/alerts</pre></dd>
                        <dt>Example URL</dt>
                        <dd><pre>https://aoe2cm.net/api/alerts</pre></dd>
                        <dt>Example Response</dt>
                        <dd><pre>{
`[
    {
        "class": "info",
        "title": "Sample Alert",
        "content": "<b>This is a sample!</b> Great, isn\'t it?"
    }
]`
                        }</pre></dd>
                    </dl>
                </div>
            </div>
        );
    }
}

export default API;