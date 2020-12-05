import React from "react";
import Exclusivity from "../../constants/Exclusivity";
import Turn from "../../models/Turn";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {Action, ISetEditorTurn, setEditorTurn} from "../../actions";

interface Props {
    turn: Turn,
    index: number,
    onValueChange: (turn: Turn, index: number) => ISetEditorTurn
}

class ExclusivityDropdown extends React.Component<Props, object> {
    render() {
        return <div className="select is-small">
            <select value={this.props.turn.exclusivity} onChange={(event) => {
                const t = this.props.turn;
                const newTurn = new Turn(t.player, t.action, event.target.value as Exclusivity, t.hidden, t.parallel, t.executingPlayer);
                this.props.onValueChange(newTurn, this.props.index)
            }}>
                <option value={Exclusivity.NONEXCLUSIVE}>{Exclusivity.NONEXCLUSIVE}</option>
                <option value={Exclusivity.EXCLUSIVE}>{Exclusivity.EXCLUSIVE}</option>
                <option value={Exclusivity.GLOBAL}>{Exclusivity.GLOBAL}</option>
            </select>
        </div>
    }
}

export function mapStateToProps() {
    return {}
}

export function mapDispatchToProps(dispatch: Dispatch<Action>) {
    return {
        onValueChange: (turn: Turn, index: number) => dispatch(setEditorTurn(turn, index)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExclusivityDropdown);
