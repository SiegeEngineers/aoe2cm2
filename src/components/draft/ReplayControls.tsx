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

    setCountdownValue: (values: ICountdownValues) => void;
    setEvents: (value: { player: Player, action: ModelAction, events: DraftEvent[] }) => void;
    setDraftEvents: (value: DraftEvent[]) => void;
    act: (value: DraftEvent) => void;
}

interface IState {
    countdownValue: number;
    countdownInterval: NodeJS.Timeout | null;
    stopCountdown: NodeJS.Timeout | null;
    eventTimeouts: NodeJS.Timeout[];
    currentOffset: number;
    isRunning: boolean;
}

class ReplayControls extends React.Component<IProps, IState> {

    state = {
        countdownValue: 30,
        countdownInterval: null,
        stopCountdown: null,
        eventTimeouts: [],
        currentOffset: 0,
        isRunning: false,
    } as IState;

    public render() {
        if (this.props.replayEvents.length === 0) {
            return null;
        }
        const pauseButton = <div className="spectator-action shadowbutton text-primary" onClick={this.haltReplay}>
            <span id="spectator-pause">pause</span>
        </div>;
        const runButton = <div className="spectator-action shadowbutton text-primary" onClick={this.runReplay}>
            <span id="spectator-play">play</span>
        </div>;
        const nextButton = <div className="spectator-action shadowbutton text-primary" onClick={this.nextStep}>
            <span id="spectator-next">next</span>
        </div>;
        const skipToEndbutton = <div className="spectator-action shadowbutton text-primary" onClick={this.skipToEnd}>
            <span id="spectator-forward">fast-forward</span>
        </div>;
        return <div id="spectator-controls" className="centered">
            {this.state.isRunning ? pauseButton : runButton}
            {this.state.isRunning ? null : nextButton}
            {this.state.isRunning ? null : skipToEndbutton}
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
        this.setState({eventTimeouts: draftEventTimeouts, isRunning: true});
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
        for (let eventTimeout of this.state.eventTimeouts) {
            clearTimeout(eventTimeout);
        }
        this.setState({eventTimeouts: [], isRunning: false});
    }

    private scheduleStopCountdown() {
        const timeout = setTimeout(() => {
            this.stopCountdown();
        }, (this.props.replayEvents)[this.props.replayEvents.length - 1].offset);
        this.setState({stopCountdown: timeout});
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
        this.setState({countdownInterval: interval});
    }

    private clearInterval() {
        if (this.state.countdownInterval !== null) {
            clearInterval(this.state.countdownInterval as NodeJS.Timeout);
        }
        if (this.state.stopCountdown !== null) {
            clearInterval(this.state.stopCountdown as NodeJS.Timeout);
        }
    }

    private resetCountdownValue() {
        this.setState({countdownValue: 30});
    }

    private decrementCountdownValue() {
        this.setState({countdownValue: this.state.countdownValue - 1});
    }

}

export default withTranslation()(ReplayControls);