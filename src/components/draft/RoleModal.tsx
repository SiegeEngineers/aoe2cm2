import * as React from "react";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import Player from "../../constants/Player";

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

                        <p>
                            <input className={'inset-input'} id='draftUrlInput' value={window.location.href}/>
                            <button className='pure-button' onClick={RoleModal.copyDraftUrlToClipboard}>
                                <Trans>rolemodal.copyLabel</Trans></button>
                        </p>

                        <p><Trans>rolemodal.spectateUrlCallToAction</Trans></p>

                        <p>
                            <input className={'inset-input'} id='spectateUrlInput'
                                   value={window.location.href.replace('/draft/', '/spectate/')}/>
                            <button className='pure-button' onClick={RoleModal.copySpectateUrlToClipboard}>
                                <Trans>rolemodal.copyLabel</Trans></button>
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

    private static copyDraftUrlToClipboard() {
        RoleModal.copyUrlToClipboard('draftUrlInput');
    }

    private static copySpectateUrlToClipboard() {
        RoleModal.copyUrlToClipboard('spectateUrlInput');
    }

    private static copyUrlToClipboard(elementId: string) {
        const helper = document.createElement('textarea');
        const draftUrlInput = document.getElementById(elementId) as HTMLInputElement;
        helper.value = draftUrlInput.value;
        helper.setAttribute('readonly', '');
        helper.style.position = 'absolute';
        helper.style.left = '-9999px';
        document.body.appendChild(helper);
        let selection = document.getSelection();
        let selected;
        if (selection !== null) {
            selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : undefined;
        }
        helper.select();
        document.execCommand('copy');
        selection = document.getSelection();
        if (selection !== null && selected !== undefined) {
            selection.removeAllRanges();
            selection.addRange(selected);
        }
    }
}

export default withTranslation()(RoleModal);