import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {applyMiddleware, createStore, Store} from 'redux';
import {Action, IApplyConfig, IClickOnCiv, ISendJoin} from "./actions";
import NotFound404 from "./components/404";
import Footer from "./components/Footer";
import LanguageSelectors from "./components/LanguageSelectors";
import Menu from "./components/Menu";
import {Actions} from "./constants";
import Draft from './containers/Draft';
import './i18n';
import {default as i18n} from "./i18n";
import './index.css';
import {IDraftConfig} from "./models/IDraftConfig";
import NameGenerator from "./models/NameGenerator";
import Player from "./models/Player";
import Preset from "./models/Preset";
import {SocketUtil} from "./models/SocketUtil";
import {updateState} from './reducers';
import {IStoreState} from './types';

const createMySocketMiddleware = () => {

    return (storeAPI: { dispatch: (arg0: Action) => void; }) => {
        let socket: any = null;

        return (next: (arg0: any) => void) => (action: Action) => {
            if (action.type === Actions.SEND_JOIN) {
                console.log("SEND_JOIN", SocketUtil.initSocketIfFirstUse, socket, storeAPI);
                socket = SocketUtil.initSocketIfFirstUse(socket, storeAPI);
                const sendJoin = action as ISendJoin;
                socket.emit('join', {name: sendJoin.name}, (data: IDraftConfig) => {
                    console.log('join callback', data);
                    storeAPI.dispatch({type: Actions.APPLY_CONFIG, value: data} as IApplyConfig);
                });
                return;
            }

            if (action.type === Actions.CLICK_CIVILISATION) {
                socket = SocketUtil.initSocketIfFirstUse(socket, storeAPI);
                const clickCivilisation = action as IClickOnCiv;
                socket.emit('act', clickCivilisation.playerEvent, clickCivilisation.callback);
            }

            if (action.type === Actions.DISCONNECT) {
                socket = SocketUtil.disconnect(socket, storeAPI);
            }

            return next(action);
        }
    }
};

const store: Store = createStore<IStoreState, Action, any, Store>(updateState,
    {
        nameHost: "…",
        nameGuest: "…",
        hostReady: false,
        guestReady: false,
        whoAmI: Player.NONE,
        ownName: NameGenerator.getNameFromLocalStorage(),
        preset: Preset.SAMPLE,
        nextAction: 0,
        events: [],
        language: i18n.language,
        showModal: (NameGenerator.getNameFromLocalStorage() === null)
    },
    applyMiddleware(createMySocketMiddleware()));

console.log(store.getState());

ReactDOM.render(
    <Provider store={store}>
        <LanguageSelectors/>
        <Router>
            <Switch>
                <Route path="/draft/:id" component={Draft}/>
                <Route exact path="/" component={Menu}/>
                <Route path="/presets" component={Menu}/>
                <Route path="/preset/:id" component={Menu}/>
                <Route path="/preset/:id/new" component={Menu}/>
                <Route path="/spectate" component={Menu}/>
                <Route path="/practice" component={Menu}/>
                <Route component={NotFound404}/>
            </Switch>
        </Router>
        <Footer/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
