import * as React from 'react';
import ActionType, {actionTypeFromAction} from "../../constants/ActionType";
import PlayerEvent from "../../models/PlayerEvent";
import Player from "../../constants/Player";
import DraftOptionPanelType from "../../constants/DraftOptionPanelType";
import {Util} from "../../util/Util";
import {WithTranslation, withTranslation} from "react-i18next";
import {Validator} from "../../models/Validator";
import {DraftsStore} from "../../models/DraftsStore";
import Draft from "../../models/Draft";
import {IDraftState} from "../../types";
import DraftOption from "../../models/DraftOption";
import i18next from "i18next";
import {ISetHighlightedAction} from "../../actions";
import Marker from "./Marker";

interface IProps extends WithTranslation {
    draftOption?: DraftOption;
    isRandomlyChosen?: boolean;
    active: boolean;
    highlighted: boolean;
    turnNumber?: number;
    sniped?: boolean;
    isRandomlyChosenForSnipe?: boolean;
    stolen?: boolean;
    isRandomlyChosenForSteal?: boolean;
    draftOptionPanelType: DraftOptionPanelType;
    whoAmI?: Player;
    triggerAction?: ActionType;
    byOpponent?: boolean;
    player?: Player;
    draft?: IDraftState;
    nextAction: number;
    iconStyle: string;
    flipped?: boolean;
    smooch?: boolean;
    side?: Player;
    displayOnly?: boolean;

    onClickCivilisation?: (playerEvent: PlayerEvent, callback: any) => void;
    onHighlightedActionChanged?: (value: number | null) => ISetHighlightedAction;
}

interface IState {
    used: string;
    counter: number;
}

