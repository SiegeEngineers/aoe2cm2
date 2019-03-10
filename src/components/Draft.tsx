import * as React from "react";
import '../pure-min.css'
import '../style2.css'
import CivGrid from "./CivGrid";
import Messages from "./Messages";
import Players from "./Players";
import TurnRow from "./TurnRow";
import Player from "../models/Player";
import Preset from "../models/Preset";
import "../models/DraftEvent";
import PlayerEvent from "../models/PlayerEvent";
import * as io from "socket.io-client";
import {DraftEvent} from "../models/DraftEvent";
import Socket = SocketIOClient.Socket;
import {IDraftConfig} from "../models/IDraftConfig";
import {IJoinedMessage} from "../models/IJoinedMessage";

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
}

interface IState {
    nextStep: number;
}

class Draft extends React.Component<IProps, IState> {

    private static getIdFromUrl(): string {
        const match: RegExpMatchArray | null = window.location.pathname.match(/\/draft\/([A-Za-z]+)\/?.*/);
        if (match !== null) {
            return match[1];
        }
        alert('Could not get draft ID from url');
        return '';
    }

    private readonly socket: Socket;

    constructor(props: IProps) {
        super(props);

        this.socket = io({query: {draftId: Draft.getIdFromUrl()}});

        this.socket.on("player_joined", (data: IJoinedMessage) => {
            console.log("player_joined", data);
            if (data.playerType === Player.HOST) {
                if (this.props.onSetNameHostAction !== undefined) {
                    this.props.onSetNameHostAction(data.name);
                }
            }
            if (data.playerType === Player.GUEST) {
                if (this.props.onSetNameGuestAction !== undefined) {
                    this.props.onSetNameGuestAction(data.name);
                }
            }
        });

        this.socket.on("playerEvent", (message: PlayerEvent) => {
            console.log('message recieved:', "[act]", JSON.stringify(message));
            if (this.props.onActionCompleted !== undefined) {
                const playerEvent = new PlayerEvent(message.player, message.actionType, message.civilisation);
                const onActionCompleted = this.props.onActionCompleted as (message: DraftEvent) => void;
                console.log('executing onActionCompleted');
                onActionCompleted(playerEvent);
            }
        });

        const name = 'myname' + Date.now();
        console.log('setting name to', name);
        this.socket.emit('join', {name}, (data: IDraftConfig) => {
            console.log('thecallback', data);
            if (this.props.onDraftConfig !== undefined) {
                const onDraftConfig = this.props.onDraftConfig as (message: IDraftConfig) => void;
                console.log('executing onDraftConfig');
                onDraftConfig(data);
            }
        });
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

                <CivGrid civilisations={this.props.preset.civilisations} socket={this.socket}/>

            </div>
        );
    }
}

export default Draft;