import * as React from "react";
import {ApplicationState, IPresetAndDraftList, IPresetMetaData} from "../../types";
import {Link} from "react-router-dom";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {connect} from "react-redux";
import {Util} from "../../util/Util";

interface Props {
    presets: IPresetMetaData[]
    draftsKeys: string[]
    onSetAdminPresetsAndDrafts: (presetsAndDrafts: IPresetAndDraftList | undefined) => void
}

interface State {
    shortList: boolean
}

const FILTERED_LIST_LENGTH = 200;

class PresetList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {shortList: true};
    }

    private toggleFullList() {
        this.setState({shortList: !this.state.shortList});
    }

    public render() {
        const filterValue = this.props.presets.map(value => value.created).sort()[Math.max(0, this.props.presets.length - FILTERED_LIST_LENGTH)];
        const presetRows = this.props.presets
            .filter(value => this.state.shortList ? (value.created > filterValue) : true)
            .map(preset => {
                const listDraftsLink = this.props.draftsKeys.includes(preset.name) ?
                    <Link to={`/admin/draft/${preset.name}`}>{preset.name}</Link> :
                    <span className="has-text-grey">{preset.name}</span>
                return (<tr>
                    <td><Link to={`/preset/${preset.code}`}>{preset.code}</Link></td>
                    <td>
                        {listDraftsLink}
                    </td>
                    <td>{Util.formatTimestamp(preset.created)}</td>
                </tr>)
        });
        return (
            <div>
                <p>
                    <input id="toggleFullList" type="checkbox" name="toggleFullList"
                           className="switch is-small is-rounded is-info"
                           checked={this.state.shortList} onChange={() => {
                        this.toggleFullList()
                    }}/>
                    <label htmlFor="toggleFullList">Show only latest {FILTERED_LIST_LENGTH} Presets</label>
                </p>

                <table className="table is-striped is-narrow is-hoverable preset-list">
                    <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Created</th>
                    </tr>
                    </thead>
                    <tbody>
                    {presetRows}
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
        onSetAdminPresetsAndDrafts: (presetsAndDrafts: IPresetAndDraftList | undefined) => dispatch(actions.setAdminPresetsAndDrafts(presetsAndDrafts)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresetList);
