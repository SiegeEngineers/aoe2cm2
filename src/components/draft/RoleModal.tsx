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
                        <p><Trans>rolemodal.urlCallToAction</Trans></p>

                        <p>
                            <input className={'inset-input'} id='draftUrlInput' value={window.location.href}/>
                            <button className='pure-button' onClick={RoleModal.copyUrlToClipboard}>
                                <Trans>rolemodal.copyLabel</Trans></button>
                        </p>

                        <p><Trans>rolemodal.callToAction</Trans></p>
                        <p>
                            <button className='pure-button' onClick={() => {
                                this.props.setRoleCallback(Player.NONE)
                            }}><Trans>rolemodal.role.spectator</Trans>
                            </button>
                            <button className='pure-button' onClick={() => {
                                this.props.setRoleCallback(Player.HOST)
                            }} disabled={this.props.hostConnected}><Trans>rolemodal.role.host</Trans>
                            </button>
                            <button className='pure-button' onClick={() => {
                                this.props.setRoleCallback(Player.GUEST)
                            }} disabled={this.props.guestConnected}><Trans>rolemodal.role.guest</Trans>
                            </button>
                        </p>
                    </div>
                </div>
            );
        } else {
            return (<div/>);
        }
    }

    private static copyUrlToClipboard() {
        const helper = document.createElement('textarea');
        const draftUrlInput = document.getElementById('draftUrlInput') as HTMLInputElement;
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