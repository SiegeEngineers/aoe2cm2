import * as React from 'react';
import {ComponentElement} from 'react';
import {default as ModelTurn} from "../../models/Turn";
import Turn from "../../containers/Turn";
import {Trans, WithTranslation, withTranslation} from "react-i18next";

interface IProps extends WithTranslation {
    turns: ModelTurn[];
}

class TurnRow extends React.Component<IProps, object> {

    public render() {

        const items: Array<ComponentElement<any, any>> = [];

        let lastTurnWasParallel = false;
        for (let i = 0; i < this.props.turns.length; i++) {
            const turn = this.props.turns[i];
            items.push(React.createElement(Turn, {turn, turnNumber: i, key: i, lastTurnWasParallel}));
            lastTurnWasParallel = turn.parallel;
        }

        return (
            <div
                className="columns is-mobile is-centered is-multiline turn-row has-text-weight-bold is-uppercase py-4">
                <div className="column is-1 turn arrow-start has-text-right has-text-grey-light">
                    <Trans>Start</Trans>
                </div>
                {items}
                <div className="column is-1 turn arrow-end has-text-left color has-text-grey-light">
                    <Trans>End</Trans>
                </div>
            </div>
        );
    }
}

export default withTranslation()(TurnRow);
