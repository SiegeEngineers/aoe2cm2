import {Util} from "../../models/Util";

it('sanitize handles common cases', () => {
    expect(Util.sanitizeDraftId('')).toEqual('');
    expect(Util.sanitizeDraftId('draftId')).toEqual('draftId');
    expect(Util.sanitizeDraftId('draft/Id')).toEqual('draft_Id');
    expect(Util.sanitizeDraftId('../../../../etc/shadow')).toEqual('____________etc_shadow');
});
