import * as React from "react";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {connect} from "react-redux";
import {ApplicationState, IPresetAndDraftList, IServerState} from "../../types";
import {withTranslation, WithTranslation} from "react-i18next";
import {Redirect, RouteComponentProps} from "react-router";
import PresetList from "./PresetList";

interface Props extends WithTranslation, RouteComponentProps<any> {
    apiKey: string | undefined
    onSetApiKey: (apiKey: string | undefined) => void
    onSetAdminPresetsAndDrafts: (presetsAndDrafts: IPresetAndDraftList | undefined) => void
    presetsAndDrafts?: IPresetAndDraftList
}

interface State {
    serverState: IServerState
}

class AdminMain extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            serverState: {maintenanceMode: false, hiddenPresetIds: []},
        };
    }

    private logout() {
        this.props.onSetApiKey(undefined);
    }

    private fetchState() {
        fetch('/api/state', {
            headers: {
                'X-Auth-Token': this.props.apiKey as string
            }
        })
            .then((result) => {
                if (result.ok) {
                    return result.json();
                }
                this.props.onSetApiKey(undefined);
                return Promise.reject('Authorization failed');
            })
            .then((json) => this.setState({...this.state, serverState: json}));
    }

    private fetchPresetsAndDrafts() {
        fetch('/api/presets-and-drafts', {
            headers: {
                'X-Auth-Token': this.props.apiKey as string
            }
        })
            .then((result) => {
                if (result.ok) {
                    return result.json();
                }
                this.props.onSetApiKey(undefined);
                return Promise.reject('Authorization failed');
            })
            .then((json) => this.props.onSetAdminPresetsAndDrafts(json));
    }

    private toggleMaintenanceMode() {
        fetch('/api/state', {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Auth-Token': this.props.apiKey as string,
            },
            body: JSON.stringify({maintenanceMode: !this.state.serverState.maintenanceMode}),
            method: 'post'
        })
            .then((result) => {
                if (result.ok) {
                    return result.json();
                }
                this.props.onSetApiKey(undefined);
                return Promise.reject('Authorization failed');
            })
            .then((json) => this.setState({...this.state, serverState: json}));
    }

    private saveHiddenPresetIds() {
        fetch('/api/state', {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Auth-Token': this.props.apiKey as string,
            },
            body: JSON.stringify({hiddenPresetIds: this.state.serverState.hiddenPresetIds}),
            method: 'post'
        })
            .then((result) => {
                if (result.ok) {
                    return result.json();
                }
                this.props.onSetApiKey(undefined);
                return Promise.reject('Authorization failed');
            })
            .then((json) => this.setState({...this.state, serverState: json}));
    }

    private reloadDraftArchive() {
        fetch('/api/reload-archive', {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Auth-Token': this.props.apiKey as string,
            },
            body: JSON.stringify({hiddenPresetIds: this.state.serverState.hiddenPresetIds}),
            method: 'post'
        })
            .then((result) => {
                if (result.ok) {
                    return result.text();
                }
                this.props.onSetApiKey(undefined);
                return Promise.reject('Authorization failed');
            })
            .then((text) => alert(text));
    }

    componentDidMount() {
        document.title = 'Admin – AoE Captains Mode';
        this.fetchState();
        if (!this.props.presetsAndDrafts) {
            this.fetchPresetsAndDrafts();
        }
    }

    public render() {

        if (!this.props.apiKey) {
            return (<Redirect to={'/admin/login'}/>);
        }

        return (
            <div className={'content box'}>
                <h2>Admin Main</h2>
                <button className={'button'} onClick={() => this.logout()}>Logout</button>

                <h3>Presets</h3>

                <p>
                    This is the list of all presets.
                    Click on the name of a preset to list all drafts with that name
                    (but not necessarily of that specific preset).
                </p>

                <PresetList presets={this.props.presetsAndDrafts?.presets || []}
                            draftsKeys={Object.keys(this.props.presetsAndDrafts?.drafts || {})}/>

                <hr/>

                <h3>Maintenance Mode</h3>

                <p>
                    If maintenance mode is active, no drafts can be created.
                    Use this to e. g. create a window for an upgrade that does not disrupt ongoing drafts.<br/>
                    <b>Do not forget to disable maintenance mode afterwards!</b>
                </p>

                <p className="control">
                    <input id="toggleMaintenance" type="checkbox" name="toggleMaintenance"
                           className="switch is-small is-rounded is-info"
                           checked={this.state.serverState.maintenanceMode} onChange={() => {
                        this.toggleMaintenanceMode()
                    }}/>
                    <label htmlFor="toggleMaintenance">Maintenance Mode
                        is {this.state.serverState.maintenanceMode ? 'active' : 'off'}</label>
                </p>


                <h3>Hidden Preset IDs</h3>

                <p>
                    Drafts for hidden Preset IDs are not added to the list of ongoing and recent drafts.<br/>
                    When a Preset ID is added to this list, existing drafts are not removed from the list of ongoing and
                    recent drafts.<br/>
                    When a Preset ID is removed from this list, existing drafts are not added to that list
                    retroactively.<br/>
                    Write one Preset ID per line in the textarea below.
                </p>

                <textarea className="textarea" placeholder="abcdef" id="hiddenPresetIds"
                          value={this.state.serverState.hiddenPresetIds.join('\n')}
                          onChange={(event) => {
                              this.setState({
                                  ...this.state,
                                  serverState: {
                                      maintenanceMode: this.state.serverState.maintenanceMode,
                                      hiddenPresetIds: event.target.value.split('\n')
                                  }
                              });
                          }}
                ></textarea>
                <button className={'button'} onClick={() => this.saveHiddenPresetIds()}>Save hidden Preset IDs</button>


                <h3>Reload Draft Archive</h3>

                <p>
                    After moving stored drafts around on the server, the draft archive has to be reloaded so that the
                    files can be found again.
                </p>

                <button className={'button'} onClick={() => this.reloadDraftArchive()}>Reload Draft Archive</button>

            </div>
        );
    }
}

export function mapStateToProps(state: ApplicationState) {
    return {
        apiKey: state.admin.apiKey,
        presetsAndDrafts: state.admin.presetsAndDrafts,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSetApiKey: (apiKey: string | undefined) => dispatch(actions.setApiKey(apiKey)),
        onSetAdminPresetsAndDrafts: (presetsAndDrafts: IPresetAndDraftList | undefined) => dispatch(actions.setAdminPresetsAndDrafts(presetsAndDrafts)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(AdminMain));
