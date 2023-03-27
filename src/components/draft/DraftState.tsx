import * as React from 'react';
import {default as ModelPlayer} from '../../constants/Player';
import PlayerDraftState from "../../containers/PlayerDraftState";
import Preset from "../../models/Preset";
import AdminDraftState from "../../containers/AdminDraftState";

interface IProps {
    nameHost: string;
    nameGuest: string;
    preset: Preset;
    flipped: boolean;
    smooch: boolean;
    simplifiedUI: boolean;
}

class DraftState extends React.Component<IProps, object> {
    public render() {
        return (<>
                <div className="columns is-mobile player-panels">
                    <PlayerDraftState preset={this.props.preset}
                                      player={ModelPlayer.HOST}
                                      name={this.props.nameHost}
                                      key={ModelPlayer.HOST}
                                      flipped={this.props.flipped}
                                      smooch={this.props.smooch}
                                      simplifiedUI={this.props.simplifiedUI}/>
                    <PlayerDraftState preset={this.props.preset}
                                      player={ModelPlayer.GUEST}
                                      name={this.props.nameGuest}
                                      key={ModelPlayer.GUEST}
                                      flipped={this.props.flipped}
                                      smooch={this.props.smooch}
                                      simplifiedUI={this.props.simplifiedUI}/>
                </div>
                <div className="columns is-mobile player-panels">
                    <AdminDraftState preset={this.props.preset}
                                     player={ModelPlayer.NONE}
                                     name={'Admin'}
                                     key={'Admin'}
                                     flipped={this.props.flipped}
                                     smooch={this.props.smooch}
                                     simplifiedUI={this.props.simplifiedUI}/>
                </div>
            </>
        );
    }
}

export default DraftState;
