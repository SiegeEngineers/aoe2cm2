import * as React from "react";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
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
                <div id="overlay" className="text-primary">
                    <div id="set-name-message">
                        <h2><Trans>modal.header</Trans></h2>
                        <p><Trans>modal.callToAction</Trans></p>
                        <div className='combo-form'>
                            <input id={this.INPUT_CAPTAIN_NAME} type="text" className="inset-input"
                                   defaultValue={nameProposal}/>
                            <button className='contourless-button' onClick={this.newNameProposal}>🔃</button>
                        </div>
                        <p><Trans>modal.editInfo</Trans></p>
                        <span><a onClick={this.callback}><span
                            className="back-icon"><Trans>modal.setName</Trans></span></a></span>
                        <p><Trans>modal.readTheRules</Trans></p>
                    </div>
                </div>
            );
        } else {
            return (<div/>);
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
            const name: string = input.value;
            if (name !== '') {
                this.props.changeNameCallback(name, this.props.role as Player);
            }
        }
    }
}

export default withTranslation()(Modal);