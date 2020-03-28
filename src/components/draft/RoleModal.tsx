import * as React from "react";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import Player from "../../constants/Player";
import CopyableInput from "./CopyableInput";

interface IProps extends WithTranslation {
    visible: boolean;
    setRoleCallback: (role: Player) => void;
    name: string | null;
    hostConnected: boolean;
    guestConnected: boolean;
}

class RoleModal extends React.Component<IProps, object> {

    public render() {
        if (this.props.visible) {
            return (
                <div id="overlay" className="text-primary">
                    <div id="get-role-message">
                        <h2><Trans>rolemodal.header</Trans></h2>
                        <p><Trans>rolemodal.draftUrlCallToAction</Trans></p>

                        <p className={'wide-input'}>
                            <CopyableInput content={window.location.href}/>
                        </p>

                        <p><Trans>rolemodal.spectateUrlCallToAction</Trans></p>

                        <p className={'wide-input'}>
                            <CopyableInput content={window.location.href.replace('/draft/', '/spectate/')}/>
                        </p>

                        <p><Trans>rolemodal.callToAction</Trans></p>
                        <p>
                            <button className='pure-button' onClick={() => {
                                this.props.setRoleCallback(Player.NONE)
                            }}>
                                <div className="role pure-u-1-12">
                                    <div className="box-content visible">
                                        <div className="stretchy-wrapper">
                                            <div className="stretchy-image">
                                                <img src="/images/spectate.png" alt="Spectate"/>
                                            </div>
                                            <div className="stretchy-text"><Trans>rolemodal.role.spectator</Trans></div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                            <button className='pure-button' onClick={() => {
                                this.props.setRoleCallback(Player.HOST)
                            }} disabled={this.props.hostConnected}>
                                <div className="role pure-u-1-12">
                                    <div className="box-content visible">
                                        <div className="stretchy-wrapper">
                                            <div className="stretchy-image">
                                                <img src="/images/host.png" alt="Spectate"/>
                                            </div>
                                            <div className="stretchy-text"><Trans>rolemodal.role.host</Trans></div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                            <button className='pure-button' onClick={() => {
                                this.props.setRoleCallback(Player.GUEST)
                            }} disabled={this.props.guestConnected}>
                                <div className="role pure-u-1-12">
                                    <div className="box-content visible">
                                        <div className="stretchy-wrapper">
                                            <div className="stretchy-image">
                                                <img src="/images/guest.png" alt="Spectate"/>
                                            </div>
                                            <div className="stretchy-text"><Trans>rolemodal.role.guest</Trans></div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </p>
                    </div>
                </div>
            );
        } else {
            return (<div/>);
        }
    }
}

export default withTranslation()(RoleModal);