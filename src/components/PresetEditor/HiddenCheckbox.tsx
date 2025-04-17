import React from "react";
import Turn from "../../models/Turn";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {connect} from "react-redux";
import {ISetEditorTurn} from "../../actions";

interface Props {
    turn: Turn,
    index: number,
    disabled?: boolean,
    onValueChange: (turn: Turn, index: number) => ISetEditorTurn
}

class HiddenCheckbox extends React.Component<Props, object> {
    render() {
        return <label className="checkbox tag has-background-transparent">
            <input type='checkbox' checked={this.props.turn.hidden} disabled={!!this.props.disabled} onChange={() => {
                const t = this.props.turn;
                const newTurn = new Turn(t.player, t.action, t.exclusivity, !t.hidden, t.parallel, t.executingPlayer);
                this.props.onValueChange(newTurn, this.props.index)
            }}/>
            &nbsp;HIDDEN
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

export default connect(mapStateToProps, mapDispatchToProps)(HiddenCheckbox);
