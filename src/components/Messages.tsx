import * as React from 'react';
import '../pure-min.css'
import '../style2.css'

interface IProps {
    message: string
}

class Messages extends React.Component<IProps, object> {
    public render() {
        return (
            <div>
                <div id="action-text" className="centered">
                    <div className="action-string info-card text-primary">
                        {this.props.message}
                    </div>
                    <div className="hidden">
                        <span id="action_msg_error_update">Error updating the draft state.</span>
                        <span id="action_msg_error_sending_ready">Error sending ready.</span>
                        <span id="action_msg_error_starting">Error starting draft.</span>
                        <span id="action_msg_error_pic_ban">Error picking/banning civ.</span>
                        <span id="action_msg_error_set_name">Error setting name.</span>
                        <span id="action_msg_text_0"><span
                            className='green-glow'><b>Pick</b></span> a civilization!</span>
                        <span id="action_msg_text_1"><span className='red-glow'><b>Ban</b></span> a civilization for the enemy!</span>
                        <span id="action_msg_too_late_random">Too late. Random pick.</span>
                        <span id="action_msg_draft_ended">Drafting ended.</span>
                        <span
                            id="action_msg_paste_code">Please paste this code into in-game chat: {0} for spectating later.</span>
                        <span id="action_msg_use_code">Use this code: {0} to spectate later.</span>
                        <span id="action_msg_ready_msg">Click {0} to let the host start the draft.</span>
                        <span id="action_msg_ready">Ready</span>
                        <span id="action_msg_get_ready">get ready!</span>
                        <span id="action_msg_waiting_guest">Waiting for the guest captain to get ready.</span>
                        <span id="action_msg_waiting_host">Waiting for the host captain to start the draft.</span>
                        <span id="action_msg_guest_ready">Guest is ready.</span>
                        <span id="action_msg_send_code">Send this code to spectators: {0}. </span>
                        <span id="action_msg_click_to_begin">Click {0} to begin.</span>
                        <span id="action_msg_start">Start</span>
                        <span id="action_msg_starting_draft_countdown">Starting draft in... {0}</span>
                        <span id="action_msg_waiting_other">Waiting for the other captain... {0}</span>
                        <span id="action_msg_starting_spectating">Starting spectating in... {0}</span>
                    </div>

                </div>

                <div id="action-message" className="centered">
                    <div className="info-card text-primary">emptyy</div>
                </div>
                <div className="hidden">
                    <span id="action_msg_data_connection_issues">Data connection issues.</span>
                </div>
            </div>
        );
    }
}

export default Messages;
