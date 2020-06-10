import * as React from 'react';
import ActionType from "../../constants/ActionType";
import Civilisation from "../../models/Civilisation";
import PlayerEvent from "../../models/PlayerEvent";
import Player from "../../constants/Player";
import CivPanelType from "../../constants/CivPanelType";
import {Util} from "../../util/Util";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import {Validator} from "../../models/Validator";
import {DraftsStore} from "../../models/DraftsStore";
import Draft from "../../models/Draft";
import {IDraftState} from "../../types";
import Preset from "../../models/Preset";

interface IProps extends WithTranslation {
    civilisation?: Civilisation;
    active: boolean;
    sniped?: Civilisation;
    civPanelType: CivPanelType;
    whoAmI?: Player;
    triggerAction?: ActionType;
    draft?: IDraftState;
    nextAction: number;
    iconStyle: string;

    onClickCivilisation?: (playerEvent: PlayerEvent, callback: any) => void;
}

interface IState {
    used: boolean;
}

class CivPanel extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {used: false};
    }

    public render() {
        const civilisation: Civilisation | undefined = this.props.civilisation;
        let imageSrc: string = "";
        let civilisationKey = '';
        let civilisationName = '';
        let textClass: string = 'stretchy-text';
        if (civilisation !== undefined) {
            civilisationName = civilisation.name;
            imageSrc = "/images/civs/" + civilisationName.toLocaleLowerCase() + "-DE.png";
            if (this.props.iconStyle === 'emblems') {
                imageSrc = "/images/civemblems/" + civilisationName.toLocaleLowerCase() + ".png";
            }
            civilisationKey = 'civs.' + civilisationName;
            if (Util.isTechnicalCivilisation(civilisation)) {
                textClass += ' is-hidden';
            }
        }
        let className: string = this.props.civPanelType.toString();
        let onClickAction = () => {};
        if (this.props.civPanelType === CivPanelType.CHOICE) {
            className += ' is-inline-block';
            if (this.isValidOption()) {
                onClickAction = this.onClickCiv;
                className += ' choice-' + this.props.triggerAction;
            } else {
                className += ' choice-disabled';
            }
        } else {
            if (this.props.civPanelType === CivPanelType.PICK && this.isDraftCompleted()) {
                onClickAction = () => {
                    this.setState({...this.state, used: !this.state.used});
                }
            }
            className += ' is-inline-block';
        }
        if(this.props.active){
            className += " active-choice";
        } else if (civilisation !== undefined) {
            className += ' has-value';
        }
        let contentClass: string = "box-content";
        if (this.props.civilisation !== undefined) {
            contentClass += " is-visible";
        }
        let snipeMarkerClass = "stretchy-image snipe-marker";
        if (!this.props.sniped) {
            snipeMarkerClass += ' is-hidden';
        }
        let usedMarkerClass = "stretchy-image used-marker";
        if (!this.state.used) {
            usedMarkerClass += ' is-hidden';
        }
        let randomMarkerClass = "random-pick";
        if (!this.props.civilisation || !this.props.civilisation.isRandomlyChosenCiv) {
            randomMarkerClass += ' is-hidden';
        }
        let snipeRandomMarkerClass = "random-snipe";
        if (!this.props.sniped || !this.props.sniped.isRandomlyChosenCiv) {
            snipeRandomMarkerClass += ' is-hidden';
        }
        return (
            <div className={className} onClick={onClickAction}>
                <div className={contentClass}>
                    <div className="stretchy-wrapper">
                        <div className="stretchy-image">
                            <img src={imageSrc} alt={civilisationName}/>
                        </div>
                        <div className={randomMarkerClass}/>
                        <div className={snipeMarkerClass}/>
                        <div className={snipeRandomMarkerClass}/>
                        <div className={usedMarkerClass}/>
                        <div className={textClass}>
                            <Trans>{civilisationKey}</Trans>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private onClickCiv = () => {
        if (Util.notUndefined(this.props.onClickCivilisation, this.props.civilisation, this.props.whoAmI, this.props.triggerAction)) {
            const civilisation = this.props.civilisation as Civilisation;
            const whoAmI = this.props.whoAmI as Player;
            const triggerAction = this.props.triggerAction as ActionType;
            const onClickCivilisation = this.props.onClickCivilisation as (playerEvent:PlayerEvent, callback:any) => void;
            onClickCivilisation(new PlayerEvent(whoAmI, triggerAction, civilisation), (data: any) => {
                console.log('act callback', data);
                if (data.status !== 'ok') {
                    alert(Util.buildValidationErrorMessage(data));
                }
            });
        }
    };


    private isValidOption() {
        if (Util.notUndefined(this.props.draft, this.props.whoAmI, this.props.triggerAction, this.props.civilisation)) {
            const draft = Draft.from(this.props.draft as Draft);
            const whoAmI = this.props.whoAmI as Player;
            const triggerAction = this.props.triggerAction as ActionType;
            const civilisation = this.props.civilisation as Civilisation;
            let draftsStore = new DraftsStore();
            draftsStore.createDraft('draftId', draft);
            const errors = Validator.checkAllValidations('draftId', draftsStore, new PlayerEvent(whoAmI, triggerAction, civilisation));
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
}

export default withTranslation()(CivPanel);
