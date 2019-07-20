import Draft from "./Draft";
import {DraftEvent} from "./DraftEvent";
import Preset from "./Preset";
import Player from "./Player";
import Turn from "./Turn";
import DraftViews from "./DraftViews";
import {setInterval} from "timers";
import socketio from "socket.io";
import PlayerEvent from "./PlayerEvent";
import Civilisation from "./Civilisation";
import {actionTypeFromAction} from "./ActionType";
import {Listeners} from "./Listeners";

interface ICountdownValues {
    timeout: NodeJS.Timeout;
    value: number;
    socket: socketio.Socket;
}

export class DraftsStore {
    private drafts: Map<string, DraftViews> = new Map<string, DraftViews>();
    private countdowns: Map<String, ICountdownValues> = new Map<String, ICountdownValues>();

    public createDraft(draftId: string, draft: Draft) {
        this.assertDraftDoesNotExist(draftId);
        this.drafts.set(draftId, new DraftViews(draft));
    }

    public initDraft(draftId: string, preset: Preset) {
        this.createDraft(draftId, new Draft('…', '…', preset));
    }

    public addDraftEvent(draftId: string, draftEvent: DraftEvent) {
        const draftViews: DraftViews = this.getDraftViewsOrThrow(draftId);
        draftViews.addDraftEvent(draftEvent);
    }

    public getExpectedActions(draftId: string, offset: number = 0): Turn[] {
        const draft: Draft = this.getDraftOrThrow(draftId);
        return draft.getExpectedActions(offset);
    }

    public getDraftIds(): string[] {
        return Array.from(this.drafts.keys());
    }

    public has(draftId: string): boolean {
        return this.drafts.has(draftId);
    }

    public setPlayerName(draftId: string, player: Player, name: string) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        switch (player) {
            case Player.HOST:
                draft.nameHost = name;
                break;
            case Player.GUEST:
                draft.nameGuest = name;
                break;
        }
    }

    public setPlayerReady(draftId: string, player: Player) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        switch (player) {
            case Player.HOST:
                draft.hostReady = true;
                break;
            case Player.GUEST:
                draft.guestReady = true;
                break;
        }
    }

    public playersAreReady(draftId: string) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        return Draft.playersAreReady(draft);
    }

    public getPlayerNames(draftId: string) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        return {nameHost: draft.nameHost, nameGuest: draft.nameGuest};
    }

    public getEvents(draftId: string): DraftEvent[] {
        const draft: Draft = this.getDraftOrThrow(draftId);
        return draft.events;
    }

    public getNextAction(draftId: string): number {
        const draft: Draft = this.getDraftOrThrow(draftId);
        return draft.nextAction;
    }

    public getDraftOrThrow(draftId: string): Draft {
        if (!this.has(draftId)) {
            throw new Error(`Draft with id ${draftId} not found`);
        }
        let draftViews = this.drafts.get(draftId) as DraftViews;
        return draftViews.getActualDraft() as Draft;
    }

    public getDraftViewsOrThrow(draftId: string): DraftViews {
        if (!this.has(draftId)) {
            throw new Error(`Draft with id ${draftId} not found`);
        }
        return this.drafts.get(draftId) as DraftViews;
    }

    private assertDraftDoesNotExist(draftId: string) {
        if (this.has(draftId)) {
            throw new Error(`Draft with id ${draftId} already exists`);
        }
    }

    public startCountdown(draftId: string, socket: socketio.Socket) {
        const expectedActions = this.getExpectedActions(draftId);
        if (expectedActions.length > 0) {
            const interval: NodeJS.Timeout = setInterval(() => {
                const roomHost: string = `${draftId}-host`;
                const roomGuest: string = `${draftId}-guest`;
                const roomSpec: string = `${draftId}-spec`;
                let countdown = this.countdowns.get(draftId);
                if (countdown !== undefined) {
                    const value = countdown.value;
                    const s = countdown.socket;
                    countdown.value = value - 1;
                    this.countdowns.set(draftId, countdown);

                    if (value >= 0) {
                        s.nsp
                            .in(roomHost)
                            .in(roomGuest)
                            .in(roomSpec)
                            .emit("countdown", {value, display: true});
                    }

                    if (value === -1) {
                        const actListener = Listeners.actListener(this, draftId, (draftId: string, message: DraftEvent) => {
                            this.addDraftEvent(draftId, message);
                            return [];
                        }, socket, roomHost, roomGuest, roomSpec);
                        const expectedActions = this.getExpectedActions(draftId);
                        if (expectedActions.length > 0) {
                            for (let expectedAction of expectedActions) {
                                const message = new PlayerEvent(expectedAction.player, actionTypeFromAction(expectedAction.action), Civilisation.RANDOM);
                                actListener(message, () => {
                                });
                            }
                        }
                    }

                }
            }, 1000);
            this.countdowns.set(draftId, {timeout: interval, value: 30, socket});
        }
    }

    public restartOrCancelCountdown(draftId: string) {
        let countdown = this.countdowns.get(draftId);
        if (countdown !== undefined) {
            clearInterval(countdown.timeout);
            const expectedActions = this.getExpectedActions(draftId);
            const roomHost: string = `${draftId}-host`;
            const roomGuest: string = `${draftId}-guest`;
            const roomSpec: string = `${draftId}-spec`;
            countdown.socket.nsp
                .in(roomHost)
                .in(roomGuest)
                .in(roomSpec)
                .emit("countdown", {value: 0, display: false});
            if (expectedActions.length > 0) {
                this.startCountdown(draftId, countdown.socket);
            }
        }
    }

    removeDraft(draftId: string) {
        this.drafts.delete(draftId);
    }
}