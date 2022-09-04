import * as React from "react";
import {ApplicationState, IPresetMetaData} from "../../types";
import {Link} from "react-router-dom";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {connect} from "react-redux";
import {Util} from "../../util/Util";

interface Props {
    presets: IPresetMetaData[]
    draftsKeys: string[]
    onSelectPreset: (name: string) => void
}

interface State {
}

class PresetList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        const presetRows = this.props.presets.map(preset => {
            const listDraftsButton = this.props.draftsKeys.includes(preset.name) ?
                <button className={'button is-link is-small'}
                        onClick={() => this.props.onSelectPreset(preset.name)}>{preset.name}</button> :
                <span className="tag">{preset.name}</span>
            return (<tr>
                <td><Link to={`/preset/${preset.code}`}>{preset.code}</Link></td>
                <td>
                    {listDraftsButton}
                </td>
                <td>{Util.formatTimestamp(preset.created)}</td>
            </tr>)
        });
        return (
            <div>
                <table className="table is-striped is-narrow is-hoverable">
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
        onSelectPreset: (name: string | undefined) => dispatch(actions.setAdminPresetName(name)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresetList);
