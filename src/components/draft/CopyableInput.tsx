import * as React from "react";
import {Trans, WithTranslation, withTranslation} from "react-i18next";

interface IProps extends WithTranslation {
    before?: string;
    content: string;
    length: number;
    size?: string
}

interface IState {
    label: string;
}

class CopyableInput extends React.Component<IProps, IState> {

    state = {label: 'rolemodal.copyLabel'};

    public render() {
        return (
            <React.Fragment>
                <Trans i18nKey={this.props.before}/>
                &nbsp;
                <div className="is-inline-block">
                <div className="field has-addons">
                    <div className="control">
                        {/*<span className={'copyable-input'}>*/}
                        <input className={"input " + this.props.size} disabled={true} readOnly={true} value={this.props.content} size={this.props.length}/>
                    </div>
                    <div className="control">
                        <button className={'button is-light has-background-grey has-text-white-bis ' + this.props.size} onClick={this.copyToClipboard}>
                            <Trans>{this.state.label}</Trans>
                        </button>
                        {/*</span>*/}
                    </div>
                </div>
                </div>
            </React.Fragment>
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