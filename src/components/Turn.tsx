import * as React from 'react';
import {default as ModelTurn} from '../models/Turn'
import '../pure-min.css'
import '../style2.css'
import {Trans, WithTranslation, withTranslation} from "react-i18next";

interface IProps extends WithTranslation {
    turn: ModelTurn;
    turnNumber: number;
    nextAction?: number;
}

interface IState {
    active: boolean;
}

class Turn extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            active: props.nextAction ? props.nextAction === props.turnNumber : 0 === props.turnNumber
        };
    }

    public componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
        const active = nextProps.nextAction ? nextProps.nextAction === nextProps.turnNumber : false;
        this.setState({...this.state, active});
    }

    public render() {
        const turn: ModelTurn = this.props.turn;

        let prefix: string = '';
        if (turn.action.toString().includes('GLOBAL')) {
            prefix = 'g';
        } else if (turn.action.toString().includes('EXCLUSIVE')) {
            prefix = 'x';
        }

        let action: string = '?';
        for (const a of ['PICK', 'BAN', 'SNIPE', 'REVEAL']) {
            if (turn.action.toString().includes(a)) {
                action = a;
            }
        }

        let actionId: number = -1;
        if (action === 'PICK') {
            actionId = 0;
        }
        if (action === 'BAN' || action === 'SNIPE') {
            actionId = 1;
        }
        let turnClassName = 'turn-' + turn.player.toString().toLowerCase() + ' turn-do-' + actionId + ' turn-global';
        if (turn.action.includes('HIDDEN')) {
            turnClassName += ' turn-hidden';
        }
        let activeClass = '';
        if (this.state.active) {
            activeClass = 'active';
        }
        return (
            <div className="pure-u-1-24 turn">
                <div className={turnClassName}>
                    <span className={activeClass}><Trans><b>{prefix}</b>{action}</Trans></span>
                </div>
            </div>
        );
    }
}

export default withTranslation()(Turn);
