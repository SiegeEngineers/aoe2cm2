import * as React from "react";
import {ApplicationState, IPresetAndDraftList} from "../../types";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {Link} from "react-router-dom";
import {Util} from "../../util/Util";

interface Props {
    apiKey: string | undefined
    presetsAndDrafts?: IPresetAndDraftList
    onSetAdminPresetsAndDrafts: (presetsAndDrafts: IPresetAndDraftList | undefined) => void
    onSetApiKey: (apiKey: string | undefined) => void
}

interface State {
    presetIdOrName: string
}

class DraftList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {presetIdOrName: ''};
    }

    private async fetchPresetsAndDrafts() {
        return fetch('/api/presets-and-drafts', {
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


    componentDidMount() {
        let presetIdOrName = Util.getPresetIdOrNameFromUrl();
        document.title = presetIdOrName + ' Drafts – AoE Captains Mode';
        this.setState({presetIdOrName: presetIdOrName});
        if (!this.props.presetsAndDrafts) {
            this.fetchPresetsAndDrafts().then(() => {
                const preset = this.props.presetsAndDrafts?.presets.find((value) => value.code === presetIdOrName);
                if (preset) {
                    document.title = preset.name + ' Drafts – AoE Captains Mode';
                }
            });
        }
    }

    public render() {
        let draftRows = [<tr>
            <td colSpan={3}>Loading…</td>
        </tr>];
        let header = <h3>Drafts Titled »{this.state.presetIdOrName}«</h3>;
        if (this.props.presetsAndDrafts?.drafts_by_preset_id.hasOwnProperty(this.state.presetIdOrName)) {
            const title = this.props.presetsAndDrafts?.presets?.find(item => item.code === this.state.presetIdOrName)?.name;
            header = <h3>Drafts for Preset ID {this.state.presetIdOrName} »<Link to={`/admin/draft/${title}`}>{title}</Link>«</h3>;
        }
        if (this.state.presetIdOrName && this.props.presetsAndDrafts) {
            const draftIds = this.getDraftIds();
            if (draftIds) {
                draftRows = [];
                for (const draftId of draftIds) {
                    const draft = this.props.presetsAndDrafts.drafts[draftId];
                    draftRows.push(<tr>
                        <td><Link to={`/draft/${draftId}`}><code>{draftId}</code></Link></td>
                        <td><span className="tag is-info">{draft.host}</span></td>
                        <td><span className="tag is-warning">{draft.guest}</span></td>
                        <td>{Util.formatTimestamp(draft.created)}</td>
                        <td><Link to={`/admin/edit-draft/${draftId}`}>edit</Link></td>
                    </tr>);
                }
            } else {
                draftRows = [<tr>
                    <td colSpan={5}>No drafts.</td>
                </tr>]
            }
        }
        return (
            <div className={'content box'}>
                {header}

                <p><Link to={'/admin/'}>« Back to Admin</Link></p>

                <table className="table is-striped is-narrow is-hoverable">
                    <thead>
                    <tr>
                        <th>Code</th>
                        <th>Host</th>
                        <th>Guest</th>
                        <th>Created</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {draftRows}
                    </tbody>
                </table>
            </div>
        );
    }

    private getDraftIds(): string[] {
        if (!this.props.presetsAndDrafts) {
            return [];
        }
        return this.props.presetsAndDrafts.drafts_by_preset_id[this.state.presetIdOrName]
            || this.props.presetsAndDrafts.drafts_by_title[this.state.presetIdOrName]
            || [];
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

export default connect(mapStateToProps, mapDispatchToProps)(DraftList);
