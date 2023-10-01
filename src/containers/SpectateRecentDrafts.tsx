import * as actions from '../actions/';
import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import Spectate from "../components/menu/Spectate";

export function mapStateToProps(state: ApplicationState) {
    return state.recentDrafts
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        specateDrafts: () => dispatch(actions.spectateDrafts()),
        unspectateDrafts: () => dispatch(actions.unspectateDrafts()),
        resetRecentDraftCursor: () => dispatch(actions.resetRecentDraftCursor()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Spectate);
