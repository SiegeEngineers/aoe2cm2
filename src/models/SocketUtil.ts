import io from "socket.io-client";
import {Action, IActionCompleted, ISetEvents, ISetName} from "../actions";
import {Actions} from "../constants";
import {default as ModelAction} from "./Action";
import {DraftEvent} from "./DraftEvent";
import {IJoinedMessage} from "./IJoinedMessage";
import Player from "./Player";
import PlayerEvent from "./PlayerEvent";
import {Util} from "./Util";

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

        socket.on("playerEvent", (message: PlayerEvent) => {
            console.log('message recieved:', "[act]", JSON.stringify(message));
            storeAPI.dispatch({type: Actions.ACTION_COMPLETED, value: message} as IActionCompleted);
        });

        socket.on("adminEvent", (message: { player: Player, action: ModelAction, events: DraftEvent[] }) => {
            console.log('message recieved:', "[adminEvent]", JSON.stringify(message));
            storeAPI.dispatch({type: Actions.SET_EVENTS, value: message} as ISetEvents);
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
