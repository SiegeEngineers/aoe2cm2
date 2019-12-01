import * as React from 'react';
import ActionType, {actionTypeFromAction} from "../../models/ActionType";
import {default as ModelPlayer} from '../../models/Player';
import {default as ModelPreset} from '../../models/Preset';
import CivPanel from "../../containers/CivPanel";
import Civilisation from "../../models/Civilisation";
import {DraftEvent} from "../../models/DraftEvent";
import PlayerEvent from "../../models/PlayerEvent";
import Turn from "../../models/Turn";
import CivPanelType from "../../models/CivPanelType";
import {Trans, WithTranslation, withTranslation} from "react-i18next";

interface IProps extends WithTranslation {
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

class PlayerDraftState extends React.Component<IProps, IState> {

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
        const snipes: Civilisation[] = [...this.state.snipedCivs];
        for (let i = 0; i < this.props.preset.turns.length; i++) {
            const turn: Turn = this.props.preset.turns[i];
            const actionType = actionTypeFromAction(turn.action);
            if (this.props.player === turn.player) {
                if (actionType === ActionType.PICK) {
                    let pickedCiv;
                    let sniped = false;
                    if (this.state.pickedCivs.length > picksIndex) {
                        pickedCiv = this.state.pickedCivs[picksIndex];
                        sniped = removeIfContains(snipes, pickedCiv);
                    }
                    picksIndex++;
                    pickPanels.push(React.createElement(CivPanel, {
                        active: this.isActive(i),
                        civPanelType: CivPanelType.PICK,
                        civilisation: pickedCiv,
                        sniped
                    }));
                } else if (actionType === ActionType.BAN) {
                    let bannedCiv;
                    if (this.state.bannedCivs.length > bansIndex) {
                        bannedCiv = this.state.bannedCivs[bansIndex];
                    }
                    bansIndex++;
                    banPanels.push(React.createElement(CivPanel, {
                        active: this.isActive(i),
                        civPanelType: CivPanelType.BAN,
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
                                <Trans>{this.props.player}</Trans>
                            </div>
                            <div className="player-head">
                                <div className="player-name">{this.props.name}</div>
                            </div>
                            <div className="chosen">
                                <div className="head-text"><Trans>Picks</Trans></div>
                                <div className="picks">
                                    {pickPanels}
                                </div>

                                <div className="head-text"><Trans>Bans</Trans></div>
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

    private isActive(i: number) {
        if (i === this.props.nextAction) {
            return true;
        }

        const numberOfTurns: number = this.props.preset.turns.length;

        if (i + 1 === this.props.nextAction && numberOfTurns > i && this.props.preset.turns[i].parallel) {
            return true;
        }

        if (i - 1 === this.props.nextAction && i - 1 >= 0 && this.props.preset.turns[i - 1].parallel) {
            return true;
        }

        return false;
    }
}

function removeIfContains(haystack: Civilisation[], needle: Civilisation): boolean {
    const index: number = haystack.findIndex((value: Civilisation) => {
        return value.name === needle.name && value.gameVersion === needle.gameVersion
    });
    if (index > -1) {
        haystack.splice(index, 1);
        return true;
    }
    return false;
}


function eventsToState(events: DraftEvent[] | undefined, player: ModelPlayer): IState {
    if (events === undefined) {
        return {bannedCivs: [], pickedCivs: [], snipedCivs: []};
    } else {
        events = events as DraftEvent[];
    }
    const playerEvents: PlayerEvent[] = events
        .filter(e => e.hasOwnProperty('actionType'))
        .map(e => e as PlayerEvent)
        .filter(e => e.player === player);
    const picks: Civilisation[] = [];
    const bans: Civilisation[] = [];
    for (const event of playerEvents) {
        switch (event.actionType) {
            case ActionType.PICK:
                picks.push(event.civilisation);
                break;
            case ActionType.BAN:
                bans.push(event.civilisation);
                break;
        }
    }
    const opponentEvents: PlayerEvent[] = events
        .filter(e => e.hasOwnProperty('actionType'))
        .map(e => e as PlayerEvent)
        .filter(e => e.player !== player);
    const snipes: Civilisation[] = [];
    for (const event of opponentEvents) {
        if (event.actionType === ActionType.SNIPE) {
            snipes.push(event.civilisation);
        }
    }
    return {bannedCivs: bans, pickedCivs: picks, snipedCivs: snipes};
}

export default withTranslation()(PlayerDraftState);
