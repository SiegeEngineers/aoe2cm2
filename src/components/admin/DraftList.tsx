import * as React from "react";
import {ApplicationState, IDraftMetaData} from "../../types";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {Link} from "react-router-dom";
import {Util} from "../../util/Util";

interface Props {
    drafts: IDraftMetaData[]
    onSelectPreset: (name: string | undefined) => void
    presetTitle: string
}

interface State {
}

class DraftList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        const draftRows = this.props.drafts.map(draft => <tr>
            <td><Link to={`/draft/${draft.code}`}><code>{draft.code}</code></Link></td>
            <td><span className="tag is-info">{draft.host}</span></td>
            <td><span className="tag is-warning">{draft.guest}</span></td>
            <td>{Util.formatTimestamp(draft.created)}</td>
        </tr>);
        return (
            <div>
                <div className="columns">
                    <div className="column is-narrow">
                        <button className="button is-small" onClick={() => this.props.onSelectPreset(undefined)}>
                            « Back
                        </button>
                    </div>
                    <div className="column">
                        <h4>Drafts Titled »{this.props.presetTitle}«</h4>
                    </div>
                </div>

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
    return {}
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSelectPreset: (name: string | undefined) => dispatch(actions.setAdminPresetName(name)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DraftList);
