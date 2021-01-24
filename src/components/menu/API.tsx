import * as React from "react";

class API extends React.Component<object, object> {

    public render() {

        return (
            <div>
                <div className="content box" id="API">
                    <h3>API documentation</h3>
                    <h4>Preset</h4>
                    <h5>Get Preset</h5>
                    <p>Request the selected preset.</p>
                    <dl>
                        <dt>Endpoint</dt>
                        <dd>GET <code>/api/preset/:id</code></dd>
                        <dt>Example URL</dt>
                        <dd>https://aoe2cm.net/api/preset/simple</dd>
                    </dl>

                    <h5>Add Preset</h5>
                    <p>Create a new preset.</p>
                    <dl>
                        <dt>Endpoint</dt>
                        <dd>POST <code>/api/preset/new</code></dd>
                        <dt>Payload</dt>
                        <dd>A JSON encoded valid <a
                            href={'https://github.com/SiegeEngineers/aoe2cm2/blob/master/src/models/Preset.ts'}>Preset</a> object.
                        </dd>
                        <dt>Example URL</dt>
                        <dd>https://aoe2cm.net/api/preset/new</dd>
                        <dt>Example Response</dt>
                        <dd><code>{'{"status": "ok", "presetId": "abcdef"}'}</code></dd>
                    </dl>

                    <h5>List Presets</h5>
                    <p>List ID and name of publicly listed presets.</p>
                    <dl>
                        <dt>Endpoint</dt>
                        <dd>GET <code>/api/preset/list</code></dd>
                        <dt>Example URL</dt>
                        <dd>https://aoe2cm.net/api/preset/list</dd>
                        <dt>Example Response</dt>
                        <dd><code>{'[\
                            {\
                                "name": "Simple Preset",\
                                "id": "simple"\
                            },\
                            {\
                                "id": "Hidden_1v1",\
                                "name": "Hidden 1v1"\
                            }\
                            ]'}</code></dd>
                    </dl>

                    <h4>Draft</h4>
                    <h5>Get Draft</h5>
                    <p>Get the data of a finished draft.</p>
                    <dl>
                        <dt>Endpoint</dt>
                        <dd>GET <code>/api/draft/:id</code></dd>
                        <dt>Example URL</dt>
                        <dd>https://aoe2cm.net/api/draft/FQoju</dd>
                        <dt>Response</dt>
                        <dd>A JSON encoded <a
                            href={'https://github.com/SiegeEngineers/aoe2cm2/blob/master/src/models/Draft.ts'}>Draft</a> object.
                        </dd>
                    </dl>
                    <h5>Create draft</h5>
                    <p>Create a new draft based on a preset.</p>
                    <dl>
                        <dt>Endpoint</dt>
                        <dd>POST <code>/api/draft/new</code></dd>
                        <dt>Payload</dt>
                        <dd>A JSON encoded valid <a
                            href={'https://github.com/SiegeEngineers/aoe2cm2/blob/master/src/models/Preset.ts'}>Preset</a> object.
                        </dd>
                        <dt>Example URL</dt>
                        <dd>https://aoe2cm.net/api/draft/new</dd>
                        <dt>Example Response</dt>
                        <dd><code>{'{"status": "ok", "draftId": "abcdef"}'}</code></dd>
                    </dl>

                    <h5>List recent Drafts</h5>
                    <p>Get a list of recent Drafts with title, draftId, ongoing, nameHost, and nameGuest for each of the
                        drafts.</p>
                    <dl>
                        <dt>Endpoint</dt>
                        <dd>GET <code>/api/recentdrafts</code></dd>
                        <dt>Example URL</dt>
                        <dd>https://aoe2cm.net/api/recentdrafts</dd>
                        <dt>Example Response</dt>
                        <dd><code>{'[{\
                            "title": "Simple 1v1",\
                            "draftId": "abcdef",\
                            "ongoing": true,\
                            "nameHost": "Macbeth",\
                            "nameGuest": "General Kyebaek"\
                        },{\
                            "title": "Hidden 3v3",\
                            "draftId": "fghij",\
                            "ongoing": false,\
                            "nameHost": "Wenceslaus I",\
                            "nameGuest": "Pepin the Short"\
                        }]'}</code></dd>
                    </dl>


                    <h4>Open Connections</h4>
                    <p>Show the number of current connections.</p>
                    <dl>
                        <dt>Endpoint</dt>
                        <dd>GET <code>/api/connections</code></dd>
                        <dt>Example URL</dt>
                        <dd>https://aoe2cm.net/api/connections</dd>
                        <dt>Example Response</dt>
                        <dd><code>{'{"connections":6}'}</code></dd>
                    </dl>

                    <h4>Alerts</h4>
                    <p>List alerts that are displayed on the main page.</p>
                    <dl>
                        <dt>Endpoint</dt>
                        <dd>GET <code>/api/alerts</code></dd>
                        <dt>Example URL</dt>
                        <dd>https://aoe2cm.net/api/alerts</dd>
                        <dt>Example Response</dt>
                        <dd><code>{'[\
                            {\
                                "class": "info",\
                                "title": "Sample Alert",\
                                "content": "<b>This is a sample!</b> Great, isn\'t it?"\
                            }\
                            ]'}</code></dd>
                    </dl>
                </div>
            </div>
        );
    }
}

export default API;