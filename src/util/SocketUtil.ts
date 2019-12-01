import io from "socket.io-client";
import {Action, IActionCompleted, ICountdownEvent, IReplayEvent, ISetEvents, ISetName, ISetReady} from "../actions";
import {Actions} from "../constants";
import {default as ModelAction} from "../models/Action";
import {DraftEvent} from "../models/DraftEvent";
import {IJoinedMessage} from "../models/IJoinedMessage";
import Player from "../models/Player";
import PlayerEvent from "../models/PlayerEvent";
import {Util} from "./Util";
import {ICountdownValues} from "../types";

export const SocketUtil = {
    initSocketIfFirstUse(socket: any, storeAPI: { dispatch: (arg0: Action) => void }) {
        if (socket !== null) {
            return socket;
        }
        socket = io({query: {draftId: Util.getIdFromUrl()}});

        socket.on("player_joined", (data: IJoinedMessage) => {
            console.log("player_joined", data);
            if (data.playerType === Player.HOST || data.playerType === Player.GUEST) {
                storeAPI.dispatch({type: Actions.SET_NAME, player: data.playerType, value: data.name} as ISetName);
            }
        });

        socket.on("player_ready", (data: IJoinedMessage) => {
            console.log("player_joined", data);
            if (data.playerType === Player.HOST || data.playerType === Player.GUEST) {
                storeAPI.dispatch({type: Actions.SET_READY, player: data.playerType} as ISetReady);
            }
        });

        socket.on("playerEvent", (message: PlayerEvent) => {
            console.log('message recieved:', "[act]", JSON.stringify(message));
            storeAPI.dispatch({type: Actions.ACTION_COMPLETED, value: message} as IActionCompleted);
        });

        socket.on("adminEvent", (message: { player: Player, action: ModelAction, events: DraftEvent[] }) => {
            console.log('message recieved:', "[adminEvent]", JSON.stringify(message));
            storeAPI.dispatch({type: Actions.SET_EVENTS, value: message} as ISetEvents);
        });

        socket.on("message", (message: string) => {
            console.log('message recieved:', "[message]", message);
            alert(message);
        });

        socket.on("countdown", (message: ICountdownValues) => {
            console.log('message received:', "[countdown]", message);
            storeAPI.dispatch({type: Actions.COUNTDOWN, value: message} as ICountdownEvent);
        });

        socket.on("replay", (message: any) => {
            console.log('message received:', "[replay]", message);
            storeAPI.dispatch({type: Actions.REPLAY, value: message} as IReplayEvent);
        });

        return socket;
    },
    disconnect(socket: any, storeAPI: { dispatch: (arg0: Action) => void }) {
        if (socket !== null && socket.connected) {
            socket.disconnect();
        }
        return null;
    }
};
