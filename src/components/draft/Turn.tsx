import * as React from 'react';
import {default as ModelTurn} from '../../models/Turn'
import {WithTranslation, withTranslation} from "react-i18next";
import Player from "../../constants/Player";
import TurnTag from "./TurnTag";

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

        const player = turn.player.toString().toLowerCase();
        let action: string = turn.action.toString().toLowerCase();
        if (action.includes('reveal')) {
            action = 'reveal';
        }

        let turnClassName = `column is-1 turn turn-${player} turn-${action} has-text-centered`;
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
                <TurnTag turn={this.props.turn}/>
            </div>
        );
    }
}

export default withTranslation()(Turn);
