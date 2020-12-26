import io from "socket.io-client";
import {
    Action,
    IActionCompleted,
    IApplyConfig,
    IConnectPlayer,
    ICountdownEvent,
    IReplayEvent,
    ISetEvents,
    ISetPlayerName,
    ISetReady
} from "../actions";
import {ServerActions} from "../constants";
import {default as ModelAction} from "../constants/Action";
import {DraftEvent} from "../types/DraftEvent";
import {IPlayerWithNameMessage} from "../types/IPlayerWithNameMessage";
import Player from "../constants/Player";
import PlayerEvent from "../models/PlayerEvent";
import {Util} from "./Util";
import {ICountdownValues, IDraftState} from "../types";
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

        socket.on("player_set_role", (data: IPlayerWithNameMessage) => {
            console.log("player_set_role", data);
            if (data.playerType === Player.HOST || data.playerType === Player.GUEST) {
                storeAPI.dispatch({
                    type: ServerActions.SET_PLAYER_CONNECTED,
                    player: data.playerType,
                    value: data.name
                } as IConnectPlayer);
            }
        });

        socket.on("player_set_name", (data: IPlayerWithNameMessage) => {
            console.log("player_set_name", data);
            if (data.playerType === Player.HOST || data.playerType === Player.GUEST) {
                storeAPI.dispatch({
                    type: ServerActions.SET_PLAYER_NAME,
                    player: data.playerType,
                    value: data.name
                } as ISetPlayerName);
            }
        });

        socket.on("player_ready", (data: IPlayerWithNameMessage) => {
            console.log("player_ready", data);
            if (data.playerType === Player.HOST || data.playerType === Player.GUEST) {
                storeAPI.dispatch({type: ServerActions.SET_READY, player: data.playerType} as ISetReady);
            }
        });

        socket.on("playerEvent", (message: PlayerEvent) => {
            console.log('message recieved:', "[act]", JSON.stringify(message));
            storeAPI.dispatch({type: ServerActions.EXECUTE_ACTION, value: message} as IActionCompleted);
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
            storeAPI.dispatch({type: ServerActions.SET_COUNTDOWN_VALUE, value: message} as ICountdownEvent);
        });

        socket.on("replay", (message: any) => {
            console.log('message received:', "[replay]", message);
            const draftState = message as IDraftState;
            draftState.events = draftState.events.map(value => {
                if (Util.isPlayerEvent(value)) {
                    return PlayerEvent.from(value);
                } else {
                    return value;
                }
            });
            storeAPI.dispatch({type: ServerActions.APPLY_REPLAY, value: draftState} as IReplayEvent);
        });

        return socket;
    },
    disconnect(socket: any) {
        if (socket !== null && socket.connected) {
            socket.disconnect();
        }
        return null;
    }
};
