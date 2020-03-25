import * as React from 'react';
import Player from '../../constants/Player';
import {WithTranslation} from "react-i18next";

interface IProps extends WithTranslation {
    thisPlayer: Player,
    forPlayer: Player,
    hostConnected: boolean,
    guestConnected: boolean
}

class PlayerOnlineStatus extends React.Component<IProps, object> {

    public render() {
        if (this.props.thisPlayer !== this.props.forPlayer) {
            return null;
        }
        const className = this.isConnected() ? 'greenMarker' : '';
        return (
            <span className={className}> ● </span>
        );
    }

    private isConnected() {
        return this.isHost() && this.props.hostConnected || this.isGuest() && this.props.guestConnected;
    }

    private isGuest() {
        return this.props.thisPlayer === Player.GUEST;
    }

    private isHost() {
        return this.props.thisPlayer === Player.HOST;
    }
}


export default PlayerOnlineStatus;
