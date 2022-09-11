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
    presetTitle: string
}

class DraftList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {presetTitle: ''};
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


    componentDidMount() {
        let presetTitle = Util.getPresetNameFromUrl();
        document.title = presetTitle + ' Drafts – AoE Captains Mode';
        this.setState({presetTitle: presetTitle});
        if (!this.props.presetsAndDrafts) {
            this.fetchPresetsAndDrafts();
        }
    }

    public render() {
        let draftRows = [<tr>
            <td colSpan={3}>Loading…</td>
        </tr>];
        if (this.state.presetTitle && this.props.presetsAndDrafts) {
            if (this.props.presetsAndDrafts.drafts[this.state.presetTitle]) {
                draftRows = this.props.presetsAndDrafts.drafts[this.state.presetTitle].map(draft => <tr>
                    <td><Link to={`/draft/${draft.code}`}><code>{draft.code}</code></Link></td>
                    <td><span className="tag is-info">{draft.host}</span></td>
                    <td><span className="tag is-warning">{draft.guest}</span></td>
                    <td>{Util.formatTimestamp(draft.created)}</td>
                </tr>);
            } else {
                draftRows = [<tr>
                    <td colSpan={3}>No drafts.</td>
                </tr>]
            }
        }
        return (
            <div className={'content box'}>
                <h3>Drafts Titled »{this.state.presetTitle}«</h3>

                <p><Link to={'/admin/'}>« Back to Admin</Link></p>

                <table className="table is-striped is-narrow is-hoverable">
                    <thead>
                    <tr>
                        <th>Code</th>
                        <th>Host</th>
                        <th>Guest</th>
                        <th>Created</th>
                    </tr>
                    </thead>
                    <tbody>
                    {draftRows}
                    </tbody>
                </table>
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

export default connect(mapStateToProps, mapDispatchToProps)(DraftList);