class DraftOptionPanel extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {used: 'is-hidden', counter: 0};
    }

    public render() {
        const draftOption: DraftOption | undefined = this.props.draftOption;
        let image = <></>;
        let imageSrc: string = "";
        let draftOptionKey = '';
        let draftOptionName = '';
        let textClass: string = 'stretchy-text';
        let imageContainerClass: string = 'stretchy-image civ-indicator';
        if (draftOption !== undefined) {
            draftOptionName = draftOption.name;
            imageSrc = draftOption.imageUrls.unit;
            image = <img src={imageSrc} alt={draftOptionName}/>;
            if (this.props.iconStyle === 'emblems') {
                imageSrc = draftOption.imageUrls.emblem;
                image = <img src={imageSrc} alt={draftOptionName}/>;
            }
            if (this.props.iconStyle === 'units-animated' && !Util.isTechnicalDraftOption(draftOption)) {
                let imageSrc = draftOption.imageUrls.animated_right;
                let imageKey = 'animated-right';
                if (this.useFlippedImage()) {
                    imageSrc = draftOption.imageUrls.animated_left;
                    imageKey = 'animated-left';
                }
                image = <img className={'directional'} src={imageSrc} alt={draftOptionName} key={imageKey}/>;
            }
            draftOptionKey = 'civs.' + draftOptionName;
            if (Util.isTechnicalDraftOption(draftOption)) {
                textClass += ' is-hidden';
            }
        }
        let className: string = 'civ-panel ' + this.props.draftOptionPanelType.toString();
        if (this.props.byOpponent) {
            className += ' by-opponent';
        }
        let onClickAction = (e: React.MouseEvent<HTMLDivElement>) => {
        };
        if (this.props.draftOptionPanelType === DraftOptionPanelType.CHOICE) {
            className += ' is-inline-block';
            if (this.isValidOption()) {
                onClickAction = this.onClickCiv;
                className += ' choice-' + this.props.triggerAction;
            } else if (this.props.displayOnly) {
                className += ' choice-display';
            } else {
                className += ' choice-disabled';
            }
            if (this.isValidOptionFor(Player.HOST)) {
                className += ' choice-host';
            }
            if (this.isValidOptionFor(Player.GUEST)) {
                className += ' choice-guest';
            }
        } else {
            className += ' is-inline-block';
        }
        if (this.props.active) {
            className += " active-choice";
        } else if (draftOption !== undefined) {
            className += ' has-value';
        }
        if (this.props.highlighted) {
            className += " highlighted";
        }
        let contentClass: string = "box-content element-stack";
        if (this.props.draftOption !== undefined) {
            contentClass += " is-visible";
        }
        let snipeMarkerClass = "stretchy-image snipe-marker";
        if (this.props.sniped) {
            className += ' is-sniped';
        } else {
            snipeMarkerClass += ' is-hidden';
        }
        let stealMarkerClass = "stretchy-image steal-marker";
        if (this.props.stolen) {
            className += ' is-stolen';
        } else {
            stealMarkerClass += ' is-hidden';
        }
        let usedMarkerClass = "stretchy-image used-marker " + this.state.used;
        if (this.state.used !== 'is-hidden') {
            className += ' is-used';
        }
        let randomMarkerClass = "random-pick";
        if (!this.props.draftOption || !this.props.isRandomlyChosen) {
            randomMarkerClass += ' is-hidden';
        }
        let snipeRandomMarkerClass = "random-snipe";
        if (!this.props.sniped || !this.props.isRandomlyChosenForSnipe) {
            snipeRandomMarkerClass += ' is-hidden';
        }
        let stealRandomMarkerClass = "random-steal";
        if (!this.props.stolen || !this.props.isRandomlyChosenForSteal) {
            stealRandomMarkerClass += ' is-hidden';
        }

        if (this.props.iconStyle === 'units-animated') {
            randomMarkerClass += ' animated';
            stealRandomMarkerClass += ' animated';
            snipeRandomMarkerClass += ' animated';
        }
        const onMouseEnter = () => {
            if ((this.props.onHighlightedActionChanged !== undefined) && (this.props.turnNumber !== undefined)) {
                this.props.onHighlightedActionChanged(this.props.turnNumber);
            }
        }
        const onMouseLeave = () => {
            if ((this.props.onHighlightedActionChanged !== undefined)) {
                this.props.onHighlightedActionChanged(null);
            }
        }

        let markerSelection = null;
        if (this.props.draftOptionPanelType === DraftOptionPanelType.PICK || this.props.draftOptionPanelType === DraftOptionPanelType.STEAL) {
            markerSelection = <div className="marker-selection">
                <div className="columns has-background-white-bis">
                    <div className="column select-crown-icon" onClick={() => this.toggleMarker('used-crown')}>
                    </div>
                    <div className="column select-skull-icon" onClick={() => this.toggleMarker('used-skull')}>
                    </div>
                    <div className="column select-check-icon" onClick={() => this.toggleMarker('used-check')}>
                    </div>
                    <div className="column dropdown is-up is-right is-hoverable">
                        <div className="dropdown-trigger has-text-centered">
                            {this.state.counter}
                        </div>
                        <div className="dropdown-menu">
                            <div className="dropdown-content">
                                <div className="is-flex is-flex-direction-column">
                                    <div className="is-flex is-flex-direction-row">
                                        <Marker number={0} onClick={() => this.setState({counter: 0})}/>
                                        <Marker number={1} onClick={() => this.setState({counter: 1})}/>
                                        <Marker number={2} onClick={() => this.setState({counter: 2})}/>
                                        <Marker number={3} onClick={() => this.setState({counter: 3})}/>
                                        <Marker number={4} onClick={() => this.setState({counter: 4})}/>
                                    </div>
                                    <div className="is-flex is-flex-direction-row">
                                        <Marker number={5} onClick={() => this.setState({counter: 5})}/>
                                        <Marker number={6} onClick={() => this.setState({counter: 6})}/>
                                        <Marker number={7} onClick={() => this.setState({counter: 7})}/>
                                        <Marker number={8} onClick={() => this.setState({counter: 8})}/>
                                        <Marker number={9} onClick={() => this.setState({counter: 9})}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>;
        }

        return (
            <div className={className} onClick={onClickAction}
                 onMouseEnter={onMouseEnter}
                 onMouseLeave={onMouseLeave}
            >
                <div className={'stretchy-background'}/>
                <div className={contentClass}>
                    {markerSelection}
                    <div className="stretchy-wrapper">
                        <div className={imageContainerClass}>
                            {image}
                        </div>
                        <div className={randomMarkerClass} title="Random"/>
                        <div className={stealMarkerClass}/>
                        <div className={stealRandomMarkerClass} title="Random Steal"/>
                        <div className={snipeMarkerClass}/>
                        <div className={snipeRandomMarkerClass} title="Random Snipe"/>
                        <div className="stretchy-image counter">
                            {this.state.counter > 0 ? <Marker number={this.state.counter}/> : ''}
                        </div>
                        <div className={usedMarkerClass}/>
                        <div className={textClass}>
                            {i18next.t([draftOptionKey, draftOptionName])}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private useFlippedImage() {
        return this.props.smooch
            && ((this.props.side === Player.HOST && !this.props.flipped)
                || (this.props.side === Player.GUEST && this.props.flipped));
    }

    private onClickCiv = (e: React.MouseEvent<HTMLDivElement>) => {
        if (Util.notUndefined(this.props.onClickCivilisation, this.props.draftOption, this.props.whoAmI, this.props.player, this.props.triggerAction)) {
            const whoAmI = this.props.whoAmI as Player;
            const player = this.props.player as Player;
            if (whoAmI === Player.NONE) {
                return;
            }
            const draftOption = this.props.draftOption as DraftOption;
            const triggerAction = this.props.triggerAction as ActionType;
            const onClickCivilisation = this.props.onClickCivilisation as (playerEvent: PlayerEvent, callback: any) => void;
            onClickCivilisation(new PlayerEvent(player, triggerAction, draftOption.id, false, whoAmI), (data: any) => {
                console.log('act callback', data);
                if (data.status !== 'ok') {
                    alert(Util.buildValidationErrorMessage(data));
                }
            });
        }
    };


    private isValidOption() {
        if (Util.notUndefined(this.props.draft, this.props.whoAmI, this.props.triggerAction, this.props.player, this.props.draftOption)) {
            const whoAmI = this.props.whoAmI as Player;
            if (whoAmI === Player.NONE) {
                return false;
            }
            const triggerAction = this.props.triggerAction as ActionType;
            if (![ActionType.PICK, ActionType.BAN, ActionType.SNIPE, ActionType.STEAL].includes(triggerAction)) {
                return false;
            }
            return this.isValidOptionFor(whoAmI);
        }
        return false;
    }

    private isValidOptionFor(executingPlayer: Player) {
        if (Util.notUndefined(this.props.draft, this.props.draftOption)) {
            const draft = Draft.from(this.props.draft as Draft);
            const draftOption = this.props.draftOption as DraftOption;
            let draftsStore = new DraftsStore(null);
            draftsStore.createDraft('draftId', draft);


            let triggerAction: ActionType = ActionType.NOTHING;
            const index = this.props.nextAction;
            let player = executingPlayer;
            if (draft.preset && index < draft.preset.turns.length) {

                let turn = draft.preset.turns[index];
                if (turn.executingPlayer !== executingPlayer) {
                    if (turn.parallel && (index + 1) < draft.preset.turns.length) {
                        turn = draft.preset.turns[index + 1];
                    } else if((index - 1) >= 0 && draft.preset.turns[index - 1].parallel) {
                        turn = draft.preset.turns[index - 1];
                    }
                }
                if (turn.executingPlayer === executingPlayer) {
                    triggerAction = actionTypeFromAction(turn.action);
                    player = turn.player;
                } else {
                    return false;
                }


                const errors = Validator.checkAllValidations('draftId', draftsStore, new PlayerEvent(player, triggerAction, draftOption.id, false, executingPlayer));
                if (errors.length === 0) {
                    return true;
                }
            }
        }
        return false;
    }

    private toggleMarker(marker: string) {
        if (this.state.used === marker) {
            this.setState({used: 'is-hidden'});
        } else {
            this.setState({used: marker});
        }
    }
}

export default withTranslation()(DraftOptionPanel);
