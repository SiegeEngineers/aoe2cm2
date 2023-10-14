import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {applyMiddleware, createStore, Store} from 'redux';
import {Action, IApplyConfig, IClickOnCiv, ISetName, ISetRole, IUpdateDrafts} from "./actions";
import Footer from "./components/menu/Footer";
import NavBar from "./components/menu/NavBar";
import Menu from "./components/menu/Menu";
import {ClientActions, ServerActions} from "./constants";
import Draft from './containers/Draft';
import './i18n';
import './sass/bulma.scss';
import '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css';
import {IDraftConfig} from "./types/IDraftConfig";
import {SocketUtil} from "./util/SocketUtil";
import {default as updateState} from './reducers';
import {ApplicationState, IRecentDraft} from './types';
import {initialDraftState} from "./reducers/draft";
import {initialDraftCountdownState} from "./reducers/draftCountdown";
import {initialDraftOwnPropertiesState} from "./reducers/draftOwnProperties";
import {initialLanguageState} from "./reducers/language";
import {initialModalState} from "./reducers/modal";
import {initialPresetEditorState} from "./reducers/presetEditor";
import SpectateDraft from "./containers/SpectateDraft";
import {initialColorSchemeState} from "./reducers/colorScheme";
import {initialReplayState} from "./reducers/replay";
import {initialIconStyleState} from "./reducers/iconStyle";
import {initialRecentDraftsState} from './reducers/recentDrafts';
import {initialAdminState} from "./reducers/admin";

const createMySocketMiddleware = () => {

    return (storeAPI: { dispatch: (action: Action) => void; getState: () => ApplicationState }) => {
        let socket: SocketIOClient.Socket | null = null;
        let lobbySocket: SocketIOClient.Socket | null = null; // These two sockets should be merged together

        return (next: (arg0: any) => void) => (action: Action) => {

            if (action.type === ClientActions.SPECTATE_DRAFTS) {
                const { subscribeCount } = storeAPI.getState().recentDrafts;
                console.log("SPECTATE_DRAFTS", lobbySocket, subscribeCount);
                if (subscribeCount === 0) {
                    lobbySocket = SocketUtil.initLobbySocketIfFirstUse(lobbySocket, storeAPI) as SocketIOClient.Socket;
                    lobbySocket.emit('spectate_drafts', {}, (data: IRecentDraft[]) => {
                        console.log('spectate_drafts callback', data);
                        storeAPI.dispatch({type: ServerActions.UPDATE_DRAFTS, value: data} as IUpdateDrafts);
                    });
                }
            }

            if (action.type === ClientActions.UNSPECTATE_DRAFTS) {
                const { subscribeCount } = storeAPI.getState().recentDrafts;
                console.log('UNSPECTATE_DRAFTS', lobbySocket, subscribeCount);
                if (subscribeCount === 1) {
                    if (lobbySocket !== null && lobbySocket.connected) {
                        SocketUtil.disconnect(lobbySocket);
                    }
                    lobbySocket = null;
                }
            }

            if (action.type === ClientActions.CONNECT_TO_SERVER) {
                console.log("CONNECT", SocketUtil.initSocketIfFirstUse, socket, storeAPI);
                if (socket !== null && socket.connected) {
                    SocketUtil.disconnect(socket);
                }
                socket = null;
                socket = SocketUtil.initSocketIfFirstUse(socket, storeAPI) as SocketIOClient.Socket;
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
                    SocketUtil.disconnect(socket);
                }
                socket = null;
            }

            return next(action);
        }
    }
};

const store: Store = createStore<ApplicationState, Action, any, Store>(updateState,
    {
        iconStyle: initialIconStyleState,
        replay: initialReplayState,
        draft: initialDraftState,
        countdown: initialDraftCountdownState,
        ownProperties: initialDraftOwnPropertiesState,
        language: initialLanguageState,
        colorScheme: initialColorSchemeState,
        modal: initialModalState,
        presetEditor: initialPresetEditorState,
        recentDrafts: initialRecentDraftsState,
        admin: initialAdminState,
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
                    <Route path="/api" component={Menu}/>
                    <Route path="/admin/login" component={Menu}/>
                    <Route path="/admin/draft/:draftName" component={Menu}/>
                    <Route path="/admin" component={Menu}/>
                    <Route component={Menu}/>
                </Switch>
            <Footer/>
        </Router>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
