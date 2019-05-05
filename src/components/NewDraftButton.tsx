import * as React from 'react';
import {Redirect} from "react-router";
import Preset from "../models/Preset";
import '../pure-min.css'
import '../style2.css'

interface IProps {
    label: string;
}

interface IState {
    draftId?: string;
}

class NewDraftButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {};
    }


    public render() {

        if (this.state.draftId !== undefined) {
            const draftId = this.state.draftId;
            return (<Redirect to={`/draft/${draftId}`}/>);
        }

        return (
            <button className="shadowbutton text-primary" onClick={this.createNewDefaultDraft}>
                {this.props.label}
            </button>
        );


    }

    private createNewDefaultDraft = () => {
        const request = new XMLHttpRequest();
        request.open('POST', '/preset/new', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                const result = JSON.parse(request.responseText);
                console.log('createNewDefaultDraft', result);
                this.setState({...this.state, draftId: result.draftId});
            }
        };
        request.send(JSON.stringify({preset: Preset.SIMPLE}));
    };
}

export default NewDraftButton;
