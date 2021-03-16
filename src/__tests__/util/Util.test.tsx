import {Util} from "../../util/Util";

it('sanitize handles common cases', () => {
    expect(Util.sanitizeDraftId('')).toEqual('');
    expect(Util.sanitizeDraftId('draftId')).toEqual('draftId');
    expect(Util.sanitizeDraftId('draft/Id')).toEqual('draft_Id');
    expect(Util.sanitizeDraftId('../../../../etc/shadow')).toEqual('____________etc_shadow');
    // @ts-ignore
    expect(Util.sanitizeDraftId(undefined)).toEqual('__invalid__');
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

describe('test isValidPresetId', () => {
    it.each([
        ["abcdef", true],
        ["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_", true],
        ["abc123", true],
        ["ä", false],
        ["", false],
        [undefined, false],
        ["https://example.com", false]
    ])("when the input is '%s'", (text: any, expected: boolean) => {
        expect(Util.isValidPresetId(text)).toBe(expected);
    });
});
