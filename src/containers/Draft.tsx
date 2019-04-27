import Draft from '../components/Draft';
import * as actions from '../actions/';
import {IStoreState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import Preset from "../models/Preset";
import Player from "../models/Player";
import {DraftEvent} from "../models/DraftEvent";
import {IDraftConfig} from "../models/IDraftConfig";

export function mapStateToProps({nameHost, nameGuest, whoAmI, ownName, preset, nextAction, events}: IStoreState) {
    return {
        events,
        nameGuest: nameGuest as string,
        nameHost: nameHost as string,
        nextAction,
        preset: preset as Preset,
        whoAmI: whoAmI as Player,
        ownName
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
        triggerDisconnect: () => dispatch(actions.disconnect())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Draft);
