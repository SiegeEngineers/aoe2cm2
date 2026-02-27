import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import * as actions from "../actions";
import PrivateDraftWarning from "../components/draft/PrivateDraftWarning";


export function mapStateToProps(state: ApplicationState) {
    return {
        display: state.draft.private
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>, ownProps: any) {
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateDraftWarning);
