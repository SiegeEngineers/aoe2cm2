import * as React from 'react';
import '../pure-min.css'
import '../style2.css'
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import Countdown from "../containers/Countdown";
import Player from "../models/Player";
import Turn from "../models/Turn";
import Action from "../models/Action";

interface IProps extends WithTranslation {
    whoAmI: Player | undefined,
    hostReady: boolean,
    guestReady: boolean,
    nextTurn: Turn | null;
    message: string
}

class Messages extends React.Component<IProps, object> {
    public render() {

        if (!this.props.hostReady || !this.props.guestReady) {
            if (this.props.whoAmI === Player.HOST) {
                if (this.props.hostReady) {
                    return (
                        <div><Trans>Waiting for Guest to press ›ready‹</Trans></div>
                    );
                } else {
                    if (this.props.guestReady) {
                        return (
                            <div><Trans>Your guest is ready to start. Press [ready] once you are also ready to
                                start!</Trans></div>
                        );
                    } else {
                        return (
                            <div><Trans>Press [ready] once you are ready to start!</Trans></div>
                        );
                    }
                }
            } else {
                if (this.props.guestReady) {
                    return (
                        <div><Trans>Waiting for Host to press ›ready‹</Trans></div>
                    );
                } else {
                    if (this.props.hostReady) {
                        return (
                            <div><Trans>Your host is ready to start. Press [ready] once you are also ready to
                                start!</Trans></div>
                        );
                    } else {
                        return (
                            <div><Trans>Press [ready] once you are ready to start!</Trans></div>
                        );
                    }
                }

            }
        }

        const nextTurn = this.props.nextTurn;
        if (nextTurn !== null) {
            if (nextTurn.player === this.props.whoAmI) {
                switch (nextTurn.action) {
                    case Action.PICK:
                        return (
                            <div><Trans><span className='green-glow'><b>Pick</b></span> a civilization!</Trans>
                                <Countdown/></div>
                        );
                    case Action.BAN:
                        return (
                            <div><Trans><span className='red-glow'><b>Ban</b></span> a civilization!</Trans>
                                <Countdown/></div>
                        );
                    case Action.SNIPE:
                        return (
                            <div><Trans><span className='yellow-glow'><b>Snipe</b></span> a civilization of the
                                opponent!</Trans> <Countdown/></div>
                        );
                }
            } else if (nextTurn.player === Player.NONE) {
                const action = nextTurn.action.toString();
                return (
                    <div><Trans>Admin action: {action}</Trans></div>
                );
            } else {
                switch (nextTurn.action) {
                    case Action.PICK:
                        return (
                            <div><Trans>Waiting for the other captain to pick…</Trans> <Countdown/></div>
                        );
                    case Action.BAN:
                        return (
                            <div><Trans>Waiting for the other captain to ban…</Trans> <Countdown/></div>
                        );
                    case Action.SNIPE:
                        return (
                            <div><Trans>Waiting for the other captain to snipe one of your civilisations…</Trans>
                                <Countdown/></div>
                        );
                }
            }


            const message = nextTurn.player.toString() + ': ' + nextTurn.action.toString();
            return (
                <div><Trans>{message}</Trans></div>
            );
        }

        return (
            <div><Trans>{this.props.message}</Trans> <Countdown/></div>
        );
    }
}

export default withTranslation()(Messages);
