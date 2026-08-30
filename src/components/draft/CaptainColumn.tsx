import * as React from 'react';
import {default as ModelPlayer} from '../../constants/Player';
import PlayerDraftState from "../../containers/PlayerDraftState";
import Preset from "../../models/Preset";
import Segment from "../../models/Segment";
import CustomName from './CustomName';
import WhoAmIIndicator from "../../containers/WhoAmIIndicator";
import PlayerOnlineStatus from "../../containers/PlayerOnlineStatus";
import {Trans} from "react-i18next";
import FitPanels from "./FitPanels";

interface IProps {
    preset: Preset;
    player: ModelPlayer;
    name: string;
    flipped: boolean;
    smooch: boolean;
    simplifiedUI: boolean;
    /** Room to leave below the column for whatever the stage puts under it. */
    reserve?: number;
    minPanel?: number;
}

interface IState {
    /** Height the pools have to draw their panels in, or undefined until the column is measured. */
    space?: number;
    width?: number;
    /** What each pool took of the share it was given, or undefined until the pools have been drawn. */
    drawn?: number[];
    /** The shape of each pool's pictures, read from what the pools were drawn with. */
    shapes?: number[];
}

const BOTTOM_GAP = 16;
const MAX_PANEL = 128;
const DEFAULT_MIN_PANEL = 80;

/** Room left of a share below this is quantisation rather than a pool that cannot grow. */
const SPARE = 8;

/** Matches the margin and the padding a panel is given in the stylesheet. */
const PANEL_MARGIN = 8;
const STACK_PADDING = 8;

/** What the name above a pool takes of its share. */
const POOL_LABEL = 24;

/** Two rows of the largest panel, which is what a pool small enough to be drawn large is given. */
const LARGE_POOL = 2 * (MAX_PANEL + PANEL_MARGIN) + POOL_LABEL;

/**
 * One captain down the side of the draft, with a section per option pool. The name is written once
 * above the sections rather than once per pool, which is what makes a long draft fit on a screen.
 */
class CaptainColumn extends React.Component<IProps, IState> {
    public readonly state: IState = {};
    private readonly column = React.createRef<HTMLDivElement>();
    private readonly head = React.createRef<HTMLDivElement>();
    private frame: number | undefined;

    public componentDidMount(): void {
        this.measure();
        window.addEventListener('resize', this.schedule);
    }

    public componentDidUpdate(): void {
        this.schedule();
    }

    public componentWillUnmount(): void {
        window.removeEventListener('resize', this.schedule);
        if (this.frame !== undefined) {
            window.cancelAnimationFrame(this.frame);
        }
    }

    public render() {
        const segments = this.props.preset.segmentsOrDefault();
        return (
            // The column is the captain's panel here, so it carries the id the board styles by.
            <div className="captain-column" id={'player-' + this.props.player.toString().toLowerCase()}
                 ref={this.column}>
                <div className="captain-column-head" ref={this.head}>
                    {!this.props.simplifiedUI && <div className="is-uppercase has-text-grey is-size-7 captains-line">
                        <span className="player-type"><Trans>{this.props.player}</Trans></span>&nbsp;
                        <WhoAmIIndicator forPlayer={this.props.player}/>&nbsp;
                        <PlayerOnlineStatus forPlayer={this.props.player}/>
                    </div>}
                    <h4 className="player-name"><CustomName name={this.props.name}/></h4>
                </div>
                {segments.map(segment => (
                    <FitPanels max={MAX_PANEL} min={this.minPanel()} space={this.share(segment.id)}
                               key={segment.id}>
                        {this.pool(segment.id, segment.name)}
                    </FitPanels>
                ))}
            </div>
        );
    }

    private minPanel(): number {
        return this.props.minPanel === undefined ? DEFAULT_MIN_PANEL : this.props.minPanel;
    }

    private pool(segmentId: string, name: string) {
        return (
            <React.Fragment key={segmentId}>
                <div className="captain-pool-label">
                    <span>{name}</span>
                    <span className="captain-pool-rule"/>
                </div>
                <PlayerDraftState preset={this.props.preset}
                                  player={this.props.player}
                                  name={this.props.name}
                                  segmentId={segmentId}
                                  hideHeader={true}
                                  flipped={this.props.flipped}
                                  smooch={this.props.smooch}
                                  simplifiedUI={this.props.simplifiedUI}/>
            </React.Fragment>
        );
    }

