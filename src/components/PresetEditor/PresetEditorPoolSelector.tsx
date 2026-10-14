import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import * as actions from "../../actions";
import {ISetEditorActivePool} from "../../actions";
import {ApplicationState} from "../../types";
import Pool from "../../models/Pool";
import {EditorPools} from "../../util/EditorPools";

interface Props {
    pools: Pool[],
    activePool: number,
    onActivePoolChange: (value: number) => ISetEditorActivePool,
    trailing?: React.ReactNode,
}

export class PresetEditorPoolSelector extends React.Component<Props, object> {

    public render() {
        if (this.props.pools.length < 2) {
            return null;
        }

        const active = this.props.pools[this.props.activePool];

        return (
            <div className="tabs is-toggle is-small pool-tabs">
                <ul>
                    {this.props.pools.map((pool, index) =>
                        <li key={pool.id} className={pool.id === active.id ? "is-active" : ""}>
                            <a href={'#pool-' + pool.id} onClick={event => {
                                event.preventDefault();
                                this.props.onActivePoolChange(index);
                            }}>
                                {pool.name} ({pool.options.length})
                            </a>
                        </li>)}
                    {this.props.trailing}
                </ul>
            </div>
        );
    }
}

export function mapStateToProps(state: ApplicationState) {
    return {
        pools: EditorPools.pools(state.presetEditor),
        activePool: EditorPools.activeIndex(state.presetEditor),
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onActivePoolChange: (value: number) => dispatch(actions.setEditorActivePool(value)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresetEditorPoolSelector);
