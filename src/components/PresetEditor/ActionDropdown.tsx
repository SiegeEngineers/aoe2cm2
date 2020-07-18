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

class ActionDropdown extends React.Component<Props, object> {
    render() {
        const options = [];
        let i = 0;
        if (this.props.turn.player === Player.NONE) {
            options.push(<option key={i++} value={Action.REVEAL_ALL}>{Action.REVEAL_ALL}</option>);
            options.push(<option key={i++} value={Action.REVEAL_PICKS}>{Action.REVEAL_PICKS}</option>);
            options.push(<option key={i++} value={Action.REVEAL_BANS}>{Action.REVEAL_BANS}</option>);
            options.push(<option key={i++} value={Action.REVEAL_SNIPES}>{Action.REVEAL_SNIPES}</option>);
        } else {
            options.push(<option key={i++} value={Action.PICK}>{Action.PICK}</option>);
            options.push(<option key={i++} value={Action.BAN}>{Action.BAN}</option>);
            options.push(<option key={i++} value={Action.SNIPE}>{Action.SNIPE}</option>);
        }
        return <div className="select is-small">
            <select value={this.props.turn.action} onChange={(event) => {
                const t = this.props.turn;
                const newTurn = new Turn(t.player, event.target.value as Action, t.exclusivity, t.hidden, t.parallel);
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

export default connect(mapStateToProps, mapDispatchToProps)(ActionDropdown);
