import * as React from 'react';
import ActionType, {fromAction} from "../models/ActionType";
import {default as ModelPlayer} from '../models/Player';
import {default as ModelPreset} from '../models/Preset';
import '../pure-min.css'
import '../style2.css'
import CivPanel from "../containers/CivPanel";
import Civilisation from "../models/Civilisation";
import {DraftEvent} from "../models/DraftEvent";
import PlayerEvent from "../models/PlayerEvent";
import Turn from "../models/Turn";

interface IProps {
    preset: ModelPreset;
    player: ModelPlayer;
    name: string;
    nextAction?: number;
    events?: DraftEvent[];
}

interface IState {
    bannedCivs: Civilisation[];
    pickedCivs: Civilisation[];
    snipedCivs: Civilisation[];
}

class Player extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = eventsToState(props.events, props.player);
    }

    public componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
        console.log("Propping up", nextProps);
        this.setState(eventsToState(nextProps.events, nextProps.player));
    }

    public render() {
        const playerId: string = 'player-' + this.props.player.toString().toLowerCase();

        let picksIndex = 0;
        let bansIndex = 0;
        const pickPanels = [];
        const banPanels = [];
        for (let i = 0; i < this.props.preset.turns.length; i++) {
            const turn: Turn = this.props.preset.turns[i];
            const actionType = fromAction(turn.action);
            if (this.props.player === turn.player) {
                if (actionType === ActionType.PICK) {
                    let pickedCiv;
                    if (this.state.pickedCivs.length > picksIndex) {
                        pickedCiv = this.state.pickedCivs[picksIndex];
                    }
                    picksIndex++;
                    pickPanels.push(React.createElement(CivPanel, {
                        actionType: ActionType.PICK,
                        active: i === this.props.nextAction,
                        civilisation: pickedCiv
                    }));
                } else if (actionType === ActionType.BAN) {
                    let bannedCiv;
                    if (this.state.bannedCivs.length > bansIndex) {
                        bannedCiv = this.state.bannedCivs[bansIndex];
                    }
                    bansIndex++;
                    banPanels.push(React.createElement(CivPanel, {
                        actionType: ActionType.BAN,
                        active: i === this.props.nextAction,
                        civilisation: bannedCiv
                    }));

                }
            }
        }

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


function eventsToState(events: DraftEvent[] | undefined, player: ModelPlayer): IState {
    if (events === undefined) {
        return {bannedCivs: [], pickedCivs: [], snipedCivs: []};
    } else {
        events = events as DraftEvent[];
    }
    const playerEvents: PlayerEvent[] = events
        .filter(e => e instanceof PlayerEvent)
        .map(e => e as PlayerEvent)
        .filter(e => e.player === player);
    const picks: Civilisation[] = [];
    const bans: Civilisation[] = [];
    const snipes: Civilisation[] = [];
    for (const event of playerEvents) {
        switch (event.actionType) {
            case ActionType.PICK:
                picks.push(event.civilisation);
                break;
            case ActionType.BAN:
                bans.push(event.civilisation);
                break;
            case ActionType.SNIPE:
                snipes.push(event.civilisation);
                break;
        }
    }
    return {bannedCivs: bans, pickedCivs: picks, snipedCivs: snipes};
}

export default Player;
