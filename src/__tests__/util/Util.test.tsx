import {describe, expect, it} from 'vitest';
import {Util} from "../../util/Util";
import * as fs from "fs";
import path from "path";
import Civilisation from "../../models/Civilisation";
import DraftOption from "../../models/DraftOption";

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
    window.location = new URL('https://www.example.com/draft/' + draftId) as any;
    expect(Util.getIdFromUrl()).toEqual(draftId);
});

it('getIdFromUrl works on draft url with trailing slash', () => {
    const draftId = 'abcdef';
    window.location = new URL('https://www.example.com/draft/' + draftId + '/') as any;
    expect(Util.getIdFromUrl()).toEqual(draftId);
});

it('getIdFromUrl works on spectate url', () => {
    const draftId = 'abcdef';
    window.location = new URL('https://www.example.com/spectate/' + draftId) as any;
    expect(Util.getIdFromUrl()).toEqual(draftId);
});

it('getIdFromUrl works on spectate url with trailing slash', () => {
    const draftId = 'abcdef';
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

it('Recognize Civilisation', () => {
    const civ = Civilisation.BRITONS;
    expect(Util.isCivilisation(civ)).toEqual(true);
});

it('Reject generic DraftOption as not a Civilisation', () => {
    const draftOption = new DraftOption('generic-draft-option');
    expect(Util.isCivilisation(draftOption)).toEqual(false);
});

it('Recognize Array of Civilisations', () => {
    const civs = [Civilisation.BRITONS, Civilisation.BERBERS, Civilisation.CUMANS];
    expect(Util.isCivilisationArray(civs)).toEqual(true);
});

it('Reject Array that contains non-Civilisation element', () => {
    const draftOptions = [Civilisation.BRITONS, new DraftOption('generic-draft-option'), Civilisation.CUMANS];
    expect(Util.isCivilisationArray(draftOptions)).toEqual(false);
});

it('RANDOM is not a technical draft option', () => {
    expect(Util.isTechnicalDraftOption(DraftOption.RANDOM)).toEqual(false);
});

it('Transforms legacy draft replay format', () => {
    const legacyDraft = JSON.parse(fs.readFileSync(path.join(__filename, '..', 'testfiles', 'legacy.json')).toString('utf8'));
    const transformed = Util.transformDraftStateToCurrentFormat(legacyDraft);
    expect(transformed).toMatchSnapshot();
});

it('Does not modify current draft replay format', () => {
    const draftInCurrentFormat = JSON.parse(fs.readFileSync(path.join(__filename, '..', 'testfiles', 'current.json')).toString('utf8'));
    const transformed = Util.transformDraftStateToCurrentFormat(draftInCurrentFormat);
    expect(transformed).toEqual(draftInCurrentFormat);
});

it('Test getting random ID from zero DraftOptions', () => {
    const draftOptions: DraftOption[] = []
    const randomOption = Util.getRandomDraftOption(draftOptions);
    expect(randomOption.id).toEqual('RANDOM');
});
