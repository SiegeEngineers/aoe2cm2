import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {applyMiddleware, createStore, Store} from 'redux';
import {Provider} from 'react-redux';
import io from 'socket.io-client';
import {updateState} from './reducers';
import {IStoreState} from './types';
import Preset from "./models/Preset";
import Draft from './containers/Draft';
import ModelDraft from "./models/Draft";
import {Util} from "./models/Util";
import {IJoinedMessage} from "./models/IJoinedMessage";
import Player from "./models/Player";
import PlayerEvent from "./models/PlayerEvent";
import {IDraftConfig} from "./models/IDraftConfig";
import {Action, IActionCompleted, IApplyConfig, IClickOnCiv, ISendJoin, ISetName} from "./actions";
import {Actions} from "./constants";
import './index.css';
import './i18n';

const createMySocketMiddleware = () => {
    return (storeAPI: { dispatch: (arg0: Action) => void; }) => {
        const socket = io({query: {draftId: Util.getIdFromUrl()}});

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

        return (next: (arg0: any) => void) => (action: Action) => {
            if (action.type === Actions.SEND_JOIN) {
                const sendJoin = action as ISendJoin;
                socket.emit('join', {name: sendJoin.name}, (data: IDraftConfig) => {
                    console.log('join callback', data);
                    storeAPI.dispatch({type: Actions.APPLY_CONFIG, value: data} as IApplyConfig);
                });
                return;
            }

            if (action.type === Actions.CLICK_CIVILISATION) {
                const clickCivilisation = action as IClickOnCiv;
                socket.emit('act', clickCivilisation.playerEvent, clickCivilisation.callback);
            }

            return next(action);
        }
    }
};

const store: Store = createStore<IStoreState, Action, any, Store>(updateState,
    new ModelDraft('Sneaky Saladin', 'Beastly Barbarossa', Preset.SIMPLE),
    applyMiddleware(createMySocketMiddleware()));

ReactDOM.render(
    <Provider store={store}>
        <Draft/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
