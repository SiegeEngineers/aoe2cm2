import * as React from 'react';
import ActionType, {actionTypeFromAction} from "../../constants/ActionType";
import Player, {default as ModelPlayer} from '../../constants/Player';
import {default as ModelPreset} from '../../models/Preset';
import DraftOptionPanel from "../../containers/DraftOptionPanel";
import {DraftEvent} from "../../types/DraftEvent";
import PlayerEvent from "../../models/PlayerEvent";
import Turn from "../../models/Turn";
import DraftOptionPanelType from "../../constants/DraftOptionPanelType";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import DraftOption from "../../models/DraftOption";
import Action from "../../constants/Action";

interface IProps extends WithTranslation {
    preset: ModelPreset;
    player: ModelPlayer;
    name: string;
    nextAction?: number;
    events?: DraftEvent[];
    flipped: boolean;
    smooch: boolean;
    simplifiedUI?: boolean;
    highlightedAction: number | null;
}

interface IState {
    bans: PlayerEvent[];
    picks: PlayerEvent[];
    snipes: PlayerEvent[];
    steals: PlayerEvent[];
}

class PlayerDraftState extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = eventsToState(props.events, props.player);
    }

    public componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
        this.setState(eventsToState(nextProps.events, nextProps.player));
    }

    private hasAdminPicksAndBans(){
        for (let turn of this.props.preset.turns) {
            if(turn.player === Player.NONE) {
                if(turn.action === Action.PICK || turn.action === Action.BAN){
                    return true;
                }
            }
        }
        return false;
    }

    public render() {
        if(!this.hasAdminPicksAndBans()){
            return null;
        }
        const playerId: string = 'player-' + this.props.player.toString().toLowerCase();

        let picksIndex = 0;
        let bansIndex = 0;
        const pickPanels = [];
        const banPanels = [];
        const snipes: PlayerEvent[] = [...this.state.snipes];
        const steals: PlayerEvent[] = [...this.state.steals];
        let hasActivePanel = false;
        for (let i = 0; i < this.props.preset.turns.length; i++) {
            const turn: Turn = this.props.preset.turns[i];
            const actionType = actionTypeFromAction(turn.action);
            if (this.props.player === turn.player) {
                const isThisPanelActive = this.isActive(i);
                const isThisPanelHighlighted = this.props.highlightedAction === i;
                hasActivePanel = hasActivePanel || isThisPanelActive;
                const validDraftOptions = [...this.props.preset.options, ...DraftOption.TECHNICAL_DRAFT_OPTIONS];
                if (actionType === ActionType.PICK) {
                    let pickedOptionId: string | undefined;
                    let randomlyChosen = false;
                    let sniped = false;
                    let randomlyChosenForSnipe = false;
                    let stolen = false;
                    let randomlyChosenForSteal = false;
                    if (this.state.picks.length > picksIndex) {
                        const pick = this.state.picks[picksIndex];
                        pickedOptionId = pick.chosenOptionId;
                        randomlyChosen = pick.isRandomlyChosen;
                        const snipeEvent = removeIfContains(snipes, pick);
                        if (snipeEvent) {
                            sniped = true;
                            randomlyChosenForSnipe = snipeEvent.isRandomlyChosen;
                        } else {
                            const stealEvent = removeIfContains(steals, pick);
                            if (stealEvent) {
                                stolen = true;
                                randomlyChosenForSteal = stealEvent.isRandomlyChosen;
                            }
                        }
                    }
                    picksIndex++;
                    pickPanels.push(React.createElement(DraftOptionPanel, {
                        active: isThisPanelActive,
                        highlighted: isThisPanelHighlighted,
                        turnNumber: i,
                        byOpponent: turn.player !== turn.executingPlayer,
                        draftOptionPanelType: DraftOptionPanelType.PICK,
                        draftOption: validDraftOptions.find(value => value.id === pickedOptionId),
                        isRandomlyChosen: randomlyChosen,
                        key: picksIndex,
                        sniped,
                        isRandomlyChosenForSnipe: randomlyChosenForSnipe,
                        stolen,
                        isRandomlyChosenForSteal: randomlyChosenForSteal,
                        flipped: this.props.flipped,
                        smooch: this.props.smooch,
                        side: this.props.player,
                    }));
                } else if (actionType === ActionType.STEAL) {
                    let pickedOptionId: string | undefined;
                    let randomlyChosen = false;
                    let sniped = false;
                    let randomlyChosenForSnipe = false;
                    let stolen = false;
                    let randomlyChosenForSteal = false;
                    if (this.state.picks.length > picksIndex) {
                        const pick = this.state.picks[picksIndex];
                        pickedOptionId = pick.chosenOptionId;
                        randomlyChosen = pick.isRandomlyChosen;
                        const snipeEvent = removeIfContains(snipes, pick);
                        if (snipeEvent) {
                            sniped = true;
                            randomlyChosenForSnipe = snipeEvent.isRandomlyChosen;
                        } else if (pickedOptionId !== DraftOption.HIDDEN_STEAL.id) {
                            const stealEvent = removeIfContains(steals, pick);
                            if (stealEvent) {
                                stolen = true;
                                randomlyChosenForSteal = stealEvent.isRandomlyChosen;
                            }
                        }
                    }
                    picksIndex++;
                    pickPanels.push(React.createElement(DraftOptionPanel, {
                        active: isThisPanelActive,
                        highlighted: isThisPanelHighlighted,
                        turnNumber: i,
                        byOpponent: turn.player !== turn.executingPlayer,
                        draftOptionPanelType: DraftOptionPanelType.STEAL,
                        draftOption: validDraftOptions.find(value => value.id === pickedOptionId),
                        isRandomlyChosen: randomlyChosen,
                        key: picksIndex,
                        sniped,
                        isRandomlyChosenForSnipe: randomlyChosenForSnipe,
                        stolen,
                        isRandomlyChosenForSteal: randomlyChosenForSteal,
                        flipped: this.props.flipped,
                        smooch: this.props.smooch,
                        side: this.props.player,
                    }));
                } else if (actionType === ActionType.BAN) {
                    let bannedOptionId: string | undefined;
                    let randomlyChosen = false;
                    if (this.state.bans.length > bansIndex) {
                        const ban = this.state.bans[bansIndex];
                        bannedOptionId = ban.chosenOptionId;
                        randomlyChosen = ban.isRandomlyChosen;
                    }
                    bansIndex++;
                    banPanels.push(React.createElement(DraftOptionPanel, {
                        active: isThisPanelActive,
                        highlighted: isThisPanelHighlighted,
                        turnNumber: i,
                        byOpponent: turn.player !== turn.executingPlayer,
                        draftOptionPanelType: DraftOptionPanelType.BAN,
                        draftOption: validDraftOptions.find(value => value.id === bannedOptionId),
                        isRandomlyChosen: randomlyChosen,
                        key: bansIndex,
                        flipped: this.props.flipped,
                        smooch: this.props.smooch,
                        side: this.props.player,
                    }));

                }
            }
        }

        const draftIsOngoing = this.isDraftOngoing();
        const playerClass = (draftIsOngoing && !hasActivePanel) ? 'player player-inactive' : 'player';

        return (
            <div id={playerId} className="column has-text-centered">
                <div className={playerClass + " box content is-inline-block"}>
                    <div className="is-uppercase has-text-grey is-size-7 pb-2 captains-line is-justify-content-center">
                        Admin
                    </div>
                    <div className="chosen">
                        {pickPanels.length > 0 && <>
                            {!this.props.simplifiedUI && <div className="is-uppercase has-text-grey is-size-7 pb-2 sub-heading"><Trans>Picks</Trans></div>}
                            <div className="picks is-justify-content-center">
                                {pickPanels}{this.props.simplifiedUI && banPanels.length > 0 && banPanels}
                            </div>
                        </>}
                        {!this.props.simplifiedUI && banPanels.length > 0 && <>
                            <div className="is-uppercase has-text-grey is-size-7 py-2 sub-heading"><Trans>Bans</Trans></div>
                            <div className="bans is-justify-content-center">
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

function removeIfContains(haystack: PlayerEvent[], needle: PlayerEvent): PlayerEvent | undefined {
    const index: number = haystack.findIndex((value: PlayerEvent) => {
        return value.chosenOptionId === needle.chosenOptionId
    });
    if (index > -1) {
        return haystack.splice(index, 1)[0];
    }
    return undefined;
}


function eventsToState(events: DraftEvent[] | undefined, player: ModelPlayer): IState {
    if (events === undefined) {
        return {bans: [], picks: [], snipes: [], steals: []};
    } else {
        events = events as DraftEvent[];
    }
    const playerEvents: PlayerEvent[] = events
        .filter(e => e.hasOwnProperty('actionType'))
        .map(e => e as PlayerEvent)
        .filter(e => e.player === player);
    const picks: PlayerEvent[] = [];
    const bans: PlayerEvent[] = [];
    for (const event of playerEvents) {
        switch (event.actionType) {
            case ActionType.PICK:
                picks.push(event);
                break;
            case ActionType.BAN:
                bans.push(event);
                break;
            case ActionType.STEAL:
                picks.push(event);
                break;
        }
    }
    const opponentEvents: PlayerEvent[] = events
        .filter(e => e.hasOwnProperty('actionType'))
        .map(e => e as PlayerEvent)
        .filter(e => e.player !== player);
    const snipes: PlayerEvent[] = [];
    const steals: PlayerEvent[] = [];
    for (const event of opponentEvents) {
        switch (event.actionType) {
            case ActionType.SNIPE:
                snipes.push(event);
                break;
            case ActionType.STEAL:
                steals.push(event);
                break;
        }
    }
    return {bans: bans, picks: picks, snipes: snipes, steals: steals};
}

export default withTranslation()(PlayerDraftState);
