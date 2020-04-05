import * as React from 'react';
import {default as ModelTurn} from '../../models/Turn'
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import Player from "../../constants/Player";
import Exclusivity from "../../constants/Exclusivity";

interface IProps extends WithTranslation {
    turn: ModelTurn;
    turnNumber: number;
    nextAction?: number;
    lastTurnWasParallel: boolean;
}

interface IState {
    active: boolean;
}

const toTitle = (turn: ModelTurn): string => {
    if (turn.player === Player.NONE) {
        return turn.action.toString();
    }
    return `${turn.player}: ${turn.action} (${turn.exclusivity})`;
};

class Turn extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            active: props.nextAction ? props.nextAction === props.turnNumber : 0 === props.turnNumber
        };
    }

    public componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
        const active = nextProps.nextAction ? nextProps.nextAction === nextProps.turnNumber : 0 === nextProps.turnNumber;
        this.setState({...this.state, active});
    }

    public render() {
        const turn: ModelTurn = this.props.turn;

        let prefix: string = '';
        if (turn.player !== Player.NONE) {
            if (turn.exclusivity === Exclusivity.GLOBAL) {
                prefix = 'g';
            } else if (turn.exclusivity === Exclusivity.NONEXCLUSIVE) {
                prefix = 'n';
            }
        }

        const player = turn.player.toString().toLowerCase();
        let action: string = turn.action.toString().toLowerCase();
        if (action.includes('reveal')) {
            action = 'reveal';
        }
        let turnClassName = `pure-u-1-24 turn turn-${player} turn-${action}`;
        if (turn.parallel || this.props.lastTurnWasParallel) {
            turnClassName += ' turn-parallel';
        }
        if (turn.hidden) {
            turnClassName += ' turn-hidden';
        }
        if (this.state.active) {
            turnClassName += ' active';
        }
        return (
            <div title={toTitle(turn)} className={turnClassName}>
                <div className='bar'/>
                <span><Trans><b>{prefix}</b>{action}</Trans></span>
            </div>
        );
    }
}

export default withTranslation()(Turn);
