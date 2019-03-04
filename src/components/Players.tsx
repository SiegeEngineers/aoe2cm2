import * as React from 'react';
import {default as ModelDraft} from '../models/Draft';
import {default as ModelPlayer} from '../models/Player';
import '../pure-min.css'
import '../style2.css'
import Player from "./Player";

interface IProps {
    config: ModelDraft;
}

class Players extends React.Component<IProps, object> {
    public render() {
        return (
            <div className="pure-g players">
                <Player preset={this.props.config.preset} player={ModelPlayer.HOST} name={this.props.config.nameHost}/>
                <Player preset={this.props.config.preset} player={ModelPlayer.GUEST} name={this.props.config.nameGuest}/>

                <div className="hidden">
                    <span id="drafter_msg_host_captain">Host Captain</span>
                    <span id="drafter_msg_guest_captain">Guest Captain</span>
                </div>
            </div>
        );
    }
}

export default Players;
