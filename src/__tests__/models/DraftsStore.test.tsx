import {DraftsStore} from "../../models/DraftsStore";
import Draft from "../../models/Draft";
import Preset from "../../models/Preset";
import Player from "../../constants/Player";
import PlayerEvent from "../../models/PlayerEvent";
import ActionType from "../../constants/ActionType";
import temp from "temp";
import fs from "fs";
import path from "path";
import Civilisation from "../../models/Civilisation";

let dirPath: string;
beforeEach(() => {
    temp.track();
    dirPath = temp.mkdirSync('draftsStoreTest');
    fs.writeFileSync(path.join(dirPath, 'recentDrafts.json'), "[]");
});

afterEach(() => {
    temp.cleanupSync();
});

it('test get empty ongoing drafts', () => {
    const draftsStore = new DraftsStore(dirPath);
    expect(draftsStore.getOngoingDrafts()).toEqual([]);
});

it('test do not get drafts without both connected players', () => {
    const draftsStore = new DraftsStore(dirPath);
    draftsStore.createDraft('draftId', new Draft('nameHost', 'nameGuest', Preset.SIMPLE, false));
    expect(draftsStore.getOngoingDrafts()).toEqual([]);
});

it('test get all 31 ongoing drafts', () => {
    const draftsStore = new DraftsStore(dirPath);
    for (let i = 0; i < 31; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore);
    }
    expect(draftsStore.getRecentDrafts().map((draft) => draft.draftId))
        .toEqual([
            'draft30', 'draft29', 'draft28', 'draft27', 'draft26', 'draft25', 'draft24', 'draft23', 'draft22', 'draft21',
            'draft20', 'draft19', 'draft18', 'draft17', 'draft16', 'draft15', 'draft14', 'draft13', 'draft12', 'draft11',
            'draft10', 'draft9', 'draft8', 'draft7', 'draft6', 'draft5', 'draft4', 'draft3', 'draft2', 'draft1',
            'draft0',
        ])
});

it('test get 30 of 31 finished drafts', () => {
    const draftsStore = new DraftsStore(dirPath);
    for (let i = 0; i < 31; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore);
        draftsStore.finishDraft(draftId);
    }
    expect(draftsStore.getRecentDrafts().map((draft) => draft.draftId))
        .toEqual([
            'draft30', 'draft29', 'draft28', 'draft27', 'draft26', 'draft25', 'draft24', 'draft23', 'draft22', 'draft21',
            'draft20', 'draft19', 'draft18', 'draft17', 'draft16', 'draft15', 'draft14', 'draft13', 'draft12', 'draft11',
            'draft10', 'draft9', 'draft8', 'draft7', 'draft6', 'draft5', 'draft4', 'draft3', 'draft2', 'draft1',
        ])
});

it('test get ongoing drafts before finished drafts', () => {
    const draftsStore = new DraftsStore(dirPath);
    for (let i = 0; i < 5; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore);
    }
    for (let i = 5; i < 31; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore);
        draftsStore.finishDraft(draftId);
    }
    expect(draftsStore.getRecentDrafts().map((draft) => draft.draftId))
        .toEqual([
            'draft4', 'draft3', 'draft2', 'draft1', 'draft0',
            'draft30', 'draft29', 'draft28', 'draft27', 'draft26', 'draft25', 'draft24', 'draft23', 'draft22', 'draft21',
            'draft20', 'draft19', 'draft18', 'draft17', 'draft16', 'draft15', 'draft14', 'draft13', 'draft12', 'draft11',
            'draft10', 'draft9', 'draft8', 'draft7', 'draft6',])
});

it('hidden presets do not get stored', () => {
    const draftsStore = new DraftsStore(dirPath, {maintenanceMode: false, hiddenPresetIds: ['hidden']});
    for (let i = 0; i < 3; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore);
    }
    for (let i = 3; i < 6; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore, 'hidden');
        draftsStore.finishDraft(draftId);
    }
    for (let i = 6; i < 9; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore);
        draftsStore.finishDraft(draftId);
    }
    expect(draftsStore.getRecentDrafts().map((draft) => draft.draftId))
        .toEqual(['draft2', 'draft1', 'draft0', 'draft8', 'draft7', 'draft6'])
});

it('hidden live presets do not get displayed', () => {
    const draftsStore = new DraftsStore(dirPath, {maintenanceMode: false, hiddenPresetIds: ['live']});
    for (let i = 0; i < 3; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore);
    }
    for (let i = 3; i < 6; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore, 'live');
    }
    for (let i = 6; i < 9; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore);
        draftsStore.finishDraft(draftId);
    }
    expect(draftsStore.getRecentDrafts().map((draft) => draft.draftId))
        .toEqual(['draft2', 'draft1', 'draft0', 'draft8', 'draft7', 'draft6'])
});

it('private drafts do not get stored', () => {
    const draftsStore = new DraftsStore(dirPath, {maintenanceMode: false, hiddenPresetIds: []});
    for (let i = 0; i < 3; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore, undefined, false);
    }
    for (let i = 3; i < 6; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore, undefined, true);
        draftsStore.finishDraft(draftId);
    }
    for (let i = 6; i < 9; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore, undefined, false);
        draftsStore.finishDraft(draftId);
    }
    expect(draftsStore.getRecentDrafts().map((draft) => draft.draftId))
        .toEqual(['draft2', 'draft1', 'draft0', 'draft8', 'draft7', 'draft6'])
});

it('private live drafts do not get displayed', () => {
    const draftsStore = new DraftsStore(dirPath, {maintenanceMode: false, hiddenPresetIds: []});
    for (let i = 0; i < 3; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore, undefined, false);
    }
    for (let i = 3; i < 6; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore, undefined, true);
    }
    for (let i = 6; i < 9; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore, undefined, false);
        draftsStore.finishDraft(draftId);
    }
    expect(draftsStore.getRecentDrafts().map((draft) => draft.draftId))
        .toEqual(['draft2', 'draft1', 'draft0', 'draft8', 'draft7', 'draft6'])
});

function addDraft(draftId: string, i: number, draftsStore: DraftsStore, presetId: string|undefined = Preset.SIMPLE.presetId, privateDraft: boolean = false) {
    const nameHost = `host-${i}`;
    const nameGuest = `guest-${i}`;
    const preset = Preset.fromPojo({...Preset.SIMPLE, presetId}) as Preset;
    draftsStore.createDraft(draftId, new Draft(nameHost, nameGuest, preset, privateDraft));
    draftsStore.connectPlayer(draftId, Player.HOST, nameHost);
    draftsStore.connectPlayer(draftId, Player.GUEST, nameGuest);
    draftsStore.setPlayerReady(draftId, Player.HOST);
    draftsStore.setPlayerReady(draftId, Player.GUEST);
    draftsStore.getDraftOrThrow(draftId).startTimestamp = i;
    draftsStore.addDraftEvent(draftId, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS.id));
    draftsStore.addDraftEvent(draftId, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.BERBERS.id));
    draftsStore.addDraftEvent(draftId, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.BRITONS.id));
    draftsStore.addDraftEvent(draftId, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.BULGARIANS.id));
}
