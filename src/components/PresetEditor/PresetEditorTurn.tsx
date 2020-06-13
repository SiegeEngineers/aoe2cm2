import * as React from "react";
import Player from "../../constants/Player";
import PlayerTurnSettings from "./PlayerTurnSettings";
import Turn from "../../models/Turn";

interface IProps {
    index: number,
    turn: Turn,
    onValueChange: (turn: Turn | null, index: number) => void,
}

export const PresetEditorTurn = ({index, turn, onValueChange}: IProps) =>
    <div className="columns is-mobile has-background-light" key={'turn-' + index}
         style={{borderBottom: '1px solid #ddd'}}>
        <div className="column is-1 has-text-vcentered is-size-5 has-text-grey">{index + 1}</div>
        <div className="column has-text-centered">
            <PlayerTurnSettings player={Player.HOST} turn={turn} key={'host-' + index} index={index}/>
        </div>
        <div className="column has-text-centered">
            <PlayerTurnSettings player={Player.NONE} turn={turn} key={'host-' + index} index={index}/>
        </div>
        <div className="column has-text-centered">
            <PlayerTurnSettings player={Player.GUEST} turn={turn} key={'host-' + index} index={index}/>
        </div>
        <div className="column has-text-right is-1 has-text-vcentered">
            <button className="delete is-medium" onClick={() => {
                onValueChange(null, index);
            }}/>
        </div>
    </div>;
