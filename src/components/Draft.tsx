import * as React from "react";
import * as io from "socket.io-client"
import {default as ModelDraft} from '../models/Draft'
import '../pure-min.css'
import '../style2.css'
import CivGrid from "./CivGrid";
import Messages from "./Messages";
import Players from "./Players";
import TurnRow from "./TurnRow";

interface IProps {
    config: ModelDraft;
}

class Draft extends React.Component<IProps, object> {
    private socket = io("http://localhost:3000/gQkQ");

    public render() {
        const presetName: string = this.props.config.preset.name;
        const turns = this.props.config.preset.turns;


        this.socket.on("player_joined", (data:any) => {
            alert(JSON.stringify(data));
        });

        return (
            <div className="draft-content">

                <button onClick={this.talk}>click me</button>

                <div id="draft-title" className="centered text-primary info-card">{presetName}</div>

                <TurnRow turns={turns}/>

                <Players config={this.props.config}/>

                <Messages/>

                <CivGrid/>

            </div>
        );
    }

    private talk = () => {
        this.socket.emit("join", {"name":"Joyful Joan"});
    };

}

export default Draft;