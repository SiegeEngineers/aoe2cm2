import {DraftsStore} from "../../models/DraftsStore";
import Draft from "../../models/Draft";
import Preset from "../../models/Preset";
import Player from "../../constants/Player";
import PlayerEvent from "../../models/PlayerEvent";
import ActionType from "../../constants/ActionType";
import Civilisation from "../../models/Civilisation";

it('test get empty ongoing drafts', () => {
    const draftsStore = new DraftsStore();
    expect(draftsStore.getOngoingDrafts()).toEqual([]);
});

it('test do not get drafts without both connected players', () => {
    const draftsStore = new DraftsStore();
    draftsStore.createDraft('draftId', new Draft('nameHost', 'nameGuest', Preset.SIMPLE));
    expect(draftsStore.getOngoingDrafts()).toEqual([]);
});

it('test get all eleven ongoing drafts', () => {
    const draftsStore = new DraftsStore();
    for (let i = 0; i < 11; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore);
    }
    expect(draftsStore.getRecentDrafts().map((draft) => draft.draftId))
        .toEqual(['draft10', 'draft9', 'draft8', 'draft7', 'draft6', 'draft5', 'draft4', 'draft3', 'draft2', 'draft1', 'draft0'])
});

it('test get ten of eleven finished drafts', () => {
    const draftsStore = new DraftsStore();
    for (let i = 0; i < 11; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore);
        draftsStore.finishDraft(draftId);
    }
    expect(draftsStore.getRecentDrafts().map((draft) => draft.draftId))
        .toEqual(['draft10', 'draft9', 'draft8', 'draft7', 'draft6', 'draft5', 'draft4', 'draft3', 'draft2', 'draft1'])
});

it('test get ongoing drafts before finished drafts', () => {
    const draftsStore = new DraftsStore();
    for (let i = 0; i < 5; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore);
    }
    for (let i = 5; i < 11; i++) {
        const draftId = `draft${i}`;
        addDraft(draftId, i, draftsStore);
        draftsStore.finishDraft(draftId);
    }
    expect(draftsStore.getRecentDrafts().map((draft) => draft.draftId))
        .toEqual(['draft4', 'draft3', 'draft2', 'draft1', 'draft0', 'draft10', 'draft9', 'draft8', 'draft7', 'draft6'])
});

function addDraft(draftId: string, i: number, draftsStore: DraftsStore) {
    const nameHost = `host-${i}`;
    const nameGuest = `guest-${i}`;
    draftsStore.createDraft(draftId, new Draft(nameHost, nameGuest, Preset.SIMPLE));
    draftsStore.connectPlayer(draftId, Player.HOST, nameHost);
    draftsStore.connectPlayer(draftId, Player.GUEST, nameGuest);
    draftsStore.setPlayerReady(draftId, Player.HOST);
    draftsStore.setPlayerReady(draftId, Player.GUEST);
    draftsStore.getDraftOrThrow(draftId).startTimestamp = i;
    draftsStore.addDraftEvent(draftId, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.AZTECS));
    draftsStore.addDraftEvent(draftId, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.BERBERS));
    draftsStore.addDraftEvent(draftId, new PlayerEvent(Player.GUEST, ActionType.BAN, Civilisation.BRITONS));
    draftsStore.addDraftEvent(draftId, new PlayerEvent(Player.HOST, ActionType.BAN, Civilisation.BULGARIANS));
}
