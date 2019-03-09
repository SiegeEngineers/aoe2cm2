import * as React from "react";
import * as io from "socket.io-client"
import '../pure-min.css'
import '../style2.css'
import CivGrid from "./CivGrid";
import Messages from "./Messages";
import Players from "./Players";
import TurnRow from "./TurnRow";
import Action from "../models/Action";
import Civilisation from "../models/Civilisation";
import Player from "../models/Player";
import Preset from "../models/Preset";
import "../models/DraftEvent";

interface IProps {
    nameHost: string;
    nameGuest: string;
    whoAmI: Player;
    preset: Preset;
    nextAction: number;

    onNextAction?: () => void;
    onSetNameHostAction?: () => void;
    onSetNameGuestAction?: () => void;
}

interface IState {
    nextStep: number;
}

class Draft extends React.Component<IProps, IState> {
    private socket = io("http://localhost:3000/gQkQ");

    constructor(props: IProps) {
        super(props);

        this.socket.on("player_joined", (data: any) => {
            alert("player_joined\n\n" + JSON.stringify(data));
        });

        this.socket.on("act", (message: any) => {
            alert("act\n\n" + JSON.stringify(message));
        });
    }

    public render() {
        const presetName: string = this.props.preset.name;
        const turns = this.props.preset.turns;

        return (
            <div className="draft-content">

                <button onClick={this.talk}>join</button>
                <button onClick={this.act}>act</button>
                <button onClick={this.props.onNextAction}>nextAction</button>
                <button onClick={this.props.onSetNameHostAction}>setNameHost</button>
                <button onClick={this.props.onSetNameGuestAction}>setNameGuest</button>

                <div id="draft-title" className="centered text-primary info-card">{presetName}</div>

                <TurnRow turns={turns}/>

                <Players nameHost={this.props.nameHost} nameGuest={this.props.nameGuest} preset={this.props.preset}/>

                <Messages/>

                <CivGrid/>

            </div>
        );
    }

    private talk = () => {
        this.socket.emit("join", {"name": "Joyful Joan"});
    };

    private act = () => {
        this.socket.emit("act", {action: Action.PICK, civilisation: Civilisation.AZTECS});
    };

}

export default Draft;