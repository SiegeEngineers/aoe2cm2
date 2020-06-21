import * as React from 'react';
import {default as ModelTurn} from '../../models/Turn'
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import Player from "../../constants/Player";
import Exclusivity from "../../constants/Exclusivity";
import Action from "../../constants/Action";

interface IProps extends WithTranslation {
    turn: ModelTurn;
}

class TurnTag extends React.Component<IProps> {

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

        let action: string = turn.action.toString().toLowerCase();
        if (action.includes('reveal')) {
            action = 'reveal';
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
                tagClassName += ' has-background-grey-lighter';
                break;
        }
        let tagPrefixClassName = tagClassName + ' is-dark';
        let prefixTag: React.ReactElement = <span/>;
        tagClassName += ' is-light'
        let tagGroupClassName = 'is-uppercase has-text-weight-bold tags';
        if (prefix) {
            prefixTag = <span className={tagPrefixClassName}>{prefix}</span>
            tagGroupClassName += ' has-addons'
        }

        return (
            <span className={tagGroupClassName}>
                <Trans>{prefixTag}<span className={tagClassName}>{action}</span></Trans>
            </span>
        );
    }
}

export default withTranslation()(TurnTag);
