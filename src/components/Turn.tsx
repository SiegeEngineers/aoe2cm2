import * as React from 'react';
import {default as ModelTurn} from '../models/Turn'
import '../pure-min.css'
import '../style2.css'

interface ITurn {
    turn: ModelTurn;
}

class Turn extends React.Component<ITurn, object> {
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
        return (
            <div className="pure-u-1-24 turn">
                <div className={turnClassName}>
                    <span><b>{prefix}</b>{action}</span>
                </div>
            </div>
        );
    }
}

export default Turn;
