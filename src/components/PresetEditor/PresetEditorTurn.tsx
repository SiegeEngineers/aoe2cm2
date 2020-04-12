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
    <div className="pure-g" key={'turn-' + index}
         style={{margin: '.2rem 0 .2rem 0', padding: '0.2rem', backgroundColor: 'rgba(100,100,100,0.3)'}}>
        <div className="pure-u-1-24">{index}</div>
        <div className="pure-u-8-24">
            <PlayerTurnSettings player={Player.HOST} turn={turn} key={'host-' + index} index={index}/>
        </div>
        <div className="pure-u-5-24">
            <PlayerTurnSettings player={Player.NONE} turn={turn} key={'host-' + index} index={index}/>
        </div>
        <div className="pure-u-8-24">
            <PlayerTurnSettings player={Player.GUEST} turn={turn} key={'host-' + index} index={index}/>
        </div>
        <div className="pure-u-2-24">
            <button className="pure-button" onClick={() => {
                onValueChange(null, index);
            }}>X
            </button>
        </div>
    </div>;
