import * as React from 'react';
import ActionType from "../models/ActionType";
import Civilisation from "../models/Civilisation";
import '../pure-min.css'
import '../style2.css'
import PlayerEvent from "../models/PlayerEvent";
import Player from "../models/Player";
import Socket = SocketIOClient.Socket;

interface IProps {
    civilisation?: Civilisation;
    active: boolean;
    actionType: ActionType;
    socket?: Socket;
    whoAmI?: Player;

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
        let className: string = this.props.actionType.toString();
        if (this.props.actionType === ActionType.CHOICE) {
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
                            <img src={imageSrc}/>
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
        if (this.props.socket !== undefined && this.props.civilisation !== undefined && this.props.whoAmI !== undefined) {
            const socket = this.props.socket as Socket;
            const civilisation = this.props.civilisation as Civilisation;
            const whoAmI = this.props.whoAmI as Player;
            socket.emit('act', new PlayerEvent(whoAmI, ActionType.PICK, civilisation));
        }
    }
}


export default CivPanel;