    /**
     * How much of the column a pool gets. By panel count, four maps would go on being sized by
     * forty civilisations; evenly, the busy pool is unreadable. The square root sits between. The
     * split is made of the preset alone, so no panel changes size while the draft is played.
     */
    private share(segmentId: string): number | undefined {
        const space = this.state.space;
        if (space === undefined) {
            return undefined;
        }
        const segments = this.props.preset.segmentsOrDefault();
        const weights = segments.map(segment => Math.sqrt(Math.max(this.panelsIn(segment.id), 1)));
        const total = weights.reduce((sum, weight) => sum + weight, 0);
        const index = segments.findIndex(segment => segment.id === segmentId);
        if (index < 0 || total === 0) {
            return space;
        }
        const large = this.largePools(segments, space);
        if (large[index]) {
            return LARGE_POOL;
        }
        const left = Math.max(this.minPanel(),
            space - large.filter(Boolean).length * LARGE_POOL);
        const rest = weights.reduce((sum, weight, pool) => large[pool] ? sum : sum + weight, 0);
        const share = (pool: number) => rest === 0 ? left : left * weights[pool] / rest;
        const drawn = this.state.drawn;
        if (drawn === undefined || drawn.length !== segments.length) {
            return share(index);
        }
        // A pool of many panels is drawn at its smallest and still cannot fill the share it was
        // given. What it leaves goes to the pools that used theirs, which is where it can be seen.
        const spare = drawn.reduce((sum, height, pool) =>
            large[pool] ? sum : sum + Math.max(0, share(pool) - height), 0);
        const wanted = weights.reduce((sum, weight, pool) =>
            large[pool] || share(pool) - drawn[pool] > SPARE ? sum : sum + weight, 0);
        if (share(index) - drawn[index] > SPARE || wanted === 0) {
            return share(index);
        }
        return share(index) + spare * weights[index] / wanted;
    }

    /**
     * The pools drawn at the size of a pick on the board rather than fitted: a pool of a couple of
     * rows costs the column little, and a map nobody can read is the whole reason for the stage.
     * One of them the column carries whatever its height; the rest give way, busiest first, until
     * what is left of the column is a row for every other pool.
     */
    private largePools(segments: Segment[], space: number): boolean[] {
        const large = segments.map((segment, pool) => this.fitsTwoRows(pool, segment.id));
        const needed = () => large.reduce((sum, taken) =>
            sum + (taken ? LARGE_POOL : this.minPanel() + POOL_LABEL), 0);
        while (large.filter(taken => taken).length > 1 && needed() > space) {
            const busiest = large.reduce((worst, taken, pool) => !taken ? worst
                : worst < 0 || this.panelsIn(segments[pool].id) > this.panelsIn(segments[worst].id)
                    ? pool : worst, -1);
            large[busiest] = false;
        }
        return large;
    }

    /** Whether a pool's panels take no more than two rows when drawn at the largest size. */
    private fitsTwoRows(pool: number, segmentId: string): boolean {
        const shapes = this.state.shapes;
        const width = this.state.width;
        if (shapes === undefined || width === undefined || shapes[pool] === undefined) {
            return false;
        }
        const panel = (MAX_PANEL - STACK_PADDING * 2) / shapes[pool] + STACK_PADDING * 2;
        const perRow = Math.max(1, Math.floor((width + PANEL_MARGIN) / (panel + PANEL_MARGIN)));
        return this.panelsIn(segmentId) <= 2 * perRow;
    }

    private panelsIn(segmentId: string): number {
        return this.props.preset.turns.filter(turn =>
            turn.player === this.props.player
            && turn.choosesDraftOption()
            && turn.segmentIdOrDefault() === segmentId).length;
    }

    /** The shape of a pool's pictures, the widest of them, as PanelAspect wrote it. */
    private static shapeOf(pool: Element): number {
        const aspects = Array.from(pool.querySelectorAll('.chosen'))
            .map(panels => Number(window.getComputedStyle(panels).getPropertyValue('--panel-aspect')))
            .filter(aspect => aspect > 0);
        return aspects.length === 0 ? 1 : Math.max(...aspects);
    }

    private schedule = () => {
        if (this.frame !== undefined) {
            window.cancelAnimationFrame(this.frame);
        }
        this.frame = window.requestAnimationFrame(() => {
            this.frame = undefined;
            this.measure();
        });
    };

    private measure(): void {
        const column = this.column.current;
        if (column === null || typeof window === 'undefined') {
            return;
        }
        if (column.clientWidth <= 0) {
            return;
        }
        const top = column.getBoundingClientRect().top + window.scrollY;
        const reserve = this.props.reserve === undefined ? 0 : this.props.reserve;
        // The name above the pools is part of the column but not of any pool's share.
        const head = this.head.current === null ? 0 : this.head.current.offsetHeight;
        // Never nothing to divide, or every pool would measure the whole screen for itself.
        const space = Math.max(window.innerHeight - top - BOTTOM_GAP - reserve - head, this.minPanel());
        const width = column.clientWidth;
        if (this.state.space === undefined || Math.abs(this.state.space - space) > 2
            || this.state.width !== width) {
            // The shares are about to change, so what the pools take of them has to be read again.
            this.setState({space, width, drawn: undefined});
            return;
        }
        const pools = Array.from(column.querySelectorAll('.fit-panels'));
        const shapes = pools.map(pool => CaptainColumn.shapeOf(pool));
        if (this.state.drawn === undefined) {
            this.setState({drawn: pools.map(pool => (pool as HTMLElement).offsetHeight), shapes});
            return;
        }
        // A pool's pictures land after it was first drawn, and the shape they give it is what says
        // whether it is small enough to be drawn large. What the pools took is not read again: it
        // is what the shares were made of, and reading it back would chase its own tail.
        if (shapes.some((shape, pool) => shape !== (this.state.shapes || [])[pool])) {
            this.setState({shapes});
        }
    }
}

export default CaptainColumn;
