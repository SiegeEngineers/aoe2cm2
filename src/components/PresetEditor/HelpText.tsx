import * as React from "react";
import {Trans, withTranslation} from "react-i18next";
import TurnTag from "../draft/TurnTag";
import {default as ModelTurn} from "../../models/Turn";
import Player from "../../constants/Player";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";

export const HelpBasics = withTranslation()(() =>
    <>
        <h4><Trans i18nKey='instructions.basics.title'>Basics</Trans></h4>
        <p>
            <Trans i18nKey='instructions.basics.1'>Captains mode is a turn-based civilization picker.
                Each captain can pick and ban civilizations in a predefined order. Bans
                prevent the opponent's captain from picking the civilizations.</Trans>
        </p>
        <p>
            <Trans i18nKey='instructions.basics.2'>For each turn captains have <b>30 seconds</b>. In
                case of timeout a random civilization is picked for the captain or no civilization
                gets banned.</Trans>
        </p>
        <p>
            <Trans i18nKey='instructions.basics.3'>For each turn captains have <b>30 seconds</b>.
                In case of a timeout, a random civilisation is selected for the captain.</Trans>
        </p>
    </>
);

export const HelpHostAndGuestTurns = withTranslation()(() =>
    <>
        <h4><Trans i18nKey='instructions.hostAndGuestTurns.title'>Host and Guest turns</Trans></h4>

        <p><Trans i18nKey='instructions.hostAndGuestTurns.1'>Turns have a main action (
            <span className="tag has-text-weight-bold is-light is-success">PICK</span>,
            <span className="tag has-text-weight-bold is-light is-danger">BAN</span>,
            <span className="tag has-text-weight-bold is-light is-link">SNIPE</span>,
            <span className="tag has-text-weight-bold is-light is-warning">STEAL</span>)
            and a few possible modifiers.</Trans></p>

        <p><Trans i18nKey='instructions.hostAndGuestTurns.2'>A
            <span className="tag has-text-weight-bold is-light is-success">PICK</span>
            adds a usable civilisation for a player.</Trans></p>
        <ul>
            <li><Trans i18nKey='instructions.hostAndGuestTurns.3'>
                A <span className="tag">GLOBAL PICK</span> or <TurnTag turn={new ModelTurn(
                Player.HOST,
                Action.PICK,
                Exclusivity.GLOBAL
            )}/> prevents either player from picking the civilisation again in a future turn.
            </Trans>
            </li>
            <li><Trans i18nKey='instructions.hostAndGuestTurns.4'>
                An <span className="tag">EXCLUSIVE PICK</span> or <TurnTag turn={new ModelTurn(
                Player.HOST,
                Action.PICK,
                Exclusivity.EXCLUSIVE
            )}/> prevents only the picking player from picking the civilisation again in a future turn.
            </Trans>
            </li>
            <li><Trans i18nKey='instructions.hostAndGuestTurns.5'>
                A <span className="tag">NONEXCLUSIVE PICK</span> or <TurnTag turn={new ModelTurn(
                Player.HOST,
                Action.PICK,
                Exclusivity.NONEXCLUSIVE
            )}/> does neither of those things, meaning players are still
                able to pick the civilisation again in a future turn.
            </Trans>
            </li>
        </ul>
        <p><Trans i18nKey='instructions.hostAndGuestTurns.6'>
            A <span className="tag has-text-weight-bold is-light is-danger">BAN</span> marks civilisation as not
            available for future turns.
        </Trans></p>
        <ul>
            <li><Trans i18nKey='instructions.hostAndGuestTurns.7'>A <span className="tag">GLOBAL BAN</span> or
                <TurnTag turn={new ModelTurn(
                    Player.HOST,
                    Action.BAN,
                    Exclusivity.GLOBAL
                )}/> prevents either player from picking the civilisation in a future turn.
            </Trans>
            </li>
            <li><Trans i18nKey='instructions.hostAndGuestTurns.8'>
                An <span className="tag">EXCLUSIVE BAN</span> or <TurnTag turn={new ModelTurn(
                Player.HOST,
                Action.BAN,
                Exclusivity.EXCLUSIVE
            )}/> prevents only the opponent from picking the civilisation in a future turn and the player who banned
                the civilisation from banning the same civilisation again in a future turn.
            </Trans>
            </li>
            <li><Trans i18nKey='instructions.hostAndGuestTurns.9'>
                A <span className="tag">NONEXCLUSIVE BAN</span> or <TurnTag turn={new ModelTurn(
                Player.HOST,
                Action.BAN,
                Exclusivity.NONEXCLUSIVE
            )}/> prevents only the opponent from picking the civilisation in a future turn, and the player may ban the
                the civilisation again in a future turn, which makes no sense, so you probably want to use <span
                className="tag">EXCLUSIVE</span> instead anyway.
            </Trans>
            </li>
        </ul>
        <p><Trans i18nKey='instructions.hostAndGuestTurns.10'>A <TurnTag turn={new ModelTurn(
            Player.HOST,
            Action.SNIPE,
            Exclusivity.GLOBAL
        )}/> allows a player to remove a civilisation again which the opponent has
            picked in a previous turn. The
            <span className="tag">GLOBAL</span>,
            <span className="tag">EXCLUSIVE</span> and
            <span className="tag">NONEXCLUSIVE</span> modifiers have no meaning here.
        </Trans></p>
        <p><Trans i18nKey='instructions.hostAndGuestTurns.11'>A <TurnTag turn={new ModelTurn(
            Player.HOST,
            Action.STEAL,
            Exclusivity.GLOBAL
        )}/> allows a player to remove a civilisation which the opponent has
            picked (or stolen!) in a previous turn, and add it to their own picks. The
            <span className="tag">GLOBAL</span>,
            <span className="tag">EXCLUSIVE</span> and
            <span className="tag">NONEXCLUSIVE</span> modifiers have no meaning here.
        </Trans></p>
    </>
);

