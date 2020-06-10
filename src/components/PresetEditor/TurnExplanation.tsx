import * as React from "react";
import {withTranslation} from "react-i18next";

const TurnExplanation = () =>
    <React.Fragment>
        <h3>Help and Instructions</h3>
        <h4>Basics</h4>
        <ul>
            <li>Presets are made up by individual Turns.</li>
            <li>Each turn has an acting player: The Host, the Guest, or neither of those, (so called "Admin" turns).
            </li>
            <li>You can add a Host/Admin/Guest turn by clicking the <button className="button is-small">+
                New</button> button below the respective column.
            </li>
            <li>You can remove a turn by clicking the <button className="delete is-small"/> button to the right of the
                turn.
            </li>
        </ul>

        <h4>Host and Guest turns</h4>

        <p>Turns have a main action (<span className="tag has-text-weight-bold is-light is-success">PICK</span>, <span className="tag has-text-weight-bold is-light is-danger">BAN</span>, <span className="tag has-text-weight-bold is-light is-link">SNIPE</span>) and a few possible modifiers.</p>
        <p>A <span className="tag has-text-weight-bold is-light is-success">PICK</span> adds a usable civilisation for a player.</p>
        <ul>
            <li>A <span className="tag">GLOBAL PICK</span> or <div className="tags has-addons"><span
                className="tag has-text-weight-bold is-success">G</span><span className="tag has-text-weight-bold is-success is-light">PICK</span></div> prevents
                either player from picking the civilisation again in
                a future turn.
            </li>
            <li>An <span className="tag">EXCLUSIVE PICK</span> or <div className="tags has-addons"><span
                className="tag has-text-weight-bold is-success">E</span><span className="tag has-text-weight-bold is-success is-light">PICK</span></div>prevents
                only the picking player from picking the
                civilisation again in a future turn.
            </li>
            <li>A <span className="tag">NONEXCLUSIVE PICK</span> or <div className="tags has-addons"><span
                className="tag has-text-weight-bold is-success">N</span><span className="tag has-text-weight-bold is-success is-light">PICK</span></div>does
                neither of those things, meaning players are still
                able to pick the civilisation again in a future turn.
            </li>
        </ul>
        <p>A <span className="tag has-text-weight-bold is-light is-danger">BAN</span> marks civilisation as not available for future turns.</p>
        <ul>
            <li>A <span className="tag">GLOBAL BAN</span> or <div className="tags has-addons"><span
                className="tag has-text-weight-bold is-danger">G</span><span className="tag has-text-weight-bold is-danger is-light">BAN</span></div>&nbsp;
                prevents either player from picking the civilisation in a future turn.
            </li>
            <li>An <span className="tag">EXCLUSIVE BAN</span> or <div className="tags has-addons"><span
                className="tag has-text-weight-bold is-danger">E</span><span className="tag has-text-weight-bold is-danger is-light">BAN</span></div>&nbsp;
                prevents only the opponent from picking the civilisation in a future turn and the player from banning
                the civilisation again in a future turn.
            </li>
            <li>A <span className="tag">NONEXCLUSIVE BAN</span> or <div className="tags has-addons"><span
                className="tag has-text-weight-bold is-danger">N</span><span className="tag has-text-weight-bold is-danger is-light">BAN</span></div>&nbsp;
                prevents only the opponent from picking the civilisation in a future turn, and the player may ban the
                the civilisation again in a future turn, which makes no sense, so you probably want to use <span
                    className="tag">EXCLUSIVE</span> instead anyway.
            </li>
        </ul>
        <p>A <span className="tag has-text-weight-bold is-light is-link">SNIPE</span> allows a player to remove a civilisation again which the opponent has
            picked in a previous turn. The GLOBAL, EXCLUSIVE and NONEXCLUSIVE modifiers have no meaning here.</p>

        <h5>Modifiers</h5>
        <p>If you want the players to execute two of their turns in parallel, check the <span
            className="tag">PARALLEL</span> checkbox of the <b>first</b> of those two turns (but do not check
            it for the second turn).</p>
        <p>Check the <span className="tag">HIDDEN</span> checkbox to hide the civilisation selected during that turn
            from the opponent and from spectators until it is revealed by an admin turn (see below)</p>

        <h4>Admin Turns</h4>

        <p>The <span className="tag">REVEAL_PICKS</span>, <span className="tag">REVEAL_BANS</span> and <span
            className="tag">REVEAL_SNIPES</span> turns reveal the
            respective hidden actions that were executed before.<br/>
            <span className="tag">REVEAL_ALL</span> reveals all hidden actions that were executed before.
        </p>
    </React.Fragment>
;

export default withTranslation()(TurnExplanation);