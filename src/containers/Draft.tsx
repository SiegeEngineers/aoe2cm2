import Draft from '../components/Draft';
import * as actions from '../actions/';
import {IStoreState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import Player from "../models/Player";
import {DraftEvent} from "../models/DraftEvent";
import {IDraftConfig} from "../models/IDraftConfig";

export function mapStateToProps({nameHost, nameGuest, whoAmI, preset, nextAction, events}: IStoreState) {
    return {
        events,
        nameGuest,
        nameHost,
        nextAction,
        preset,
        whoAmI
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
        triggerJoin: (name:string) => dispatch(actions.sendJoin(name))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Draft);