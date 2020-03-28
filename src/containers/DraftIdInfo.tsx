import * as actions from '../actions/';
import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import Preset from "../models/Preset";
import DraftIdInfo from "../components/draft/DraftIdInfo";

export function mapStateToProps(state: ApplicationState) {
    return {
        nextAction: state.ownProperties.nextAction,
        preset: state.draft.preset as Preset,
        hostReady: state.draft.hostReady,
        guestReady: state.draft.guestReady,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(DraftIdInfo);
