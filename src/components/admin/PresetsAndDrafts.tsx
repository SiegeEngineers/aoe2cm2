import * as React from "react";
import {ApplicationState, IPresetAndDraftList} from "../../types";
import DraftList from "./DraftList";
import PresetList from "./PresetList";
import {connect} from "react-redux";
import * as actions from "../../actions";
import {Dispatch} from "redux";

interface Props {
    data?: IPresetAndDraftList
    selectedPreset?: string
}

interface State {
}

class PresetsAndDrafts extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {selectedPreset: undefined};
    }

    public render() {
        if (!this.props.data) {
            return (<progress className="progress is-large is-info" max="100">60%</progress>);
        }
        if (this.props.selectedPreset) {
            if (this.props.data.drafts.hasOwnProperty(this.props.selectedPreset)) {
                return (<DraftList drafts={this.props.data.drafts[this.props.selectedPreset]}
                                   presetTitle={this.props.selectedPreset}/>);
            } else {
                return (<span>No drafts for this name.</span>);
            }
        }
        return (
            <PresetList presets={this.props.data.presets} draftsKeys={Object.keys(this.props.data.drafts)}/>
        );
    }
}


export function mapStateToProps(state: ApplicationState) {
    return {
        selectedPreset: state.admin.presetName,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSetApiKey: (apiKey: string | undefined) => dispatch(actions.setApiKey(apiKey)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresetsAndDrafts);
