import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {applyMiddleware, createStore, Store} from 'redux';
import {Action, IApplyConfig, IClickOnCiv, ISendJoin} from "./actions";
import NotFound404 from "./components/404";
import Footer from "./components/menu/Footer";
import TopRightControls from "./components/menu/TopRightControls";
import Menu from "./components/menu/Menu";
import {Actions} from "./constants";
import Draft from './containers/Draft';
import './i18n';
import './pure-min.css';
import './style-material.css';
import './style.css';
import './index.css';
import {IDraftConfig} from "./models/IDraftConfig";
import {SocketUtil} from "./util/SocketUtil";
import {default as updateState} from './reducers';
import {ApplicationState} from './types';
import {initialDraftState} from "./reducers/draft";
import {initialDraftCountdownState} from "./reducers/draftCountdown";
import {initialDraftOwnPropertiesState} from "./reducers/draftOwnProperties";
import {initialLanguageState} from "./reducers/language";
import {initialModalState} from "./reducers/modal";
import {initialPresetEditorState} from "./reducers/presetEditor";

const createMySocketMiddleware = () => {

    return (storeAPI: { dispatch: (arg0: Action) => void; getState: () => ApplicationState }) => {
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
            if (action.type === Actions.SEND_READY) {
                socket = SocketUtil.initSocketIfFirstUse(socket, storeAPI);
                socket.emit('ready', {}, (data: IDraftConfig) => {
                    console.log('ready callback', data);
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

const store: Store = createStore<ApplicationState, Action, any, Store>(updateState,
    {
        draft: initialDraftState,
        countdown: initialDraftCountdownState,
        ownProperties: initialDraftOwnPropertiesState,
        language: initialLanguageState,
        modal: initialModalState,
        presetEditor: initialPresetEditorState
    },
    applyMiddleware(createMySocketMiddleware()));

console.log(store.getState());

ReactDOM.render(
    <Provider store={store}>
        <TopRightControls/>
        <Router>
            <Switch>
                <Route path="/draft/:id" component={Draft}/>
                <Route exact path="/" component={Menu}/>
                <Route path="/presets" component={Menu}/>
                <Route path="/preset/create" component={Menu}/>
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
