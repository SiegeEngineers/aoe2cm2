import React from "react";
import Turn from "../../models/Turn";
import Player from "../../constants/Player";
import ActionDropdown from "./ActionDropdown";
import HiddenCheckbox from "./HiddenCheckbox";
import ExclusivityDropdown from "./ExclusivityDropdown";
import ParallelCheckbox from "./ParallelCheckbox";
import AsOpponentCheckbox from "./AsOpponentCheckbox";
import AsPlayerDropdown from "./AsPlayerDropdown";
import TurnCategoriesInput from "./TurnCategoriesInput";

interface Props {
    turn: Turn,
    player: Player,
    index: number,
}

class PlayerTurnSettings extends React.Component<Props, object> {
    render() {
        if (this.props.turn.executingPlayer !== this.props.player) {
            return null;
        }
        if (this.props.turn.executingPlayer === Player.NONE) {
            const canHide = this.props.turn.player !== Player.NONE;
            return <div>
                <ActionDropdown turn={this.props.turn} index={this.props.index}/>
                <ExclusivityDropdown turn={this.props.turn} index={this.props.index}/>
                <div className="option-row">
                    <HiddenCheckbox turn={this.props.turn} index={this.props.index} disabled={!canHide}/>
                    <AsPlayerDropdown turn={this.props.turn} index={this.props.index}/>
                </div>
                <TurnCategoriesInput turn={this.props.turn} index={this.props.index} key={'tci'+this.props.index}/>
            </div>;
        }
        return <React.Fragment>
            <ActionDropdown turn={this.props.turn} index={this.props.index}/>
            <ExclusivityDropdown turn={this.props.turn} index={this.props.index}/>
            <br/>
            <HiddenCheckbox turn={this.props.turn} index={this.props.index}/>
            &nbsp;
            <ParallelCheckbox turn={this.props.turn} index={this.props.index}/>
            &nbsp;
            <AsOpponentCheckbox turn={this.props.turn} index={this.props.index}/>
            <TurnCategoriesInput turn={this.props.turn} index={this.props.index} key={'tci'+this.props.index}/>
        </React.Fragment>;
    }
}

export default PlayerTurnSettings;