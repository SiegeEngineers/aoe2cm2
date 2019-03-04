import * as React from 'react';
import './App.css';
import Draft from "./components/Draft";
import {default as ModelDraft} from './models/Draft';
import Preset from "./models/Preset";

class App extends React.Component {
  public render() {
    const draft:ModelDraft= new ModelDraft('Sneaky Saladin', 'Beastly Barbarossa', Preset.SAMPLE);
    return (
        <div id={'wrapper'} className={'wrapper'}>
          <Draft config={draft}/>
        </div>
    );
  }
}

export default App;
