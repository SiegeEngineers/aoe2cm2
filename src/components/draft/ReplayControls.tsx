import * as React from "react";
import Preset from "../../models/Preset";
import "../../types/DraftEvent";
import {WithTranslation, withTranslation} from "react-i18next";
import {Util} from "../../util/Util";
import Player from "../../constants/Player";
import {DraftEvent} from "../../types/DraftEvent";
import {ICountdownValues} from "../../types";
import {default as ModelAction} from "../../constants/Action";
import DraftViews from "../../models/DraftViews";
import {default as ModelDraft} from "../../models/Draft";
import PlayerEvent from "../../models/PlayerEvent";
import AdminEvent from "../../models/AdminEvent";

interface IProps extends WithTranslation {
    preset: Preset;
    nextAction: number;
    draftEvents: DraftEvent[];
    replayEvents: DraftEvent[];
    countdownInterval: NodeJS.Timeout | null;
    stopCountdown: NodeJS.Timeout | null;
    eventTimeouts: NodeJS.Timeout[];

    setCountdownValue: (values: ICountdownValues) => void;
    setEvents: (value: { player: Player, action: ModelAction, events: DraftEvent[] }) => void;
    setDraftEvents: (value: DraftEvent[]) => void;
    act: (value: DraftEvent) => void;
    setCountdownInterval: (value: NodeJS.Timeout | null) => void;
    setEventTimeouts: (value: NodeJS.Timeout[]) => void;
    setStopCountdown: (value: NodeJS.Timeout | null) => void;
}

interface IState {
    countdownValue: number;
    currentOffset: number;
    isRunning: boolean;
}

class ReplayControls extends React.Component<IProps, IState> {

    state = {
        countdownValue: 30,
        currentOffset: 0,
        isRunning: false,
    } as IState;

    public render() {
        if (this.props.replayEvents.length === 0 || this.hasDraftEnded()) {
            return null;
        }
        const pauseButton = <button id="spectator-pause" className="spectator-action button is-large"
                                    onClick={this.haltReplay} aria-label="Pause"><i className="material-icons">pause</i></button>;
        const runButton = <button id="spectator-play" className="spectator-action button is-large"
                                  onClick={this.runReplay} aria-label="Play"><i
            className="material-icons">play_arrow</i>

        </button>;
        const nextButton = <button id="spectator-next" className="spectator-action button is-large"
                                   onClick={this.nextStep} aria-label="Next"><i className="material-icons">skip_next</i>
        </button>;
        const skipToEndbutton = <button id="spectator-forward" className="spectator-action button is-large"
                                        onClick={this.skipToEnd} aria-label="Fast Forward"><i
            className="material-icons">fast_forward</i>
        </button>;

        return <div className="columns is-mobile">
            <div className="column has-text-centered">
                <div id="spectator-controls" className="buttons is-centered">
                    {this.state.isRunning ? pauseButton : runButton}
                    {this.state.isRunning ? null : nextButton}
                    {this.state.isRunning ? null : skipToEndbutton}
                </div>
            </div>
        </div>;
    }

    skipToEnd = () => {
        this.props.setDraftEvents(this.props.replayEvents);
    };

    nextStep = () => {
        if (this.props.draftEvents.length === this.props.replayEvents.length) {
            return;
        }
        const event = this.props.replayEvents[this.props.draftEvents.length];
        this.addEvent(event, this.createDraftViews());
    };

    runReplay = () => {
        if (this.props.draftEvents.length === this.props.replayEvents.length) {
            return;
        }
        const draftViews = this.createDraftViews();
        this.startCountdown();
        const draftEventTimeouts = [];
        for (let i = this.props.draftEvents.length; i < this.props.replayEvents.length; i++) {
            const event = this.props.replayEvents[i];
            draftEventTimeouts.push(this.scheduleDraftEvent(draftViews, event));
        }
        this.setState({isRunning: true});
        this.props.setEventTimeouts(draftEventTimeouts);
        this.scheduleStopCountdown();
    };

    private createDraftViews() {
        const draftState = {
            nameHost: '…',
            nameGuest: '…',
            hostConnected: false,
            guestConnected: false,
            hostReady: true,
            guestReady: true,
            preset: this.props.preset,
            events: [...this.props.replayEvents.slice(0, this.props.draftEvents.length)],
            startTimestamp: 0
        }
        return new DraftViews(ModelDraft.fromDraftState(draftState));
    }

    haltReplay = () => {
        this.stopCountdown();
        for (let eventTimeout of this.props.eventTimeouts) {
            clearTimeout(eventTimeout);
        }
        this.setState({isRunning: false});
        this.props.setEventTimeouts([]);
    }

    private scheduleStopCountdown() {
        const timeout = setTimeout(() => {
            this.stopCountdown();
        }, (this.props.replayEvents)[this.props.replayEvents.length - 1].offset);
        this.props.setStopCountdown(timeout);
    }

    private stopCountdown() {
        this.props.setCountdownValue({display: false, value: 0});
        this.clearInterval();
        this.setState({countdownValue: 30});
    }

    private scheduleDraftEvent(draftViews: DraftViews, event: PlayerEvent | AdminEvent) {
        console.log('scheduling', event, event.offset, this.state.currentOffset, event.offset - this.state.currentOffset);
        return setTimeout(() => {
            this.addEvent(event, draftViews);
        }, event.offset - this.state.currentOffset);
    }

    private addEvent(event: PlayerEvent | AdminEvent, draftViews: DraftViews) {
        const originalEventOffset = event.offset;
        this.restartCountdown();
        if (Util.isAdminEvent(event)) {
            draftViews.reveal(event.action);
            this.props.setEvents({player: event.player, action: event.action, events: draftViews.specEvents});
            draftViews.addDraftEvent(event);
        } else {
            draftViews.addDraftEvent(event);
            this.props.act(draftViews.getLastEventForSpec());
        }
        this.setState({currentOffset: originalEventOffset});
    }

    private restartCountdown() {
        if (this.state.isRunning) {
            this.startCountdown();
        }
    }

    private startCountdown() {
        this.clearInterval();
        this.resetCountdownValue();
        this.props.setCountdownValue({display: true, value: this.state.countdownValue});
        const interval = setInterval(() => {
            this.decrementCountdownValue();
            this.props.setCountdownValue({display: true, value: this.state.countdownValue});
        }, 1000);
        this.props.setCountdownInterval(interval);
    }

    private clearInterval() {
        if (this.props.countdownInterval !== null) {
            clearInterval(this.props.countdownInterval);
            this.props.setCountdownInterval(null);
        }
        if (this.props.stopCountdown !== null) {
            clearInterval(this.props.stopCountdown);
            this.props.setStopCountdown(null);
        }
    }

    private resetCountdownValue() {
        this.setState({countdownValue: 30});
    }

    private decrementCountdownValue() {
        this.setState({countdownValue: this.state.countdownValue - 1});
    }

    private hasDraftEnded() {
        return this.props.nextAction >= this.props.preset.turns.length;
    }
}

export default withTranslation()(ReplayControls);