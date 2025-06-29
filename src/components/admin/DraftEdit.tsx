import * as React from "react";
import {ApplicationState} from "../../types";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {Util} from "../../util/Util";
import {Link} from "react-router-dom";

interface Props {
    apiKey: string | undefined
    onSetApiKey: (apiKey: string | undefined) => void
}

interface State {
    draftId: string,
    content: string,
}

class DraftEdit extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {draftId: '', content: ''};
    }

    private async fetchDraftJson() {
        return fetch('/api/draft/' + this.state.draftId)
            .then((result) => {
                if (result.ok) {
                    return result.json();
                } else if (result.status === 404) {
                    return Promise.resolve(["Draft not found"]);
                } else {
                    this.props.onSetApiKey(undefined);
                    return Promise.reject('Authorization failed');
                }
            })
            .then((json) => {
                const content = JSON.stringify(json, null, 2);
                this.setState({content})
            });
    }

    private async saveDraft() {
        fetch('/api/draft/' + this.state.draftId, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Auth-Token': this.props.apiKey as string,
            },
            body: this.state.content,
            method: 'post'
        })
            .then((result) => {
                if (result.ok) {
                    alert('Saved!');
                } else {
                    alert('Error ' + result.status + ': ' + result.statusText);
                }
            });
    }


    componentDidMount() {
        let draftId = Util.getDraftIdForEditFromUrl();
        document.title = 'Edit Draft ' + draftId + ' – AoE Captains Mode';
        this.setState({draftId}, () => this.fetchDraftJson());
    }

    public render() {
        return (
            <div className={'content box'}>
                <h3>Edit Draft »{this.state.draftId}«</h3>
                <p><Link to={'/admin/'}>« Back to Admin</Link></p>
                <textarea className="textarea" placeholder="…" id="draftContent" rows={30}
                          value={this.state.content}
                          onChange={(event) => {
                              this.setState({
                                  content: event.target.value
                              });
                          }}
                ></textarea>
                <button className={'button'} onClick={() => this.saveDraft()}>Save Draft</button>
            </div>
        );
    }

}

export function mapStateToProps(state: ApplicationState) {
    return {
        apiKey: state.admin.apiKey,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSetApiKey: (apiKey: string | undefined) => dispatch(actions.setApiKey(apiKey)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DraftEdit);
