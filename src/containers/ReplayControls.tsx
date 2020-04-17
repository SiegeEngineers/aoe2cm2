import * as actions from '../actions/';
import {ApplicationState, ICountdownValues} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import Preset from "../models/Preset";
import Player from "../constants/Player";
import {DraftEvent} from "../types/DraftEvent";
import {default as ModelAction} from "../constants/Action";
import ReplayControls from "../components/draft/ReplayControls";


export function mapStateToProps(state: ApplicationState) {
    return {
        events: state.draft.events,
        nextAction: state.ownProperties.nextAction,
        preset: state.draft.preset as Preset,
        draftEvents: state.draft.events,
        replayEvents: state.replay.events,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        setCountdownValue: (values: ICountdownValues) => dispatch(actions.setCountdownValue(values)),
        setEvents: (value: { player: Player, action: ModelAction, events: DraftEvent[] }) => dispatch(actions.setEvents(value)),
        setDraftEvents: (value: DraftEvent[]) => dispatch(actions.setDraftEvents(value)),
        act: (value:DraftEvent)=>dispatch(actions.act(value)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReplayControls);
