import * as React from 'react';
import ActionType from "../models/ActionType";
import {default as ModelPlayer} from '../models/Player';
import {default as ModelPreset} from '../models/Preset';
import '../pure-min.css'
import '../style2.css'
import CivPanel from "./CivPanel";

interface IPlayer {
    preset: ModelPreset;
    player: ModelPlayer;
    name: string;
}

class Player extends React.Component<IPlayer, object> {
    public render() {
        const playerId: string = 'player-' + this.props.player.toString().toLowerCase();

        const pickPanels = this.props.preset.turns.filter(turn => {
            return turn.player === this.props.player && turn.action.toString().includes('PICK');
        }).map(turn => {
            return React.createElement(CivPanel, {actionType: ActionType.PICK, active: true});
        });
        const banPanels = this.props.preset.turns.filter(turn => {
            return turn.player === this.props.player && turn.action.toString().includes('BAN');
        }).map(turn => {
            return React.createElement(CivPanel, {actionType: ActionType.BAN, active: true});
        });

        return (
            <div className="pure-u-1-2">
                <div id={playerId} className="double-outer-border">
                    <div className="double-inner-border">
                        <div className="player">
                            <div className="head-text">
                                {this.props.player}
                            </div>
                            <div className="player-head">
                                <div className="player-name">{this.props.name}</div>
                            </div>
                            <div className="chosen">
                                <div className="head-text">Picks</div>
                                <div className="picks">
                                    {pickPanels}
                                </div>

                                <div className="head-text">Bans</div>
                                <div className="bans">
                                    {banPanels}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Player;
