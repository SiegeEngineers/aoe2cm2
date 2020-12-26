import * as React from 'react';
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import Countdown from "../../containers/Countdown";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import {DraftEvent} from "../../types/DraftEvent";
import Preset from "../../models/Preset";
import Turn from "../../models/Turn";
import {Util} from "../../util/Util";

interface IProps extends WithTranslation {
    whoAmI: Player | undefined,
    hostReady: boolean,
    guestReady: boolean,
    nameHost: string,
    nameGuest: string,
    preset: Preset | undefined,
    events: DraftEvent[],
    sendReady: () => void,
}

const PICK = <span className='has-text-success'><b>Pick</b></span>;

const BAN = <span className='has-text-danger'><b>Ban</b></span>;

const SNIPE = <span className='has-text-info'><b>Snipe</b></span>;

class Messages extends React.Component<IProps, object> {
    public render() {

        if (!this.props.hostReady || !this.props.guestReady) {
            return this.handleWaitingForPlayersToGetReady();
        }

        if (this.inParallelTurn()) {
            return this.handleParallelTurn();
        }

        return this.handleRegularCase();
    }

    private handleWaitingForPlayersToGetReady() {
        const readyButton = <button
            className='button is-link is-active is-uppercase is-valinged-middle'
            onClick={this.props.sendReady} style={{height: '2rem'}}>Ready</button>;

        if (this.props.whoAmI === Player.HOST) {
            if (this.props.hostReady) {
                return (
                    <div>
                        <Trans i18nKey='messages.waitingForGuestReady'>Waiting for Guest to press ›ready‹</Trans>
                    </div>
                );
            } else {
                if (this.props.guestReady) {
                    return (
                        <div>
                            <Trans i18nKey='messages.pressReadyGuestIsReady'>Your guest is ready to start. Press
                                {readyButton} once you are also ready to start!</Trans>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <Trans i18nKey='messages.pressReady'>Press {readyButton} once you are ready to
                                start!</Trans>
                        </div>
                    );
                }
            }
        } else if (this.props.whoAmI === Player.GUEST) {
            if (this.props.guestReady) {
                return (
                    <div>
                        <Trans i18nKey='messages.waitingForHostReady'>Waiting for Host to press ›ready‹</Trans>
                    </div>
                );
            } else {
                if (this.props.hostReady) {
                    return (
                        <div>
                            <Trans i18nKey='messages.pressReadyHostIsReady'>Your host is ready to start.
                                Press {readyButton} once you are also ready to start!</Trans>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <Trans i18nKey='messages.pressReady'>Press {readyButton} once you are ready to
                                start!</Trans>
                        </div>
                    );
                }
            }
        } else {
            if (!this.props.hostReady && !this.props.guestReady) {
                return (
                    <div>
                        <Trans i18nKey='messages.waitingForBothToBeReady'>Waiting for players to get ready...</Trans>
                    </div>
                );
            } else if (!this.props.hostReady) {
                return (
                    <div>
                        <Trans i18nKey='messages.waitingForHostToBeReady'>Waiting for Host to get ready...</Trans>
                    </div>
                );
            } else {
                return (
                    <div>
                        <Trans i18nKey='messages.waitingForGuestToBeReady'>Waiting for Guest to get ready...</Trans>
                    </div>
                );
            }
        }
    }

    private handleRegularCase() {
        const nextTurn = this.getNextTurn();
        if (nextTurn !== null) {
            return this.messageForTurn(nextTurn);
        } else {
            return (
                <div><Trans i18nKey='messages.finished'>Finished.</Trans></div>
            );
        }
    }

    private getPlayerName(nextTurn: Turn) {
        if (nextTurn.executingPlayer === Player.HOST) {
            return this.props.nameHost;
        } else if (nextTurn.executingPlayer === Player.GUEST) {
            return this.props.nameGuest;
        }
        return '';
    }

