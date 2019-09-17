import * as React from 'react';
import {ComponentElement} from 'react';
import {default as ModelTurn} from "../models/Turn";
import Turn from "../containers/Turn";
import {Trans, WithTranslation, withTranslation} from "react-i18next";

interface IProps extends WithTranslation {
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
                        <div><Trans>Start</Trans></div>
                    </div>

                    {items}

                    <div className="pure-u-1-24 arrow-end">
                        <div><span><Trans>End</Trans></span></div>
                    </div>
                    <div className="pure-u-1-24" id="firefox-bug">&nbsp;</div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(TurnRow);