export const HelpAdminTurns = withTranslation()(() =>
    <>
        <h4><Trans i18nKey='instructions.adminTurns.title'>Admin Turns</Trans></h4>
        <p><Trans i18nKey='instructions.adminTurns.1'>Admin turns or <TurnTag turn={new ModelTurn(
            Player.NONE,
            Action.REVEAL_ALL,
            Exclusivity.GLOBAL
        )}/> reveals the previous set of actions which were hidden.
        </Trans>
        </p>
        <ul>
            <li><Trans i18nKey='instructions.adminTurns.2'>
                The <span className="tag">REVEAL_PICKS</span>,
                <span className="tag">REVEAL_BANS</span> and
                <span className="tag">REVEAL_SNIPES</span>
                turns reveal the respective hidden actions that were executed before.
            </Trans></li>
            <li><Trans i18nKey='instructions.adminTurns.3'>
                <span className="tag">REVEAL_ALL</span> reveals all hidden actions that were executed before.
            </Trans></li>
        </ul>
    </>
);

export const HelpPresetEditor = withTranslation()(() =>
    <>
        <h4><Trans i18nKey='instructions.presetEditor.title'>Preset Editor</Trans></h4>
        <ul>
            <li><Trans i18nKey='instructions.presetEditor.1'>
                Presets are made up by individual Turns.
            </Trans></li>
            <li><Trans i18nKey='instructions.presetEditor.2'>
                Each turn has an acting player: The Host, the Guest, or neither of those, (so called "Admin" turns).
            </Trans></li>
            <li><Trans i18nKey='instructions.presetEditor.3'>
                You can add a Host/Admin/Guest turn by clicking the <button
                className="button is-small is-valinged-middle">+
                New</button> button below the respective column.
            </Trans></li>
            <li><Trans i18nKey='instructions.presetEditor.4'>
                You can remove a turn by clicking the <button className="delete is-small is-valinged-middle"/>
                button to the right of the turn.
            </Trans></li>
        </ul>
    </>
);

export const HelpPresetModifiers = withTranslation()(() =>
    <>
        <h4><Trans i18nKey='instructions.presetModifiers.title'>Modifiers</Trans></h4>
        <p><Trans i18nKey='instructions.presetModifiers.1'>
            If you want the players to execute two of their turns in parallel, check the <span
            className="tag">PARALLEL</span> checkbox of the <b>first</b> of those two turns (but do not check
            it for the second turn).
        </Trans></p>
        <p><Trans i18nKey='instructions.presetModifiers.2'>
            Check the <span className="tag">HIDDEN</span> checkbox to hide the civilisation selected during that turn
            from the opponent and from spectators until it is revealed by an admin turn (see below).
        </Trans></p>
        <p><Trans i18nKey='instructions.presetModifiers.3'>
            If you check the <span className="tag">AS OPPONENT</span> checkbox, the player will execute the turn on
            behalf of their opponent. This can be used to have players pick civilisations that their opponent will then
            have to use.
        </Trans></p>
    </>
);

export const HelpDraftModifiers = withTranslation()(() =>
    <>
        <h4><Trans i18nKey='instructions.draftModifiers.title'>Modifiers</Trans></h4>
        <p><Trans i18nKey='instructions.draftModifiers.1'>
            A <span className="tag">PARALLEL</span> modifier means both the players to execute their turns in parallel.
            The picks or bans are revealed to the other player and spectators only after both the players have made
            their choices.
        </Trans></p>
        <p><Trans i18nKey='instructions.draftModifiers.2'>
            A <span className="tag">HIDDEN</span> modifier hides the civilisation selected during that turn
            from the opponent and from spectators until it is revealed by an admin turn (see below).
        </Trans></p>
        <p><Trans i18nKey='instructions.draftModifiers.3'>
            A <span className="tag">AS OPPONENT</span> modifier means that the turn is executed by the player on behalf
            of their opponent. This is mainly useful to have a player pick civilisations for their opponent to use.
        </Trans></p>
    </>
);