    private handleParallelTurn() {
        const firstTurn = this.getFirstTurnOfParallelTurn() as Turn;
        const secondTurn = this.getSecondTurnOfParallelTurn() as Turn;
        const nextTurn = this.getNextTurn() as Turn;
        if (this.props.whoAmI === Player.NONE) {
            if (nextTurn.parallel) {
                return this.messageForTurns(firstTurn, secondTurn);
            } else {
                const lastEvent = this.props.events[this.props.events.length - 1];
                if (Util.isPlayerEvent(lastEvent) && lastEvent.executingPlayer === firstTurn.executingPlayer) {
                    return this.messageForTurn(secondTurn);
                } else {
                    return this.messageForTurn(firstTurn);
                }
            }
        } else {
            if (nextTurn.parallel) {
                if (firstTurn.executingPlayer === this.props.whoAmI) {
                    return this.messageForTurn(firstTurn);
                } else {
                    return this.messageForTurn(secondTurn);
                }
            } else {
                const lastEvent = this.props.events[this.props.events.length - 1];
                if (Util.isPlayerEvent(lastEvent) && lastEvent.executingPlayer === firstTurn.executingPlayer) {
                    return this.messageForTurn(secondTurn);
                } else {
                    return this.messageForTurn(firstTurn);
                }
            }
        }
    }

    private getNextTurn() {
        if (this.props.preset === undefined) {
            return null;
        }
        const index = this.props.events.length;
        if (index < this.props.preset.turns.length) {
            return this.props.preset.turns[index];
        }
        return null;
    }

    private getTurnAfterNextTurn() {
        if (this.props.preset === undefined) {
            return null;
        }
        const index = this.props.events.length + 1;
        if (index < this.props.preset.turns.length) {
            return this.props.preset.turns[index];
        }
        return null;
    }

    private getPreviousTurn() {
        if (this.props.preset === undefined) {
            return null;
        }
        const index = this.props.events.length - 1;
        if (index >= 0) {
            return this.props.preset.turns[index];
        }
        return null;
    }

    private getFirstTurnOfParallelTurn() {
        const nextTurn = this.getNextTurn() as Turn;
        if (nextTurn.parallel) {
            return nextTurn as Turn;
        } else {
            return this.getPreviousTurn() as Turn;
        }
    }

    private getSecondTurnOfParallelTurn() {
        const nextTurn = this.getNextTurn() as Turn;
        if (nextTurn.parallel) {
            return this.getTurnAfterNextTurn() as Turn;
        } else {
            return this.getNextTurn() as Turn;
        }
    }

    private inParallelTurn() {
        const nextTurn = this.getNextTurn();
        const previousTurn = this.getPreviousTurn();
        if (nextTurn !== null && previousTurn !== null) {
            return nextTurn.parallel || previousTurn.parallel;
        }
        if (nextTurn !== null) {
            return nextTurn.parallel;
        }
        if (previousTurn !== null) {
            return previousTurn.parallel;
        }
        return false;
    }

    private messageForTurn(turn: Turn) {
        if (turn.player === Player.NONE) {
            const action = turn.action.toString();
            return (
                <div>
                    <Trans i18nKey='messages.adminAction'>Admin action:&nbsp;
                        <span className="tag is-dark is-medium is-valinged-middle is-family-monospace">{action}</span>
                    </Trans>
                </div>
            );
        } else if (turn.executingPlayer === this.props.whoAmI) {
            switch (turn.action) {
                case Action.PICK:
                    return (
                        <div><Trans i18nKey='messages.doPick'>{PICK} a
                            civilization!</Trans>
                            <Countdown/></div>
                    );
                case Action.BAN:
                    return (
                        <div><Trans i18nKey='messages.doBan'>{BAN} a
                            civilization!</Trans>
                            <Countdown/></div>
                    );
                case Action.SNIPE:
                    return (
                        <div><Trans i18nKey='messages.doSnipe'>{SNIPE} a
                            civilization of the
                            opponent!</Trans> <Countdown/></div>
                    );
            }
        } else {
            if (this.props.whoAmI === Player.NONE) {
                const playerName = this.getPlayerName(turn);
                switch (turn.action) {
                    case Action.PICK:
                        return (
                            <div><Trans i18nKey='messages.specPick'>Waiting
                                for <b>{{playerName}}</b> to {PICK} a civilization</Trans>
                                <Countdown/></div>
                        );
                    case Action.BAN:
                        return (
                            <div><Trans i18nKey='messages.specBan'>Waiting
                                for <b>{{playerName}}</b> to {BAN} a civilization</Trans>
                                <Countdown/></div>
                        );
                    case Action.SNIPE:
                        return (
                            <div><Trans i18nKey='messages.specSnipe'>Waiting
                                for <b>{{playerName}}</b> to {SNIPE} a
                                civilization of the opponent</Trans> <Countdown/></div>
                        );
                }
            } else {
                switch (turn.action) {
                    case Action.PICK:
                        return (
                            <div><Trans i18nKey='messages.waitingForPick'>Waiting for the other captain to
                                pick…</Trans>
                                <Countdown/></div>
                        );
                    case Action.BAN:
                        return (
                            <div><Trans i18nKey='messages.waitingForBan'>Waiting for the other captain to
                                ban…</Trans>
                                <Countdown/></div>
                        );
                    case Action.SNIPE:
                        return (
                            <div><Trans i18nKey='messages.waitingForSnipe'>Waiting for the other captain to snipe
                                one of your civilisations…</Trans>
                                <Countdown/></div>
                        );
                }
            }
        }

        const message = turn.executingPlayer.toString() + ': ' + turn.action.toString();
        return (
            <div><Trans i18nKey='messages.genericTurnMessage'>{message}</Trans></div>
        );
    }

