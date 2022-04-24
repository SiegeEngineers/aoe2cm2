import * as React from 'react';
import ActionType from "../../constants/ActionType";
import PlayerEvent from "../../models/PlayerEvent";
import Player from "../../constants/Player";
import DraftOptionPanelType from "../../constants/DraftOptionPanelType";
import {Util} from "../../util/Util";
import {WithTranslation, withTranslation} from "react-i18next";
import {Validator} from "../../models/Validator";
import {DraftsStore} from "../../models/DraftsStore";
import Draft from "../../models/Draft";
import {IDraftState} from "../../types";
import Preset from "../../models/Preset";
import DraftOption from "../../models/DraftOption";
import i18next from "i18next";

interface IProps extends WithTranslation {
    draftOption?: DraftOption;
    isRandomlyChosen?: boolean;
    active: boolean;
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
}

interface IState {
    used: string;
}

class DraftOptionPanel extends React.Component<IProps, IState> {

    USED_CLASSES = ['is-hidden', 'used-crown', 'used-skull', 'used-check'];

    constructor(props: IProps) {
        super(props);
        this.state = {used: this.USED_CLASSES[0]};
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
        let onClickAction = () => {
        };
        if (this.props.draftOptionPanelType === DraftOptionPanelType.CHOICE) {
            className += ' is-inline-block';
            if (this.isValidOption()) {
                onClickAction = this.onClickCiv;
                className += ' choice-' + this.props.triggerAction;
            } else if(this.props.displayOnly) {
                className += ' choice-display';
            } else {
                className += ' choice-disabled';
            }
        } else {
            if ((this.props.draftOptionPanelType === DraftOptionPanelType.PICK || this.props.draftOptionPanelType === DraftOptionPanelType.STEAL) && this.isDraftCompleted()) {
                onClickAction = () => {
                    this.setState({...this.state, used: this.nextUsed(this.state.used)});
                }
            }
            className += ' is-inline-block';
        }
        if (this.props.active) {
            className += " active-choice";
        } else if (draftOption !== undefined) {
            className += ' has-value';
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
        if (this.state.used !== this.USED_CLASSES[0]) {
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

        return (
            <div className={className} onClick={onClickAction}>
                <div className={'stretchy-background'}/>
                <div className={contentClass}>
                    <div className="stretchy-wrapper">
                        <div className={imageContainerClass}>
                            {image}
                        </div>
                        <div className={randomMarkerClass} title="Random"/>
                        <div className={stealMarkerClass}/>
                        <div className={stealRandomMarkerClass} title="Random Steal"/>
                        <div className={snipeMarkerClass}/>
                        <div className={snipeRandomMarkerClass} title="Random Snipe"/>
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

    private onClickCiv = () => {
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
            const player = this.props.player as Player;
            if (whoAmI === Player.NONE) {
                return false;
            }
            const draft = Draft.from(this.props.draft as Draft);
            const triggerAction = this.props.triggerAction as ActionType;
            if (![ActionType.PICK, ActionType.BAN, ActionType.SNIPE, ActionType.STEAL].includes(triggerAction)) {
                return false;
            }
            const draftOption = this.props.draftOption as DraftOption;
            let draftsStore = new DraftsStore(null);
            draftsStore.createDraft('draftId', draft);
            const errors = Validator.checkAllValidations('draftId', draftsStore, new PlayerEvent(player, triggerAction, draftOption.id, false, whoAmI));
            return errors.length === 0;
        }
        return false;
    }

    private isDraftCompleted(): boolean {
        if (this.props.draft === undefined || this.props.draft.preset === undefined) {
            return false;
        } else {
            const draft = this.props.draft;
            const preset = draft.preset as Preset;
            return this.props.nextAction >= preset.turns.length;
        }
    }

    private nextUsed(current: string) {
        const index = (this.USED_CLASSES.indexOf(current) + 1) % this.USED_CLASSES.length;
        return this.USED_CLASSES[index];
    }
}

export default withTranslation()(DraftOptionPanel);
