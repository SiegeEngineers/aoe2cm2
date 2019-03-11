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

interface IProps {
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

        let username: string | null;
        try {
            username = localStorage.getItem('username');
            if (username === null) {
                username = 'myname' + Date.now();
                localStorage.setItem('username', username);
                console.log('setting username to', username);
            }
        } catch (e) {
            username = 'nolocalstorage' + Date.now();
        }
        if (this.props.triggerJoin !== undefined) {
            console.log('triggering JOIN');
            this.props.triggerJoin(username);
        }
    }

    public render() {
        const presetName: string = this.props.preset.name;
        const turns = this.props.preset.turns;

        return (
            <div className="draft-content">

                <div id="draft-title" className="centered text-primary info-card">{presetName}</div>

                <TurnRow turns={turns}/>

                <Players nameHost={this.props.nameHost} nameGuest={this.props.nameGuest} preset={this.props.preset}/>

                <Messages/>

                <CivGrid civilisations={this.props.preset.civilisations}/>

            </div>
        );
    }
}

export default Draft;