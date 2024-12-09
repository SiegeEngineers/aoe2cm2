import Draft from "./Draft";
import {DraftEvent} from "../types/DraftEvent";
import Preset from "./Preset";
import Player from "../constants/Player";
import Turn from "./Turn";
import DraftViews from "./DraftViews";
import {setInterval} from "timers";
import socketio from "socket.io";
import PlayerEvent from "./PlayerEvent";
import {actionTypeFromAction} from "../constants/ActionType";
import {ActListener} from "../util/ActListener";
import {logger} from "../util/Logger";
import {IRecentDraft, IServerState} from "../types";
import fs from "fs";
import path from "path";
import {DraftsArchive} from "./DraftsArchive";
import DraftOption from "./DraftOption";

interface ICountdownValues {
    timeout?: NodeJS.Timeout;
    value: number;
    socket: socketio.Socket;
}


const RECENT_DRAFTS_LIST_LENGTH = 30;

export class DraftsStore {
    private drafts: Map<string, DraftViews> = new Map<string, DraftViews>();
    private countdowns: Map<String, ICountdownValues> = new Map<String, ICountdownValues>();
    private readonly state: IServerState;
    readonly recentDraftsFile: string | null;
    readonly draftsArchive?: DraftsArchive;
    readonly currentDataPath?: string;

    constructor(baseDirectory: string | null, state: IServerState = {maintenanceMode: false, hiddenPresetIds: []}) {
        this.recentDraftsFile = baseDirectory ? path.join(baseDirectory, 'recentDrafts.json') : null;
        this.state = state;
        if (baseDirectory !== null){
            const dataPath = path.join(baseDirectory, 'data');
            this.currentDataPath = path.join(dataPath, 'current');
            if(fs.existsSync(dataPath)) {
                this.draftsArchive = new DraftsArchive(dataPath);
            }
        }
    }

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

    public getRecentDrafts(): IRecentDraft[] {
        const ongoingDrafts = this.getOngoingDrafts();

        const recentDrafts = this.loadRecentDrafts();
        if (ongoingDrafts.length < RECENT_DRAFTS_LIST_LENGTH) {
            const iterations = RECENT_DRAFTS_LIST_LENGTH - ongoingDrafts.length;
            for (let i = 0; i < iterations; i++) {
                if (recentDrafts.length > i) {
                    ongoingDrafts.push(recentDrafts[i]);
                } else {
                    break;
                }
            }
        }

        return ongoingDrafts;
    }

    public getLobbyDraft(draftId: string): IRecentDraft {
        const draft = this.getDraftOrThrow(draftId);

        return {
            draftId: draftId,
            ongoing: draft.hasNextAction(),
            presetId: draft.preset.presetId,
            title: draft.preset.name,
            nameHost: draft.nameHost,
            nameGuest: draft.nameGuest,
        };
    }

    getOngoingDrafts() {
        const ongoingDrafts: IRecentDraft[] = this.getDraftIds()
            .map((value: string) => {
                return {...this.getDraftOrThrow(value), draftId: value};
            })
            .filter((draft) => !this.presetIdIsHidden(draft))
            .filter((draft) => draft.hostConnected && draft.guestConnected)
            .sort((a, b) => (a.startTimestamp > b.startTimestamp) ? -1 : 1)
            .map((draft) => {
                return {
                    draftId: draft.draftId,
                    ongoing: true,
                    presetId: draft.preset.presetId,
                    title: draft.preset.name,
                    nameHost: draft.nameHost,
                    nameGuest: draft.nameGuest,
                };
            });
        return ongoingDrafts;
    }

    private presetIdIsHidden(draft: { preset: Preset}) {
        return draft.preset.presetId !== undefined && this.state.hiddenPresetIds.includes(draft.preset.presetId);
    }

    public draftIsHidden(draftId: string) {
        const draft = this.getDraftGracefully(draftId);
        return draft === undefined || this.presetIdIsHidden(draft);
    }

    public getDraftIds(): string[] {
        return Array.from(this.drafts.keys());
    }

