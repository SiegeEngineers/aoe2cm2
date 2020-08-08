import * as React from "react";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import LoopIcon from "mdi-react/LoopIcon";
import NameGenerator from "../../util/NameGenerator";
import Player from "../../constants/Player";

interface IProps extends WithTranslation {
    visible: boolean;
    currentName: string | null;
    inDraft: boolean;
    role: Player | undefined,
    changeNameCallback?: (name: string, role: Player) => void;
}

class Modal extends React.Component<IProps, object> {

    private readonly INPUT_CAPTAIN_NAME: string = 'input-captain-name';

    public render() {
        let nameProposal = Modal.getNameProposal();
        if (this.props.visible) {
            return (
                <div id="overlay" className="modal is-active">
                    <div className="modal-background"/>
                    <div id="set-name-message" className="modal-content">
                        <div className="box content">
                            <h3><Trans>modal.header</Trans></h3>
                            <p><Trans>modal.callToAction</Trans></p>
                            <div className="field is-grouped">
                                <div className="field has-addons control">
                                    <div className="control">
                                        <input id={this.INPUT_CAPTAIN_NAME} type="text"
                                               placeholder={this.props.t('modal.captainName')}
                                               className="input" defaultValue={nameProposal}/>
                                    </div>
                                    <div className="control">
                                        <button className='button has-tooltip-bottom has-tooltip-arrow'
                                                onClick={this.newNameProposal}
                                                aria-label={this.props.t('modal.randomizeName')}
                                                data-tooltip={this.props.t('modal.randomizeName')}>
                                            <LoopIcon />
                                        </button>
                                    </div>
                                </div>
                                <div className="control">
                                    <button className="button is-link" onClick={this.callback}>
                                        <Trans>modal.setName</Trans>
                                    </button>
                                </div>
                            </div>
                            <p className="has-text-grey-light">
                                <Trans>modal.editInfo</Trans><br/>
                                <Trans>modal.readTheRules</Trans>
                            </p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<React.Fragment/>);
        }
    }

    private static getNameProposal(): string {
        let nameProposal = NameGenerator.getNameFromLocalStorage();
        if (nameProposal === null) {
            return new NameGenerator().nextName();
        }
        return nameProposal;
    }

    private newNameProposal = () => {
        const input: HTMLInputElement = document.getElementById(this.INPUT_CAPTAIN_NAME) as HTMLInputElement;
        input.value = new NameGenerator().nextName();
    };

    private callback = () => {
        if (this.props.changeNameCallback !== undefined) {
            const input: HTMLInputElement = document.getElementById(this.INPUT_CAPTAIN_NAME) as HTMLInputElement;
            const name: string = input.value.trim();
            if (name !== '') {
                this.props.changeNameCallback(name, this.props.role as Player);
            } else {
                input.classList.add('is-danger');
            }
        }
    }
}

export default withTranslation()(Modal);
