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
                <div id="overlay" className="modal is-active">
                    <div className="modal-background"/>
                    <div id="get-role-message" className="modal-content">
                        <div className="box content">
                            <h2><Trans>rolemodal.header</Trans></h2>
                            <p><Trans>rolemodal.callToAction</Trans></p>
                            <div className="buttons">
                                <button className="role-button button is-light" onClick={() => {
                                    this.props.setRoleCallback(Player.HOST)
                                }} disabled={this.props.hostConnected}>
                                    <div className="role">
                                        <div className="box-content is-visible">
                                            <div className="stretchy-wrapper">
                                                <div className="stretchy-image">
                                                    <img src="/images/role_host.png" alt="Spectate"/>
                                                </div>
                                                <div className="stretchy-text"><Trans>rolemodal.role.host</Trans></div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                                <button className="role-button button is-light" onClick={() => {
                                    this.props.setRoleCallback(Player.GUEST)
                                }} disabled={this.props.guestConnected}>
                                    <div className="role">
                                        <div className="box-content is-visible">
                                            <div className="stretchy-wrapper">
                                                <div className="stretchy-image">
                                                    <img src="/images/role_guest.png" alt="Spectate"/>
                                                </div>
                                                <div className="stretchy-text"><Trans>rolemodal.role.guest</Trans></div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                                <button className="role-button button is-light" onClick={() => {
                                    this.props.setRoleCallback(Player.NONE)
                                }}>
                                    <div className="role">
                                        <div className="box-content is-visible">
                                            <div className="stretchy-wrapper">
                                                <div className="stretchy-image">
                                                    <img src="/images/role_spectate.png" alt="Spectate"/>
                                                </div>
                                                <div className="stretchy-text"><Trans>rolemodal.role.spectator</Trans>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                            <hr/>
                            <p><Trans>rolemodal.draftUrlCallToAction</Trans></p>
                            <div>
                                <CopyableInput content={window.location.href} length={45}/>
                            </div>

                            <p><Trans>rolemodal.spectateUrlCallToAction</Trans></p>
                            <div>
                                <CopyableInput content={window.location.href.replace('/draft/', '/spectate/')} length={45}/>
                            </div>

                        </div>
                    </div>
                </div>
            );
        } else {
            return (<React.Fragment/>);
        }
    }
}

export default withTranslation()(RoleModal);