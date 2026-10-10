import * as React from 'react';
import {default as ModelPlayer} from '../../constants/Player';
import PlayerDraftState from "../../containers/PlayerDraftState";
import Preset from "../../models/Preset";
import AdminDraftState from "../../containers/AdminDraftState";

interface IProps {
    nameHost: string;
    nameGuest: string;
    preset: Preset;
    flipped: boolean;
    smooch: boolean;
    simplifiedUI: boolean;
    /** What goes between the captains: the message line, the replay controls and the options of the pool in play. */
    children?: React.ReactNode;
    /** The draft code, under the admin box, or under the options on a narrower window. */
    draftCode?: React.ReactNode;
}

/**
 * The board of a draft, the same for every preset: the captains either side of the options with the
 * admin box and the draft code under the options, or, on a narrower window, the options and the
 * draft code first and the captains below.
 */
class DraftState extends React.Component<IProps, object> {
    public render() {
        return (
            <div className="draft-board">
                <PlayerDraftState preset={this.props.preset}
                                  player={ModelPlayer.HOST}
                                  name={this.props.nameHost}
                                  key={ModelPlayer.HOST}
                                  flipped={this.props.flipped}
                                  smooch={this.props.smooch}
                                  simplifiedUI={this.props.simplifiedUI}/>
                <div className="draft-board-centre">
                    {this.props.children}
                </div>
                <PlayerDraftState preset={this.props.preset}
                                  player={ModelPlayer.GUEST}
                                  name={this.props.nameGuest}
                                  key={ModelPlayer.GUEST}
                                  flipped={this.props.flipped}
                                  smooch={this.props.smooch}
                                  simplifiedUI={this.props.simplifiedUI}/>
                <AdminDraftState preset={this.props.preset}
                                 player={ModelPlayer.NONE}
                                 name={'Admin'}
                                 key={'Admin'}
                                 flipped={this.props.flipped}
                                 smooch={this.props.smooch}
                                 simplifiedUI={this.props.simplifiedUI}/>
                <div className="draft-board-code">
                    {this.props.draftCode}
                </div>
            </div>
        );
    }
}

export default DraftState;