    private messageForTurns(firstTurn: Turn, secondTurn: Turn) {
        const firstTurnPlayer = this.getPlayerName(firstTurn);
        const secondTurnPlayer = this.getPlayerName(secondTurn);
        if (firstTurn.action === Action.PICK) {
            if (secondTurn.action === Action.PICK) {
                return (
                    <div><Trans i18nKey='messages.specParallelTurnsPickPick'>Waiting
                        for <b>{{firstTurnPlayer}}</b> to {PICK} and
                        for <b>{{secondTurnPlayer}}</b> to {PICK} a civilisation</Trans>
                        <Countdown/></div>
                );
            } else if (secondTurn.action === Action.BAN) {
                return (
                    <div><Trans i18nKey='messages.specParallelTurnsPickBan'>Waiting
                        for <b>{{firstTurnPlayer}}</b> to {PICK} and
                        for <b>{{secondTurnPlayer}}</b> to {BAN} a civilisation</Trans>
                        <Countdown/></div>
                );
            } else if (secondTurn.action === Action.SNIPE) {
                return (
                    <div><Trans i18nKey='messages.specParallelTurnsPickSnipe'>Waiting
                        for <b>{{firstTurnPlayer}}</b> to {PICK} and
                        for <b>{{secondTurnPlayer}}</b> to {SNIPE} a civilisation</Trans>
                        <Countdown/></div>
                );
            }
        }
        if (firstTurn.action === Action.BAN) {
            if (secondTurn.action === Action.PICK) {
                return (
                    <div><Trans i18nKey='messages.specParallelTurnsBanPick'>Waiting
                        for <b>{{firstTurnPlayer}}</b> to {BAN} and
                        for <b>{{secondTurnPlayer}}</b> to {PICK} a civilisation</Trans>
                        <Countdown/></div>
                );
            } else if (secondTurn.action === Action.BAN) {
                return (
                    <div><Trans i18nKey='messages.specParallelTurnsBanBan'>Waiting
                        for <b>{{firstTurnPlayer}}</b> to {BAN} and
                        for <b>{{secondTurnPlayer}}</b> to {BAN} a civilisation</Trans>
                        <Countdown/></div>
                );
            } else if (secondTurn.action === Action.SNIPE) {
                return (
                    <div><Trans i18nKey='messages.specParallelTurnsBanSnipe'>Waiting
                        for <b>{{firstTurnPlayer}}</b> to {BAN} and
                        for <b>{{secondTurnPlayer}}</b> to {SNIPE} a civilisation</Trans>
                        <Countdown/></div>
                );
            }
        }
        if (firstTurn.action === Action.SNIPE) {
            if (secondTurn.action === Action.PICK) {
                return (
                    <div><Trans i18nKey='messages.specParallelTurnsSnipePick'>Waiting
                        for <b>{{firstTurnPlayer}}</b> to {SNIPE} and
                        for <b>{{secondTurnPlayer}}</b> to {PICK} a civilisation</Trans>
                        <Countdown/></div>
                );
            } else if (secondTurn.action === Action.BAN) {
                return (
                    <div><Trans i18nKey='messages.specParallelTurnsSnipeBan'>Waiting
                        for <b>{{firstTurnPlayer}}</b> to {SNIPE} and
                        for <b>{{secondTurnPlayer}}</b> to {BAN} a civilisation</Trans>
                        <Countdown/></div>
                );
            } else if (secondTurn.action === Action.SNIPE) {
                return (
                    <div><Trans i18nKey='messages.specParallelTurnsSnipeSnipe'>Waiting
                        for <b>{{firstTurnPlayer}}</b> to {SNIPE} and
                        for <b>{{secondTurnPlayer}}</b> to {SNIPE} a civilisation</Trans>
                        <Countdown/></div>
                );
            }
        }
        return null;
    }
}

export default withTranslation()(Messages);
