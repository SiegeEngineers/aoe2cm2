import * as React from "react";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import Player from "../../constants/Player";
import CopyableInput from "./CopyableInput";
import {RouteComponentProps} from "react-router";
import {withRouter} from "react-router-dom";

interface IProps extends WithTranslation, RouteComponentProps<any> {
    visible: boolean;
    setRoleCallback: (role: Player) => void;
    name: string | null;
    hostConnected: boolean;
    guestConnected: boolean;
}

class RoleModal extends React.Component<IProps, object> {

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<object>, snapshot?: any) {
        if (this.props.visible) {
            let query = new URLSearchParams(this.props.location.search);
            const asHost = query.get('as') === 'host' || false;
            const asGuest = query.get('as') === 'guest' || false;
            if (!this.props.hostConnected && asHost) {
                this.deleteAsFromParams(query);
                this.props.setRoleCallback(Player.HOST);
            }
            if (!this.props.guestConnected && asGuest) {
                this.deleteAsFromParams(query);
                this.props.setRoleCallback(Player.GUEST);
            }
        }
    }

    private deleteAsFromParams(query: URLSearchParams) {
        query.delete('as');
        this.props.history.replace({
            search: query.toString()
        });
    }

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
                                                    <img src="/images/role_host.png" alt="Host"/>
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
                                                    <img src="/images/role_guest.png" alt="Guest"/>
                                                </div>
                                                <div className="stretchy-text"><Trans>rolemodal.role.guest</Trans></div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                                <button className="role-button button is-light" onClick={() => {
                                    this.props.setRoleCallback(Player.SPEC)
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
                                <CopyableInput content={window.location.href.replace('/draft/', '/spectate/')}
                                               length={45}/>
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

export default withTranslation()(withRouter(RoleModal));