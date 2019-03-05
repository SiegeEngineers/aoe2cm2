import * as React from 'react';
import {ComponentElement} from 'react';
import {default as ModelTurn} from "../models/Turn";
import '../pure-min.css'
import '../style2.css'
import Turn from "./Turn";

interface IProps {
    turns: ModelTurn[];
}

class TurnRow extends React.Component<IProps, object> {

    public render() {

        const items: Array<ComponentElement<any, any>> = [];

        for (let i = 0; i < this.props.turns.length; i++) {
            const turn = this.props.turns[i];
            items.push(React.createElement(Turn, {turn, turnNumber: i}));
        }

        return (
            <div className="turn-row">
                <div className="pure-g">
                    <div className="pure-u-1-24 arrow-start">
                        <div>Start</div>
                    </div>

                    {items}

                    <div className="pure-u-1-24 arrow-end">
                        <div><span>End</span></div>
                    </div>
                    <div className="pure-u-1-24" id="firefox-bug">&nbsp;</div>
                </div>
            </div>
        );
    }
}

export default TurnRow;
