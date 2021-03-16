import * as React from 'react';
import ActionType, {actionTypeFromAction} from "../../constants/ActionType";
import {default as ModelPlayer} from '../../constants/Player';
import {default as ModelPreset} from '../../models/Preset';
import CivPanel from "../../containers/CivPanel";
import Civilisation from "../../models/Civilisation";
import {DraftEvent} from "../../types/DraftEvent";
import PlayerEvent from "../../models/PlayerEvent";
import Turn from "../../models/Turn";
import CivPanelType from "../../constants/CivPanelType";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import PlayerOnlineStatus from "../../containers/PlayerOnlineStatus";
import WhoAmIIndicator from "../../containers/WhoAmIIndicator";

interface IProps extends WithTranslation {
    preset: ModelPreset;
    player: ModelPlayer;
    name: string;
    nextAction?: number;
    events?: DraftEvent[];
    simplifiedUI?: boolean
}

interface IState {
    bannedCivs: Civilisation[];
    pickedCivs: Civilisation[];
    snipedCivs: Civilisation[];
    stolenCivs: Civilisation[];
}

class PlayerDraftState extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = eventsToState(props.events, props.player);
    }

    public componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
        this.setState(eventsToState(nextProps.events, nextProps.player));
    }

    public render() {
        const playerId: string = 'player-' + this.props.player.toString().toLowerCase();

        let picksIndex = 0;
        let bansIndex = 0;
        const pickPanels = [];
        const banPanels = [];
        const snipes: Civilisation[] = [...this.state.snipedCivs];
        const steals: Civilisation[] = [...this.state.stolenCivs];
        let hasActivePanel = false;
        for (let i = 0; i < this.props.preset.turns.length; i++) {
            const turn: Turn = this.props.preset.turns[i];
            const actionType = actionTypeFromAction(turn.action);
            if (this.props.player === turn.player) {
                const isThisPanelActive = this.isActive(i);
                hasActivePanel = hasActivePanel || isThisPanelActive;
                if (actionType === ActionType.PICK) {
                    let pickedCiv;
                    let sniped = undefined;
                    let stolen = undefined;
                    if (this.state.pickedCivs.length > picksIndex) {
                        pickedCiv = this.state.pickedCivs[picksIndex];
                        sniped = removeIfContains(snipes, pickedCiv);
                        if (!sniped) {
                            stolen = removeIfContains(steals, pickedCiv);
                        }
                    }
                    picksIndex++;
                    pickPanels.push(React.createElement(CivPanel, {
                        active: isThisPanelActive,
                        byOpponent: turn.player !== turn.executingPlayer,
                        civPanelType: CivPanelType.PICK,
                        civilisation: pickedCiv,
                        key: picksIndex,
                        sniped,
                        stolen
                    }));
                } else if (actionType === ActionType.STEAL) {
                    let pickedCiv;
                    let sniped = undefined;
                    let stolen = undefined;
                    if (this.state.pickedCivs.length > picksIndex) {
                        pickedCiv = this.state.pickedCivs[picksIndex];
                        sniped = removeIfContains(snipes, pickedCiv);
                        if (!sniped && pickedCiv !== Civilisation.HIDDEN_STEAL) {
                            stolen = removeIfContains(steals, pickedCiv);
                        }
                    }
                    picksIndex++;
                    pickPanels.push(React.createElement(CivPanel, {
                        active: isThisPanelActive,
                        byOpponent: turn.player !== turn.executingPlayer,
                        civPanelType: CivPanelType.STEAL,
                        civilisation: pickedCiv,
                        key: picksIndex,
                        sniped,
                        stolen
                    }));
                } else if (actionType === ActionType.BAN) {
                    let bannedCiv;
                    if (this.state.bannedCivs.length > bansIndex) {
                        bannedCiv = this.state.bannedCivs[bansIndex];
                    }
                    bansIndex++;
                    banPanels.push(React.createElement(CivPanel, {
                        active: isThisPanelActive,
                        byOpponent: turn.player !== turn.executingPlayer,
                        civPanelType: CivPanelType.BAN,
                        civilisation: bannedCiv,
                        key: bansIndex,
                    }));

                }
            }
        }

        const draftIsOngoing = this.isDraftOngoing();
        const playerClass = (draftIsOngoing && !hasActivePanel) ? 'player player-inactive' : 'player';

        return (
            <div id={playerId} className="column is-half">
                <div className={playerClass + " box content is-inline-block"}>
                    <div className="is-uppercase has-text-grey is-size-7 pb-2 captains-line">
                        {!this.props.simplifiedUI && <>
                            <span className={'player-type'}><Trans>{this.props.player}</Trans></span>&nbsp;
                            <WhoAmIIndicator forPlayer={this.props.player}/>&nbsp;
                            <PlayerOnlineStatus forPlayer={this.props.player}/>
                        </>}
                    </div>
                    <div className="player-head">
                        <h4 className="player-name">{this.props.name}</h4>
                    </div>
                    <div className="chosen">
                        {pickPanels.length > 0 && <>
                            {!this.props.simplifiedUI && <div className="is-uppercase has-text-grey is-size-7 pb-2 sub-heading"><Trans>Picks</Trans></div>}
                            <div className="picks">
                                {pickPanels}{this.props.simplifiedUI && banPanels.length > 0 && banPanels}
                            </div>
                        </>}
                        {!this.props.simplifiedUI && banPanels.length > 0 && <>
                            <div className="is-uppercase has-text-grey is-size-7 py-2 sub-heading"><Trans>Bans</Trans></div>
                            <div className="bans">
                                {banPanels}
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        );
    }

    private isDraftOngoing() {
        return this.hasDraftStarted() && !this.hasDraftEnded();
    }

    private hasDraftEnded() {
        if (this.props.nextAction === undefined) {
            return false;
        }
        return this.props.nextAction >= this.props.preset.turns.length;
    }

    private hasDraftStarted() {
        if (this.props.nextAction === undefined) {
            return false;
        }
        return this.props.nextAction > -1;
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

function removeIfContains(haystack: Civilisation[], needle: Civilisation): Civilisation | undefined {
    const index: number = haystack.findIndex((value: Civilisation) => {
        return value.name === needle.name && value.gameVersion === needle.gameVersion
    });
    if (index > -1) {
        return haystack.splice(index, 1)[0];
    }
    return undefined;
}


function eventsToState(events: DraftEvent[] | undefined, player: ModelPlayer): IState {
    if (events === undefined) {
        return {bannedCivs: [], pickedCivs: [], snipedCivs: [], stolenCivs: []};
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
            case ActionType.STEAL:
                picks.push(event.civilisation);
                break;
        }
    }
    const opponentEvents: PlayerEvent[] = events
        .filter(e => e.hasOwnProperty('actionType'))
        .map(e => e as PlayerEvent)
        .filter(e => e.player !== player);
    const snipes: Civilisation[] = [];
    const steals: Civilisation[] = [];
    for (const event of opponentEvents) {
        switch (event.actionType) {
            case ActionType.SNIPE:
                snipes.push(event.civilisation);
                break;
            case ActionType.STEAL:
                steals.push(event.civilisation);
                break;
        }
    }
    return {bannedCivs: bans, pickedCivs: picks, snipedCivs: snipes, stolenCivs: steals};
}

export default withTranslation()(PlayerDraftState);
