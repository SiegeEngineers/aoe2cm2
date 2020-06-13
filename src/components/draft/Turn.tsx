import * as React from 'react';
import {default as ModelTurn} from '../../models/Turn'
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import Player from "../../constants/Player";
import Exclusivity from "../../constants/Exclusivity";
import Action from "../../constants/Action";

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
        if (turn.player !== Player.NONE && turn.action !== Action.SNIPE) {
            if (turn.exclusivity === Exclusivity.GLOBAL) {
                prefix = 'g';
            } else if (turn.exclusivity === Exclusivity.NONEXCLUSIVE) {
                prefix = 'n';
            } else if (turn.exclusivity === Exclusivity.EXCLUSIVE) {
                prefix = 'e';
            }
        }

        const player = turn.player.toString().toLowerCase();
        let action: string = turn.action.toString().toLowerCase();
        if (action.includes('reveal')) {
            action = 'reveal';
        }

        let turnClassName = `column is-1 turn turn-${player} turn-${action}`;
        if (turn.parallel || this.props.lastTurnWasParallel) {
            turnClassName += ' turn-parallel';
        }
        if (turn.hidden) {
            turnClassName += ' turn-hidden';
        }
        if (this.state.active) {
            turnClassName += ' active';
        }

        let tagClassName = 'tag';
        switch (turn.action) {
            case Action.PICK:
                tagClassName += ' is-success';
                break;
            case Action.BAN:
                tagClassName += ' is-danger';
                break;
            case Action.SNIPE:
                tagClassName += ' is-link';
                break;
            case Action.REVEAL_ALL:
            case Action.REVEAL_BANS:
            case Action.REVEAL_PICKS:
            case Action.REVEAL_SNIPES:
                tagClassName += ' is-light';
                break;
        }
        let tagPrefixClassName = tagClassName + ' is-dark';
        let prefixTag: React.ReactElement = <span/>;
        tagClassName += ' is-light'
        let tagGroupClassName = 'tags';
        if (prefix) {
            prefixTag = <span className={tagPrefixClassName}>{prefix}</span>
            tagGroupClassName += ' has-addons'
        } else {

        }

        return (
            <div title={toTitle(turn)} className={turnClassName}>
                <div className='bar'/>
                <div className={tagGroupClassName}>
                    <Trans>{prefixTag}<span className={tagClassName}>{action}</span></Trans>
                </div>
            </div>
        );
    }
}

export default withTranslation()(Turn);
