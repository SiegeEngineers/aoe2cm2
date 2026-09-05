import Draft from '../components/draft/Draft';
import * as actions from '../actions/';
import {ApplicationState, ICountdownValues} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import Preset from "../models/Preset";
import Player from "../constants/Player";
import {DraftEvent} from "../types/DraftEvent";
import {IDraftConfig} from "../types/IDraftConfig";
import {default as ModelAction} from "../constants/Action";

export function mapStateToProps(state: ApplicationState) {
    return {
        events: state.draft.events,
        nameGuest: state.draft.nameGuest as string,
        nameHost: state.draft.nameHost as string,
        hostConnected: state.draft.hostConnected,
        guestConnected: state.draft.guestConnected,
        nextAction: state.ownProperties.nextAction,
        preset: state.draft.preset as Preset,
        whoAmI: state.ownProperties.whoAmI as Player,
        ownName: state.ownProperties.ownName,
        replayEvents: state.replay.events,
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
        onSetNameGuestAction: (name: string) => dispatch(actions.connectPlayer(Player.GUEST, name)),
        onSetNameHostAction: (name: string) => dispatch(actions.connectPlayer(Player.HOST, name)),
        triggerConnect: () => dispatch(actions.connect()),
        triggerSetRole: (name: string, role: Player) => dispatch(actions.setRole(name, role)),
        triggerDisconnect: () => dispatch(actions.disconnect()),
        showNameModal: () => dispatch(actions.showNameModal()),
        showRoleModal: () => dispatch(actions.showRoleModal()),
        setOwnRole: (role: Player) => dispatch(actions.setOwnRole(role)),
        setCountdownValue: (values: ICountdownValues) => dispatch(actions.setCountdownValue(values)),
        setEvents: (value: { player: Player, action: ModelAction, events: DraftEvent[] }) => dispatch(actions.setEvents(value)),
        act: (value: DraftEvent) => dispatch(actions.act(value)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Draft);
