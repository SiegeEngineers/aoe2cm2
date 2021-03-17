import * as React from 'react';
import {default as ModelPlayer} from '../../constants/Player';
import PlayerDraftState from "../../containers/PlayerDraftState";
import Preset from "../../models/Preset";

interface IProps {
    nameHost: string;
    nameGuest: string;
    preset: Preset;
    simplifiedUI: boolean;
    userTheme?: {};
}

class DraftState extends React.Component<IProps, object> {
    public render() {
        return (
            <div className="columns is-mobile player-panels">
                <PlayerDraftState preset={this.props.preset}
                                  player={ModelPlayer.HOST}
                                  name={this.props.nameHost}
                                  key={ModelPlayer.HOST}
                                  simplifiedUI={this.props.simplifiedUI}
                                  userTheme={this.props.userTheme}/>
                <PlayerDraftState preset={this.props.preset}
                                  player={ModelPlayer.GUEST}
                                  name={this.props.nameGuest}
                                  key={ModelPlayer.GUEST}
                                  simplifiedUI={this.props.simplifiedUI}
                                  userTheme={this.props.userTheme}/>
            </div>
        );
    }
}

export default DraftState;
