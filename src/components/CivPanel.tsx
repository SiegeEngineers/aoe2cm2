import * as React from 'react';
import ActionType from "../models/ActionType";
import Civilisation from "../models/Civilisation";
import '../pure-min.css'
import '../style2.css'
import PlayerEvent from "../models/PlayerEvent";
import Player from "../models/Player";
import Socket = SocketIOClient.Socket;
import CivPanelType from "../models/CivPanelType";
import {Util} from "../models/Util";

interface IProps {
    civilisation?: Civilisation;
    active: boolean;
    civPanelType: CivPanelType;
    socket?: Socket;
    whoAmI?: Player;
    triggerAction?: ActionType;

    onClickCivilisation?: () => void;
}

class CivPanel extends React.Component<IProps, object> {
    public render() {
        const civilisation: Civilisation | undefined = this.props.civilisation;
        let imageSrc: string = "";
        let civilisationName = '';
        if (civilisation !== undefined) {
            imageSrc = "/images/civs/" + civilisation.name.toLocaleLowerCase() + "_orig.png";
            civilisationName = civilisation.name;
        }
        let className: string = this.props.civPanelType.toString();
        if (this.props.civPanelType === CivPanelType.CHOICE) {
            className += ' pure-u-1-12';
        } else {
            className += ' card';
        }
        if(this.props.active){
            className += " active-choice";
        }
        let contentClass: string = "box-content";
        if (this.props.civilisation !== undefined) {
            contentClass += " visible";
        }
        return (
            <div className={className} onClick={this.onClickCiv}>
                <div className={contentClass}>
                    <div className="stretchy-wrapper">
                        <div className="stretchy-image">
                            <img src={imageSrc} alt={civilisationName}/>
                        </div>
                        <div className="stretchy-text">
                            {civilisationName}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private onClickCiv = () => {
        if (Util.notUndefined(this.props.socket, this.props.civilisation, this.props.whoAmI, this.props.triggerAction)) {
            const socket = this.props.socket as Socket;
            const civilisation = this.props.civilisation as Civilisation;
            const whoAmI = this.props.whoAmI as Player;
            const triggerAction = this.props.triggerAction as ActionType;
            socket.emit('act', new PlayerEvent(whoAmI, triggerAction, civilisation), (data: any) => {
                console.log('act callback', data);
                if (data.status !== 'ok') {
                    alert('Validation(s) failed:\n\n' + JSON.stringify(data.validationErrors));
                }
            });
        }
    }
}

export default CivPanel;
