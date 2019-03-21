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

interface IProps extends WithTranslation {
    civilisation?: Civilisation;
    active: boolean;
    civPanelType: CivPanelType;
    whoAmI?: Player;
    triggerAction?: ActionType;

    onClickCivilisation?: (playerEvent:PlayerEvent, callback:any) => void;
}

class CivPanel extends React.Component<IProps, object> {
    public render() {
        const civilisation: Civilisation | undefined = this.props.civilisation;
        let imageSrc: string = "";
        let civilisationKey = '';
        let civilisationName = '';
        if (civilisation !== undefined) {
            civilisationName = civilisation.name;
            imageSrc = "/images/civs/" + civilisationName.toLocaleLowerCase() + "_orig.png";
            civilisationKey = 'civs.' + civilisationName;
        }
        let className: string = this.props.civPanelType.toString();
        let onClickAction = () => {};
        if (this.props.civPanelType === CivPanelType.CHOICE) {
            className += ' pure-u-1-12';
            onClickAction = this.onClickCiv;
        } else {
            className += ' card';
        }
        if(this.props.active){
            className += " active-choice";
        }
        let contentClass: string = "box-content";
        if (this.props.civilisation !== undefined) {
            contentClass += " visible";
        }
        return (
            <div className={className} onClick={onClickAction}>
                <div className={contentClass}>
                    <div className="stretchy-wrapper">
                        <div className="stretchy-image">
                            <img src={imageSrc} alt={civilisationName}/>
                        </div>
                        <div className="stretchy-text">
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
}

export default withTranslation()(CivPanel);
