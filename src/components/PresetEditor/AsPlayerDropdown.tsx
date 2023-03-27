import React from "react";
import Player from "../../constants/Player";
import {Action as ReducerAction, ISetEditorTurn, setEditorTurn} from "../../actions";
import Action from "../../constants/Action";
import Turn from "../../models/Turn";
import {Dispatch} from "redux";
import {connect} from "react-redux";

interface Props {
    turn: Turn,
    index: number,
    onValueChange: (turn: Turn, index: number) => ISetEditorTurn
}

class AsPlayerDropdown extends React.Component<Props, object> {
    render() {
        const options = [];
        let i = 0;
        options.push(<option key={i++} value={Player.NONE}>{Player.NONE}</option>);
        if ([Action.PICK, Action.BAN].includes(this.props.turn.action)) {
            options.push(<option key={i++} value={Player.HOST}>{Player.HOST}</option>);
            options.push(<option key={i++} value={Player.GUEST}>{Player.GUEST}</option>);
        }
        return <div className="select is-small">
            <select value={this.props.turn.player} onChange={(event) => {
                const t = this.props.turn;
                const newTurn = new Turn((event.target.value as Player), t.action, t.exclusivity, t.hidden, t.parallel, t.executingPlayer);
                this.props.onValueChange(newTurn, this.props.index)
            }}>{options}
            </select>
        </div>
    }
}

export function mapStateToProps() {
    return {}
}

export function mapDispatchToProps(dispatch: Dispatch<ReducerAction>) {
    return {
        onValueChange: (turn: Turn, index: number) => dispatch(setEditorTurn(turn, index)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AsPlayerDropdown);
