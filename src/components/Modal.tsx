import * as React from "react";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import NameGenerator from "../models/NameGenerator";

interface IProps extends WithTranslation {
    visible: boolean;
    currentName: string | null;
    changeNameCallback?: (name: string) => void;
}

class Modal extends React.Component<IProps, object> {

    private readonly INPUT_CAPTAIN_NAME: string = 'input-captain-name';

    public render() {
        const display: string = this.props.visible ? 'block' : 'none';
        let nameProposal = Modal.getNameProposal();
        return (
            <div id="overlay" className="text-primary" style={{display: display}}>
                <div id="set-name-message" style={{display: display}}>
                    <h2><Trans>modal.header</Trans></h2>
                    <p><Trans>modal.callToAction</Trans> <br/>
                        <input id={this.INPUT_CAPTAIN_NAME} type="text" className="inset-input"
                               defaultValue={nameProposal}/>
                        <br/>
                        <Trans>modal.editInfo</Trans></p>
                    <span><a onClick={this.callback}><span
                        className="back-icon"><Trans>modal.setName</Trans></span></a></span>
                    <p><Trans>modal.readTheRules</Trans></p>
                </div>
            </div>
        );
    }

    private static getNameProposal(): string {
        let nameProposal = NameGenerator.getNameFromLocalStorage();
        if (nameProposal === null) {
            return new NameGenerator().nextName();
        }
        return nameProposal;
    }

    private callback = () => {
        if (this.props.changeNameCallback !== undefined) {
            const input: HTMLInputElement = document.getElementById(this.INPUT_CAPTAIN_NAME) as HTMLInputElement;
            const name: string = input.value;
            if (name !== '') {
                this.props.changeNameCallback(name);
            }
        }
    }
}

export default withTranslation()(Modal);