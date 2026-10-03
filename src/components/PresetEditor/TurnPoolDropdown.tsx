import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {Trans} from "react-i18next";
import * as actions from "../../actions";
import {ISetEditorTurn} from "../../actions";
import {ApplicationState} from "../../types";
import Pool from "../../models/Pool";
import Turn from "../../models/Turn";
import {EditorPools} from "../../util/EditorPools";

interface Props {
    turn: Turn,
    index: number,
    pools: Pool[],
    onValueChange: (turn: Turn, index: number) => ISetEditorTurn,
}

export class TurnPoolDropdown extends React.Component<Props, object> {

    public render() {
        // A reveal or a pause takes no option, so it has no pool.
        if (!this.props.turn.choosesDraftOption()) {
            return null;
        }
        return (
            <div className="field is-horizontal">
                <div className="field-label is-small">
                    <label htmlFor={'poolinput-' + this.props.index} className="label">
                        <Trans i18nKey="presetEditor.turnPool">Pool</Trans>
                    </label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <div className="control">
                            <div className="select is-small">
                                <select id={'poolinput-' + this.props.index}
                                        value={this.props.turn.poolId}
                                        onChange={event => this.updatePool(event.target.value)}>
                                    {this.props.pools.map(pool =>
                                        <option value={pool.id} key={pool.id}>{pool.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private updatePool(poolId: string) {
        this.props.onValueChange(Turn.withPoolId(this.props.turn, poolId), this.props.index);
    }
}

export function mapStateToProps(state: ApplicationState) {
    return {
        pools: EditorPools.pools(state.presetEditor),
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onValueChange: (turn: Turn, index: number) => dispatch(actions.setEditorTurn(turn, index)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TurnPoolDropdown);
