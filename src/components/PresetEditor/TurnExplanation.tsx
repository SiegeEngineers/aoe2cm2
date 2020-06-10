import * as React from "react";
import {withTranslation} from "react-i18next";

const TurnExplanation = () =>
    <div className="pure-g">
        <div className="pure-u-1-6"/>
        <div className="pure-u-2-3">
            <h3>Help</h3>

            <p>Presets are made up by individual Turns. Each turn has an acting player: The Host, the Guest, or neither
                of those, (so called "Admin" turns).</p>

            <p>You can add a Host/Admin/Guest turn by clicking the + button below the respective column.
                You can remove a turn by clicking the X button to the right of the turn.</p>

            <h4>Host and Guest Turns</h4>

            <p>Turns have a main action (PICK, BAN, SNIPE) and a few possible modifiers.</p>

            <p>A <code>PICK</code> adds a usable civilisation for a player.<br/>
                A <code>GLOBAL</code> PICK prevents either player from picking the civilisation again in a future turn.<br/>
                An <code>EXCLUSIVE</code> PICK prevents only the picking player from picking the civilisation again in a
                future turn.<br/>
                A <code>NONEXCLUSIVE</code> PICK does neither of those things, meaning players are still able to pick
                the civilisation again in a future turn.
            </p>

            <p>A <code>BAN</code> marks civilisation as not available for future turns.<br/>
                A <code>GLOBAL</code> BAN prevents either player from picking the civilisation in a future turn.<br/>
                An <code>EXCLUSIVE</code> BAN prevents only the opponent from picking the civilisation in a
                future turn and the player from banning the civilisation again in a future turn.<br/>
                <span style={{color: '#666'}}>A <code>NONEXCLUSIVE</code> BAN prevents only the opponent from picking
                    the civilisation in a future turn, and the player may ban the the civilisation again in a future
                    turn, which makes no sense, so you probably want to use <code>EXCLUSIVE</code> instead anyway.</span>
            </p>

            <p>A <code>SNIPE</code> allows a player to remove a civilisation again which the opponent has picked in a
                previous turn. The GLOBAL, EXCLUSIVE and NONEXCLUSIVE modifiers have no meaning here.</p>

            <p>If you want the players to execute two of their turns in parallel, check
                the <code>parallel</code> checkbox of the <b>first</b> of those two turns (but do not check it for the
                second turn).</p>

            <p>Check the <code>hidden</code> checkbox to hide the civilisation selected during that turn from the
                opponent and from spectators until it is revealed by an admin turn (see below)</p>

            <h4>Admin Turns</h4>

            <p>The <code>REVEAL_PICKS</code>, <code>REVEAL_BANS</code> and <code>REVEAL_SNIPES</code> turns reveal the
                respective hidden actions that were executed before.<br/>
                <code>REVEAL_ALL</code> reveals all hidden actions that were executed before.</p>
        </div>
        <div className="pure-u-1-6"/>
    </div>
;

export default withTranslation()(TurnExplanation);