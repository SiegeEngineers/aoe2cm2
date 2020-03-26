import {Util} from "../../util/Util";

it('sanitize handles common cases', () => {
    expect(Util.sanitizeDraftId('')).toEqual('');
    expect(Util.sanitizeDraftId('draftId')).toEqual('draftId');
    expect(Util.sanitizeDraftId('draft/Id')).toEqual('draft_Id');
    expect(Util.sanitizeDraftId('../../../../etc/shadow')).toEqual('____________etc_shadow');
});

it('getIdFromUrl works on draft url', () => {
    const draftId = 'abcdef';
    delete window.location;
    window.location = new URL('https://www.example.com/draft/' + draftId) as any;
    expect(Util.getIdFromUrl()).toEqual(draftId);
});

it('getIdFromUrl works on draft url with trailing slash', () => {
    const draftId = 'abcdef';
    delete window.location;
    window.location = new URL('https://www.example.com/draft/' + draftId + '/') as any;
    expect(Util.getIdFromUrl()).toEqual(draftId);
});

it('getIdFromUrl works on spectate url', () => {
    const draftId = 'abcdef';
    delete window.location;
    window.location = new URL('https://www.example.com/spectate/' + draftId) as any;
    expect(Util.getIdFromUrl()).toEqual(draftId);
});

it('getIdFromUrl works on spectate url with trailing slash', () => {
    const draftId = 'abcdef';
    delete window.location;
    window.location = new URL('https://www.example.com/spectate/' + draftId + '/') as any;
    expect(Util.getIdFromUrl()).toEqual(draftId);
});
