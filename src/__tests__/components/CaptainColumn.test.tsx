import {shallow} from "enzyme";
import CaptainColumn from "../../components/draft/CaptainColumn";
import FitPanels from "../../components/draft/FitPanels";
import PlayerDraftState from "../../containers/PlayerDraftState";
import Preset from "../../models/Preset";
import Segment from "../../models/Segment";
import DraftOption from "../../models/DraftOption";
import Player from "../../constants/Player";
import Turn from "../../models/Turn";

const maps = new Segment('maps', 'Maps', [new DraftOption('arabia')]);
const civs = new Segment('civs', 'Civilisations', [new DraftOption('Franks')]);
const preset = new Preset('Segmented Preset', [], [], undefined, undefined, [maps, civs]);

const inPool = (turn: Turn, segmentId: string) => Turn.withSegmentId(turn, segmentId);
const turns = [
    ...Array(4).fill(inPool(Turn.HOST_PICK, 'maps')),
    ...Array(12).fill(inPool(Turn.HOST_PICK, 'civs')),
];
const twoPools = new Preset('Segmented Preset', [], turns, undefined, undefined, [maps, civs]);

const column = () => shallow(
    <CaptainColumn preset={preset} player={Player.HOST} name={'Yodit'} flipped={false} smooch={false}
                   simplifiedUI={false}/>);

const shares = (drawn?: number[], state: object = {}) => {
    const component = shallow(
        <CaptainColumn preset={twoPools} player={Player.HOST} name={'Yodit'} flipped={false}
                       smooch={false} simplifiedUI={false}/>);
    component.setState({space: 600, drawn, ...state});
    return component.find(FitPanels).map(panels => Math.round(panels.prop('space') as number));
};

/** A column wide enough for three square panels of the largest size, and pools of square pictures. */
const measured = {width: 400, shapes: [1, 1]};

it('writes the captain name once and names every pool below it', () => {
    const component = column();
    expect(component.find('.player-name')).toHaveLength(1);
    expect(component.find('.captain-pool-label').map(label => label.text()))
        .toEqual(['Maps', 'Civilisations']);
});

it('shows a section of the captain panel per pool', () => {
    const sections = column().find(PlayerDraftState);
    expect(sections.map(section => section.prop('segmentId'))).toEqual(['maps', 'civs']);
    expect(sections.map(section => section.prop('hideHeader'))).toEqual([true, true]);
});

it('carries the id the board colours the captain by', () => {
    expect(column().find('#player-host')).toHaveLength(1);
});

it('fits every pool on a share of the column of its own', () => {
    expect(column().find(FitPanels)).toHaveLength(2);
});

it('divides the column by pool, the busier pool getting more of it', () => {
    const [mapPool, civPool] = shares();
    expect(mapPool).toBeLessThan(civPool);
    expect(mapPool + civPool).toBe(600);
});

it('hands the room a pool cannot fill to the pool that can', () => {
    const [mapPool, civPool] = shares();
    // The civilisations are drawn at their smallest and still leave a hundred pixels of their share.
    const [grown, given] = shares([mapPool, civPool - 100]);
    expect(grown).toBe(mapPool + 100);
    expect(given).toBe(civPool);
});

it('draws a pool of a couple of rows at the largest size, and fits the rest around it', () => {
    const [mapPool, civPool] = shares(undefined, measured);
    // Two rows of the largest panel: the four maps fit in one row, their bans in another.
    expect(mapPool).toBe(296);
    expect(civPool).toBe(600 - 296);
});

it('gives up the largest size for all but one pool when the column cannot carry them', () => {
    const bothSmall = new Preset('Segmented Preset', [], [
        ...Array(4).fill(inPool(Turn.HOST_PICK, 'maps')),
        ...Array(6).fill(inPool(Turn.HOST_PICK, 'civs')),
    ], undefined, undefined, [maps, civs]);
    const component = shallow(
        <CaptainColumn preset={bothSmall} player={Player.HOST} name={'Yodit'} flipped={false}
                       smooch={false} simplifiedUI={false}/>);
    component.setState({space: 400, ...measured});
    const [mapPool, civPool] = component.find(FitPanels)
        .map(panels => Math.round(panels.prop('space') as number));
    // Both pools would take two rows of the largest panel, and the column has room for one, so
    // the busier of them gives way.
    expect(mapPool).toBe(296);
    expect(civPool).toBe(400 - 296);
});
