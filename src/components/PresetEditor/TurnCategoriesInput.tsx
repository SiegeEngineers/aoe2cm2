import React from "react";
import {Action as ReducerAction, ISetEditorTurn, setEditorTurn} from "../../actions";
import Turn from "../../models/Turn";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import Preset from "../../models/Preset";
import {ApplicationState} from "../../types";
import {Trans} from "react-i18next";

interface Props {
    turn: Turn,
    preset: Preset | null,
    index: number,
    onValueChange: (turn: Turn, index: number) => ISetEditorTurn
}

class TurnCategoriesInput extends React.Component<Props, object> {
    private readonly delimiter = '|';

    render() {
        return <div key={'dafuq-' + this.props.index}>
            <div className="field is-horizontal">
                <div className="field-label is-small">
                    <label htmlFor={'categoryinput-' + this.props.index} className="label">
                        <Trans i18nKey="presetEditor.turnCategories">Categories</Trans>
                    </label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <p className="control">
                            <input className={'input is-small'} id={'categoryinput-' + this.props.index}
                                   value={this.props.turn.categories.join(this.delimiter)}
                                   onChange={(event) => {
                                       this.updateAllowedCategories(event.target.value);
                                   }} key={'categoryinput-' + this.props.index}/>
                        </p>
                    </div>
                    <div className="field">
                        <button className={'button is-small'} onClick={() => {
                            this.setAllCategoriesAsAllowed();
                        }}><Trans i18nKey="presetEditor.turnCategoriesAll">all</Trans></button>
                    </div>
                </div>
            </div>
        </div>
    }

    private updateAllowedCategories(value: string) {
        const t = this.props.turn;
        const newTurn = new Turn(t.player, t.action, t.exclusivity, t.hidden, t.parallel, t.executingPlayer, value.split(this.delimiter), t.id);
        this.props.onValueChange(newTurn, this.props.index);
    }

    private setAllCategoriesAsAllowed() {
        const categories = [...new Set(this.props.preset?.options.map(value => value.category))].sort();
        const t = this.props.turn;
        const newTurn = new Turn(t.player, t.action, t.exclusivity, t.hidden, t.parallel, t.executingPlayer, categories, t.id);
        this.props.onValueChange(newTurn, this.props.index);
    }
}

export function mapStateToProps(state: ApplicationState) {
    return {
        preset: state.presetEditor.editorPreset,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<ReducerAction>) {
    return {
        onValueChange: (turn: Turn, index: number) => dispatch(setEditorTurn(turn, index)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TurnCategoriesInput);
