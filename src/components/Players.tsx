import * as React from 'react';
import {default as ModelPlayer} from '../models/Player';
import '../pure-min.css'
import '../style2.css'
import Player from "./Player";
import Preset from "../models/Preset";

interface IProps {
    nameHost: string;
    nameGuest: string;
    preset: Preset;
}

class Players extends React.Component<IProps, object> {
    public render() {
        return (
            <div className="pure-g players">
                <Player preset={this.props.preset} player={ModelPlayer.HOST} name={this.props.nameHost}/>
                <Player preset={this.props.preset} player={ModelPlayer.GUEST} name={this.props.nameGuest}/>

                <div className="hidden">
                    <span id="drafter_msg_host_captain">Host Captain</span>
                    <span id="drafter_msg_guest_captain">Guest Captain</span>
                </div>
            </div>
        );
    }
}

export default Players;
