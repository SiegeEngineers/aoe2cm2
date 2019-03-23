import * as React from 'react';
import './App.css';
import Draft from "./containers/Draft";

class App extends React.Component {
    public render() {
        return (
            <div id={'wrapper'} className={'wrapper'}>
                <Draft />
            </div>
        );
    }
}

export default App;
