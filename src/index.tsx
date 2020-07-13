import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {applyMiddleware, createStore, Store} from 'redux';
import {Action, IApplyConfig, IClickOnCiv, ISetName, ISetRole} from "./actions";
import Footer from "./components/menu/Footer";
import NavBar from "./components/menu/NavBar";
import Menu from "./components/menu/Menu";
import {ClientActions, ServerActions} from "./constants";
import Draft from './containers/Draft';
import './i18n';
import './sass/styles.scss';
import '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css'
import {IDraftConfig} from "./types/IDraftConfig";
import {SocketUtil} from "./util/SocketUtil";
import {default as updateState} from './reducers';
import {ApplicationState} from './types';
import {initialDraftState} from "./reducers/draft";
import {initialDraftCountdownState} from "./reducers/draftCountdown";
import {initialDraftOwnPropertiesState} from "./reducers/draftOwnProperties";
import {initialLanguageState} from "./reducers/language";
import {initialModalState} from "./reducers/modal";
import {initialPresetEditorState} from "./reducers/presetEditor";
import SpectateDraft from "./containers/SpectateDraft";

const createMySocketMiddleware = () => {

    return (storeAPI: { dispatch: (action: Action) => void; getState: () => ApplicationState }) => {
        let socket: SocketIOClient.Socket | null = null;

        return (next: (arg0: any) => void) => (action: Action) => {

            if (action.type === ClientActions.CONNECT_TO_SERVER) {
                console.log("CONNECT", SocketUtil.initSocketIfFirstUse, socket, storeAPI);
                if (socket === null) {
                    socket = SocketUtil.initSocketIfFirstUse(socket, storeAPI) as SocketIOClient.Socket;
                }
            }

            if (action.type === ClientActions.SEND_SET_ROLE) {
                console.log("SET_ROLE", SocketUtil.initSocketIfFirstUse, socket, storeAPI);
                socket = SocketUtil.initSocketIfFirstUse(socket, storeAPI) as SocketIOClient.Socket;
                if (socket.disconnected) {
                    return;
                }
                const setRole = action as ISetRole;
                socket.emit('set_role', {name: setRole.name, role: setRole.role}, (data: IDraftConfig) => {
                    console.log('setRole callback', data);
                    storeAPI.dispatch({type: ServerActions.APPLY_CONFIG, value: data} as IApplyConfig);
                });
                return;
            }

            if (action.type === ClientActions.SEND_SET_NAME) {
                console.log("SEND_SET_NAME", SocketUtil.initSocketIfFirstUse, socket, storeAPI);
                socket = SocketUtil.initSocketIfFirstUse(socket, storeAPI) as SocketIOClient.Socket;
                if (socket.disconnected) {
                    return;
                }
                const setName = action as ISetName;
                socket.emit('set_name', {name: setName.name}, () => {
                });
                return;
            }

            if (action.type === ClientActions.SEND_READY) {
                socket = SocketUtil.initSocketIfFirstUse(socket, storeAPI) as SocketIOClient.Socket;
                if (socket.disconnected) {
                    return;
                }
                socket.emit('ready', {}, (data: IDraftConfig) => {
                    console.log('ready callback', data);
                    storeAPI.dispatch({type: ServerActions.APPLY_CONFIG, value: data} as IApplyConfig);
                });
                return;
            }

            if (action.type === ClientActions.SEND_CLICK_PANEL) {
                socket = SocketUtil.initSocketIfFirstUse(socket, storeAPI) as SocketIOClient.Socket;
                if (socket.disconnected) {
                    return;
                }
                const clickCivilisation = action as IClickOnCiv;
                socket.emit('act', clickCivilisation.playerEvent, clickCivilisation.callback);
            }

            if (action.type === ClientActions.DISCONNECT_FROM_SERVER) {
                console.log('DISCONNECT');
                if (socket !== null && socket.connected) {
                    SocketUtil.disconnect(socket, storeAPI);
                }
                socket = null;
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
        <Router>
            <NavBar/>
                <Switch>
                    <Route exact path="/" component={Menu}/>
                    <Route path="/draft/:id" component={Draft}/>
                    <Route path="/presets" component={Menu}/>
                    <Route path="/preset/create" component={Menu}/>
                    <Route path="/preset/:id" component={Menu}/>
                    <Route path="/preset/:id/new" component={Menu}/>
                    <Route path="/spectate/:id" component={SpectateDraft}/>
                    <Route path="/spectate" component={Menu}/>
                    <Route path="/practice" component={Menu}/>
                    <Route component={Menu}/>
                </Switch>
        </Router>
        <Footer/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
