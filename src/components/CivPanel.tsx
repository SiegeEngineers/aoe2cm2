import * as React from 'react';
import ActionType from "../models/ActionType";
import Civilisation from "../models/Civilisation";
import '../pure-min.css'
import '../style2.css'
import PlayerEvent from "../models/PlayerEvent";
import Player from "../models/Player";
import CivPanelType from "../models/CivPanelType";
import {Util} from "../models/Util";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import i18next from "i18next";
import {Validator} from "../models/Validator";
import {DraftsStore} from "../models/DraftsStore";
import Draft from "../models/Draft";
import {IStoreState} from "../types";
import Preset from "../models/Preset";

interface IProps extends WithTranslation {
    civilisation?: Civilisation;
    active: boolean;
    sniped?: boolean;
    civPanelType: CivPanelType;
    whoAmI?: Player;
    triggerAction?: ActionType;
    draft?: IStoreState;

    onClickCivilisation?: (playerEvent:PlayerEvent, callback:any) => void;
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
            imageSrc = "/images/civs/" + civilisationName.toLocaleLowerCase() + "_orig.png";
            civilisationKey = 'civs.' + civilisationName;
            if (Util.isTechnicalCivilisation(civilisation)) {
                textClass += ' hidden';
            }
        }
        let className: string = this.props.civPanelType.toString();
        let onClickAction = () => {};
        if (this.props.civPanelType === CivPanelType.CHOICE) {
            className += ' pure-u-1-12';
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
            className += ' card';
        }
        if(this.props.active){
            className += " active-choice";
        } else if (civilisation !== undefined) {
            className += ' has-value';
        }
        let contentClass: string = "box-content";
        if (this.props.civilisation !== undefined) {
            contentClass += " visible";
        }
        let snipeMarkerClass = "stretchy-image snipe-marker";
        if (!this.props.sniped) {
            snipeMarkerClass += ' hidden';
        }
        let usedMarkerClass = "stretchy-image used-marker";
        if (!this.state.used) {
            usedMarkerClass += ' hidden';
        }
        return (
            <div className={className} onClick={onClickAction}>
                <div className={contentClass}>
                    <div className="stretchy-wrapper">
                        <div className="stretchy-image">
                            <img src={imageSrc} alt={civilisationName}/>
                        </div>
                        <div className={snipeMarkerClass}/>
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
                    alert(CivPanel.buildValidationErrorMessage(data));
                }
            });
        }
    };

    private static buildValidationErrorMessage = (data: any): string => {
        let message = i18next.t('validationFailed') + '\n';
        for (let validationError of data.validationErrors) {
            message += `\n${validationError}: ${i18next.t('errors.' + validationError)}`;
        }
        return message;
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
            const draft = this.props.draft as IStoreState;
            const preset = draft.preset as Preset;
            return draft.nextAction >= preset.turns.length;
        }
    }
}

export default withTranslation()(CivPanel);