    public has(draftId: string): boolean {
        return this.drafts.has(draftId);
    }

    public hasArchive(draftId: string): boolean {
        if (this.draftsArchive) {
            return this.draftsArchive.hasDraftId(draftId);
        }
        return false;
    }

    public reloadArchiveData(): boolean {
        if (this.draftsArchive) {
            this.draftsArchive.reloadArchiveData();
            return true;
        }
        return false;
    }

    public draftIdExists(draftId: string): boolean {
        return this.has(draftId)
            || this.hasArchive(draftId)
            || this.hasCurrent(draftId);
    }

    private hasCurrent(draftId: string) {
        return this.currentDataPath !== undefined && fs.existsSync(path.join(this.currentDataPath, `${draftId}.json`));
    }

    public getArchiveFolder(draftId: string): string {
        if (this.draftsArchive) {
            return this.draftsArchive.getFolderForDraftId(draftId);
        }
        return '';
    }

    public connectPlayer(draftId: string, player: Player, name: string) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        switch (player) {
            case Player.HOST:
                draft.nameHost = name;
                draft.hostConnected = true;
                break;
            case Player.GUEST:
                draft.nameGuest = name;
                draft.guestConnected = true;
                break;
        }
    }

    public setFixedPlayerNames(draftId: string, fixedNames: boolean) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        draft.fixedNames = fixedNames;
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

    public disconnectPlayer(draftId: string, player: Player) {
        const draft = this.getDraftGracefully(draftId);
        if (draft === undefined) {
            return;
        }
        switch (player) {
            case Player.HOST:
                if (!draft.fixedNames) {
                    draft.nameHost = '…';
                }
                draft.hostConnected = false;
                draft.hostReady = false;
                this.pauseCountdown(draftId);
                break;
            case Player.GUEST:
                if (!draft.fixedNames) {
                    draft.nameGuest = '…';
                }
                draft.guestConnected = false;
                draft.guestReady = false;
                this.pauseCountdown(draftId);
                break;
        }
    }

    public pause(draftId: string) {
        const draft = this.getDraftGracefully(draftId);
        if (draft === undefined) {
            return;
        }
        draft.guestReady = false;
        draft.hostReady = false;
        this.pauseCountdown(draftId);

    }

    private getDraftGracefully(draftId: string): Draft | undefined {
        try {
            return this.getDraftOrThrow(draftId);
        } catch (e) {
            return undefined;
        }
    }

    public isPlayersConnected(draftId: string) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        return draft.hostConnected && draft.guestConnected;
    }

    public isPlayerConnected(draftId: string, player: Player) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        switch (player) {
            case Player.HOST:
                return draft.hostConnected;
            case Player.GUEST:
                return draft.guestConnected;
        }
        return false;
    }

    public setPlayerReady(draftId: string, player: Player) {
        const draft: Draft = this.getDraftOrThrow(draftId);
        let previousReadyValue = false;
        switch (player) {
            case Player.HOST:
                previousReadyValue = draft.hostReady;
                draft.hostReady = true;
                break;
            case Player.GUEST:
                previousReadyValue = draft.guestReady;
                draft.guestReady = true;
                break;
        }
        return previousReadyValue;
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

    public pauseCountdown(draftId: string) {
        const countdown = this.countdowns.get(draftId);
        if (countdown === undefined || countdown.timeout === undefined) {
            return;
        }
        clearInterval(countdown.timeout);
        countdown.timeout = undefined;
        logger.info('Pausing countdown for draftId %s', draftId, {draftId});
    }

    public startCountdown(draftId: string, socket: socketio.Socket, dataDirectory: string) {
        let countdown = this.countdowns.get(draftId);
        if (countdown && countdown.timeout) {
            return;
        }
        const expectedActions = this.getExpectedActions(draftId);
        if (expectedActions.length > 0) {
            let initialValue = 30;
            if (countdown !== undefined) {
                initialValue = countdown.value;
            }
            const interval: NodeJS.Timeout = setInterval(() => {
                const roomLobby: string = 'lobby';
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
                        const actListener = new ActListener(dataDirectory).actListener(this, draftId, (draftId: string, message: DraftEvent) => {
                            this.addDraftEvent(draftId, message);
                            return [];
                        }, socket, roomLobby, roomHost, roomGuest, roomSpec, true);
                        const expectedActions = this.getExpectedActions(draftId);
                        if (expectedActions.length > 0) {
                            for (let expectedAction of expectedActions) {
                                const message = new PlayerEvent(expectedAction.player, actionTypeFromAction(expectedAction.action), DraftOption.RANDOM.id, false, expectedAction.executingPlayer);
                                logger.info('Countdown ran out, executing action on player\'s behalf: %s', JSON.stringify(message), {draftId});
                                actListener(message, () => {
                                });
                            }
                        }
                    }

                }
            }, 1000);
            this.countdowns.set(draftId, {timeout: interval, value: initialValue, socket});
        }
    }

    public setStartTimestampIfNecessary(draftId: string) {
        const draft = this.getDraftOrThrow(draftId);
        if (!draft.startTimestamp || draft.nextAction === 0) {
            draft.startTimestamp = Date.now();
        }
    }

    public restartOrCancelCountdown(draftId: string, dataDirectory: string) {
        let countdown = this.countdowns.get(draftId);
        if (countdown !== undefined) {
            if (countdown.timeout !== undefined) {
                clearInterval(countdown.timeout);
                countdown.timeout = undefined;
                this.resetCountdownValue(draftId);
            }
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
                this.startCountdown(draftId, countdown.socket, dataDirectory);
            }
        }
    }

    private resetCountdownValue(draftId: string) {
        const countdown = this.countdowns.get(draftId);
        if (countdown === undefined) {
            return;
        }
        countdown.value = 30;
    }

    finishDraft(draftId: string) {
        this.addRecentDraft(draftId);
        this.removeDraft(draftId);
    }

    removeDraft(draftId: string) {
        this.drafts.delete(draftId);
    }

    addRecentDraft(draftId: string) {
        const draft = this.getDraftOrThrow(draftId);
        if(this.presetIdIsHidden(draft)){
            return;
        }
        const recentDrafts = this.loadRecentDrafts();
        recentDrafts.unshift({
            title: draft.preset.name,
            draftId: draftId,
            presetId: draft.preset.presetId,
            ongoing: false,
            nameHost: draft.nameHost,
            nameGuest: draft.nameGuest
        });
        while (recentDrafts.length > RECENT_DRAFTS_LIST_LENGTH) {
            recentDrafts.pop();
        }
        this.saveRecentDrafts(recentDrafts);
    }

    private loadRecentDrafts() {
        if (this.recentDraftsFile === null) {
            return [];
        }
        if (fs.existsSync(this.recentDraftsFile)) {
            const fileContent = fs.readFileSync(this.recentDraftsFile);
            return JSON.parse(fileContent.toString()) as IRecentDraft[];
        } else {
            return [];
        }
    }

    private saveRecentDrafts(recentDrafts: IRecentDraft[]) {
        if (this.recentDraftsFile === null) {
            return;
        }
        fs.writeFileSync(this.recentDraftsFile, JSON.stringify(recentDrafts));
    }

    public purgeStaleDrafts() {
        const SIX_HOURS = 1000 * 60 * 60 * 6;
        const now = Date.now();

        logger.info('Trying to purge stale drafts');
        let numberOfPurgedDrafts = 0;
        for (let draftId of this.getDraftIds()) {
            try {
                const startTimestamp = this.getDraftOrThrow(draftId).startTimestamp;
                if (startTimestamp < (now - SIX_HOURS)) {
                    logger.info('Purging Draft: %s', draftId, {draftId, startTimestamp});
                    this.removeDraft(draftId);
                    numberOfPurgedDrafts++;
                }
            } catch (e) {
                logger.error('Failed to purge stale draft', e);
            }
        }
        logger.info('Purged %s drafts', numberOfPurgedDrafts);
    }
}