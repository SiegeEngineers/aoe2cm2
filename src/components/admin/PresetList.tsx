import * as React from "react";
import {ApplicationState, IPresetAndDraftList} from "../../types";
import {Link} from "react-router-dom";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {connect} from "react-redux";
import {Util} from "../../util/Util";

interface Props {
    presetsAndDrafts?: IPresetAndDraftList
    onSetAdminPresetsAndDrafts: (presetsAndDrafts: IPresetAndDraftList | undefined) => void
}

interface State {
    shortList: boolean
    nameFilter: string
    daysPast: number
}

class PresetList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {shortList: true, nameFilter: "", daysPast: 10};
    }

    private toggleFullList() {
        this.setState({shortList: !this.state.shortList});
    }

    public render() {
        if (!this.props.presetsAndDrafts) {
            return <span>Loading…</span>;
        }
        const displayLimitTimestamp = (Date.now() / 1000) - (this.state.daysPast * 24 * 60 * 60);
        const presetRows = this.props.presetsAndDrafts.presets
            .sort((a, b) => {
                if (a.last_draft < b.last_draft) {
                    return 1;
                }
                if (a.last_draft > b.last_draft) {
                    return -1;
                }
                return 0;
            })
            .filter(value => this.state.shortList ? (this.props.presetsAndDrafts?.drafts_by_preset_id[value.code]?.length) : true)
            .filter(value => this.state.shortList ? (value.last_draft > displayLimitTimestamp) : true)
            .filter(value => value.name.toLowerCase().includes(this.state.nameFilter.toLowerCase()))
            .map(preset => {
                let listDraftsTitle = <span className="has-text-grey">{preset.name}</span>;
                let countLinkClass = 'tag';
                const byIdCount = this.props.presetsAndDrafts?.drafts_by_preset_id[preset.code]?.length || 0;
                const byNameCount = this.props.presetsAndDrafts?.drafts_by_title[preset.name]?.length || 0;
                if (byIdCount > 0) {
                    countLinkClass = 'tag is-info';
                    listDraftsTitle = <span>{preset.name}</span>;
                }
                return (<tr>
                    <td><Link to={`/preset/${preset.code}`}>{preset.code}</Link></td>
                    <td>
                        {listDraftsTitle}

                        <Link to={`/admin/draft/${preset.code}`} className="ml-2 mr-1">
                            <div className="tags has-addons">
                                <span className={countLinkClass}>{byIdCount}</span>
                                <span className="tag">by Code</span>
                            </div>
                        </Link>

                        <Link to={`/admin/draft/${preset.name}`}>
                            <div className="tags has-addons">
                                <span className="tag">{byNameCount}</span>
                                <span className="tag">by Name</span>
                            </div>
                        </Link>
                    </td>
                    <td>{Util.formatTimestamp(preset.created)}</td>
                    <td>{Util.formatTimestamp(preset.last_draft)}</td>
                </tr>)
            });
        return (
            <div>
                <div>
                    <input id="toggleFullList" type="checkbox" name="toggleFullList"
                           className="switch is-small is-rounded is-info"
                           checked={this.state.shortList} onChange={() => {
                        this.toggleFullList()
                    }}/>
                    <label htmlFor="toggleFullList">
                        Show only presets with drafts in the past <input type="text" value={this.state.daysPast}
                                                                     style={{width: "2em"}}
                                                                     onChange={(event) => {
                                                                         const newValue = parseInt(event.target.value);
                                                                         if (newValue) {
                                                                             this.setState({daysPast: newValue});
                                                                         }
                                                                     }}/> days
                    </label>
                </div>
                <div className="field has-addons mt-2 mb-0">
                    <p className="control">
                        <a className="button is-static">
                            Filter name
                        </a>
                    </p>
                    <p className="control is-flex-grow-1">
                        <input type="text" value={this.state.nameFilter} className="input"
                               onChange={(event) => {
                                   this.setState({nameFilter: event.target.value});
                               }}/>
                    </p>
                </div>

                <table className="table is-striped is-narrow is-hoverable preset-list">
                    <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Created</th>
                        <th>Last Draft</th>
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
