import io from "socket.io-client";
import {
    Action,
    IActionCompleted,
    IApplyConfig,
    IConnectPlayer,
    ICountdownEvent,
    IReplayEvent,
    ISetEvents,
    ISetReady
} from "../actions";
import {ServerActions} from "../constants";
import {default as ModelAction} from "../constants/Action";
import {DraftEvent} from "../types/DraftEvent";
import {IJoinedMessage} from "../types/IJoinedMessage";
import Player from "../constants/Player";
import PlayerEvent from "../models/PlayerEvent";
import {Util} from "./Util";
import {ICountdownValues} from "../types";
import {IDraftConfig} from "../types/IDraftConfig";

export const SocketUtil = {
    initSocketIfFirstUse(socket: SocketIOClient.Socket | null, storeAPI: { dispatch: (arg0: Action) => void }): SocketIOClient.Socket {
        if (socket !== null) {
            return socket;
        }
        socket = io({query: {draftId: Util.getIdFromUrl()}});

        socket.on("draft_state", (data: IDraftConfig) => {
            console.log("draft_state", data);
            storeAPI.dispatch({type: ServerActions.APPLY_CONFIG, value: data} as IApplyConfig);
        });

        socket.on("player_set_role", (data: IJoinedMessage) => {
            console.log("player_set_role", data);
            if (data.playerType === Player.HOST || data.playerType === Player.GUEST) {
                storeAPI.dispatch({type: ServerActions.CONNECT_PLAYER, player: data.playerType, value: data.name} as IConnectPlayer);
            }
        });

        socket.on("player_ready", (data: IJoinedMessage) => {
            console.log("player_ready", data);
            if (data.playerType === Player.HOST || data.playerType === Player.GUEST) {
                storeAPI.dispatch({type: ServerActions.SET_READY, player: data.playerType} as ISetReady);
            }
        });

        socket.on("playerEvent", (message: PlayerEvent) => {
            console.log('message recieved:', "[act]", JSON.stringify(message));
            storeAPI.dispatch({type: ServerActions.ACTION_COMPLETED, value: message} as IActionCompleted);
        });

        socket.on("adminEvent", (message: { player: Player, action: ModelAction, events: DraftEvent[] }) => {
            console.log('message recieved:', "[adminEvent]", JSON.stringify(message));
            storeAPI.dispatch({type: ServerActions.SET_EVENTS, value: message} as ISetEvents);
        });

        socket.on("message", (message: string) => {
            console.log('message recieved:', "[message]", message);
            alert(message);
        });

        socket.on("countdown", (message: ICountdownValues) => {
            console.log('message received:', "[countdown]", message);
            storeAPI.dispatch({type: ServerActions.COUNTDOWN, value: message} as ICountdownEvent);
        });

        socket.on("replay", (message: any) => {
            console.log('message received:', "[replay]", message);
            storeAPI.dispatch({type: ServerActions.REPLAY, value: message} as IReplayEvent);
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
