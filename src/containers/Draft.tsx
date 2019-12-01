import Draft from '../components/draft/Draft';
import * as actions from '../actions/';
import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import Preset from "../models/Preset";
import Player from "../constants/Player";
import {DraftEvent} from "../types/DraftEvent";
import {IDraftConfig} from "../types/IDraftConfig";

export function mapStateToProps(state: ApplicationState) {
    return {
        events: state.draft.events,
        nameGuest: state.draft.nameGuest as string,
        nameHost: state.draft.nameHost as string,
        nextAction: state.ownProperties.nextAction,
        preset: state.draft.preset as Preset,
        whoAmI: state.ownProperties.whoAmI as Player,
        ownName: state.ownProperties.ownName
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onActionCompleted: (draftEvent: DraftEvent) => {
            dispatch(actions.act(draftEvent));
        },
        onDraftConfig: (config: IDraftConfig) => {
            dispatch(actions.applyConfig(config));
        },
        onSetNameGuestAction: (name: string) => dispatch(actions.setName(Player.GUEST, name)),
        onSetNameHostAction: (name: string) => dispatch(actions.setName(Player.HOST, name)),
        triggerJoin: (name: string) => dispatch(actions.sendJoin(name)),
        triggerDisconnect: () => dispatch(actions.disconnect()),
        showNameModal: () => dispatch(actions.showNameModal())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Draft);
