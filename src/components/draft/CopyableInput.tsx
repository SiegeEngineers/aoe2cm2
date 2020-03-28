import * as React from "react";
import {Trans, WithTranslation, withTranslation} from "react-i18next";

interface IProps extends WithTranslation {
    content: string;
}

interface IState {
    label: string;
}

class CopyableInput extends React.Component<IProps, IState> {

    state = {label: 'rolemodal.copyLabel'};

    public render() {
        return (<span>
                    <input className={'inset-input centered'} value={this.props.content}/>
                    <button className='pure-button' onClick={this.copyToClipboard}>
                        <Trans>{this.state.label}</Trans>
                    </button>
                </span>
        );
    }

    private copyToClipboard = () => {
        const helper = document.createElement('textarea');
        helper.value = this.props.content;
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
        this.setState({label: 'rolemodal.copiedLabel'});
        setTimeout(() => {
            this.setState({label: 'rolemodal.copyLabel'})
        }, 1000);
    }
}

export default withTranslation()(CopyableInput);