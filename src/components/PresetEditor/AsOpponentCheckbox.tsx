import React from "react";
import Turn from "../../models/Turn";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {ISetEditorTurn} from "../../actions";
import {connect} from "react-redux";
import Player from "../../constants/Player";

interface Props {
    turn: Turn,
    index: number,
    onValueChange: (turn: Turn, index: number) => ISetEditorTurn
}

class AsOpponentCheckbox extends React.Component<Props, object> {
    render() {
        return <label className="checkbox tag has-background-transparent">
            <input type='checkbox' checked={this.props.turn.player !== this.props.turn.executingPlayer} onChange={() => {
                const t = this.props.turn;
                const newPlayer = (t.player === Player.HOST) ? Player.GUEST : Player.HOST;
                const newTurn = new Turn(newPlayer, t.action, t.exclusivity, t.hidden, t.parallel, t.executingPlayer);
                this.props.onValueChange(newTurn, this.props.index)
            }}/>&nbsp;AS&nbsp;OPPONENT
        </label>
    }
}


export function mapStateToProps() {
    return {}
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onValueChange: (turn: Turn, index: number) => dispatch(actions.setEditorTurn(turn, index)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AsOpponentCheckbox);
