import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {createStore} from 'redux';
import {updateState} from './reducers';
import {IStoreState} from './types';
import Preset from "./models/Preset";
import Draft from './containers/Draft';
import {Provider} from 'react-redux';
import {default as ModelDraft} from "./models/Draft";

const store = createStore<IStoreState, any, any, any>(updateState, new ModelDraft('Sneaky Saladin', 'Beastly Barbarossa', Preset.SAMPLE));

ReactDOM.render(
    <Provider store={store}>
        <Draft/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
