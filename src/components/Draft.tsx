import * as React from "react";
import '../pure-min.css'
import '../style2.css'
import CivGrid from "./CivGrid";
import Messages from "../containers/Messages";
import Players from "./Players";
import TurnRow from "./TurnRow";
import Player from "../models/Player";
import Preset from "../models/Preset";
import "../models/DraftEvent";
import {DraftEvent} from "../models/DraftEvent";
import {IDraftConfig} from "../models/IDraftConfig";
import {WithTranslation, withTranslation} from "react-i18next";
import LanguageSelector from "../containers/LanguageSelector";
import Modal from "../containers/Modal";
import NameGenerator from "../models/NameGenerator";

interface IProps extends WithTranslation {
    nameHost: string;
    nameGuest: string;
    whoAmI: Player;
    preset: Preset;
    nextAction: number;

    onActionCompleted?: (message: DraftEvent) => void;
    onDraftConfig?: (message: IDraftConfig) => void;
    onNextAction?: () => void;
    onSetNameHostAction?: (name: string) => void;
    onSetNameGuestAction?: (name: string) => void;
    triggerJoin?: (name: string) => void;
}

interface IState {
    nextStep: number;
}

class Draft extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        let username: string | null = NameGenerator.getNameFromLocalStorage();
        if (this.props.triggerJoin !== undefined && username !== null) {
            console.log('triggering JOIN');
            this.props.triggerJoin(username);
        }
    }

    public render() {
        const presetName: string = this.props.preset.name;
        const turns = this.props.preset.turns;


        return (
            <div id="container">
                <div className={'languageSelectors'}>
                    <LanguageSelector language={'en-GB'}/>
                    <LanguageSelector language={'de-DE'}/>
                    <LanguageSelector language={'zh-CN'}/>
                </div>

                <Modal/>

                <div className="draft-content">

                    <div id="draft-title" className="centered text-primary info-card">{presetName}</div>

                    <TurnRow turns={turns}/>

                    <Players nameHost={this.props.nameHost} nameGuest={this.props.nameGuest} preset={this.props.preset}/>

                    <Messages/>

                    <CivGrid civilisations={this.props.preset.civilisations}/>

                </div>
            </div>
        );
    }
}

export default withTranslation()(Draft);