import * as React from 'react';

interface IProps {
    max: number;
    min: number;
    banRatio?: number;
    bottomGap?: number;
    /** Height to fit into. Without it, the room left below this element on the screen is used. */
    space?: number;
    children: React.ReactNode;
}

const STEP = 4;

/** Bans are stepped finer than picks: a pick row costs more than twice what a ban row does. */
const BAN_STEP = 2;
const DEFAULT_BAN_RATIO = 0.72;
const DEFAULT_BOTTOM_GAP = 16;

/** A panel narrower than this cannot carry the name written across it. */
const READABLE_WIDTH = 80;

/** Matches $stack-padding in the stylesheet. */
const STACK_PADDING = 8;

/**
 * Draws the panels inside it at the largest size whose rows still end above the fold. Sizes tried
 * on the way are measured but never painted, so only the size that wins is ever drawn.
 */
class FitPanels extends React.Component<IProps, object> {
    private readonly element = React.createRef<HTMLDivElement>();
    private frame: number | undefined;
    private measured: string = '';

    public componentDidMount(): void {
        this.fit();
        window.addEventListener('resize', this.schedule);
    }

    // Before the browser paints rather than on the next frame: the pool the draft moves on to holds
    // panels of its own, and it would be drawn once at the size of the pool it replaced.
    public componentDidUpdate(): void {
        this.fit();
    }

    public componentWillUnmount(): void {
        window.removeEventListener('resize', this.schedule);
        if (this.frame !== undefined) {
            window.cancelAnimationFrame(this.frame);
        }
    }

    public render() {
        return <div className="fit-panels" ref={this.element}>{this.props.children}</div>;
    }

    private schedule = () => {
        if (this.frame !== undefined) {
            window.cancelAnimationFrame(this.frame);
        }
        this.frame = window.requestAnimationFrame(() => {
            this.frame = undefined;
            this.fit();
        });
    };

    private fit(): void {
        const element = this.element.current;
        if (element === null || typeof window === 'undefined') {
            return;
        }
        const banRatio = this.props.banRatio === undefined ? DEFAULT_BAN_RATIO : this.props.banRatio;
        const bottomGap = this.props.bottomGap === undefined ? DEFAULT_BOTTOM_GAP : this.props.bottomGap;

        // From the page rather than the window: a scrolled draft still has to fit a screen.
        const top = element.getBoundingClientRect().top + window.scrollY;
        const available = this.props.space === undefined
            ? window.innerHeight - top - bottomGap
            : this.props.space;
        // jsdom and a hidden tab both report nothing to measure against.
        if (available <= 0 || element.clientWidth <= 0) {
            return;
        }

        if (this.signature(element, available) === this.measured) {
            return;
        }

        // Largest first, one step at a time: height does not fall steadily as the panels shrink,
        // since six wide maps take one row at 76px and two at 60px.
        const floor = this.readableBan(element);
        let size = this.props.min;
        let ban = this.banFor(size, banRatio, floor);
        for (let step = this.props.max; step >= this.props.min; step -= STEP) {
            const fitting = this.banThatFits(element, step, banRatio, floor, available);
            if (fitting !== undefined) {
                size = step;
                ban = fitting;
                break;
            }
        }
        this.apply(element, size, ban);
        this.measured = this.signature(element, available);
    }

    /** What the fit was made for. The settled height is part of it: a reflow alone must count. */
    private signature(element: HTMLDivElement, available: number): string {
        const panels = element.querySelectorAll('.pick, .ban, .steal, .choice').length;
        return `${element.clientWidth}:${Math.round(available)}:${panels}:${element.scrollHeight}`;
    }

    /** Asking for the height is what applies the size, and it draws nothing on the way. */
    private heightAt(element: HTMLDivElement, size: number, ban: number): number {
        this.apply(element, size, ban);
        return element.scrollHeight;
    }

    private apply(element: HTMLDivElement, size: number, ban: number): void {
        element.style.setProperty('--panel-pick', `${size}px`);
        element.style.setProperty('--panel-ban', `${ban}px`);
    }

    /** The ban that goes with a pick of this size: the board's proportion, never below the floor. */
    private banFor(size: number, banRatio: number, floor: number): number {
        return Math.min(size, Math.max(Math.round(size * banRatio), floor));
    }

    /**
     * The largest ban a pick of this size can be drawn beside, or undefined when even the smallest
     * one leaves the rows below the fold. A ban is glanced at and a pick is read all draft, so the
     * bans are what gives way, and only by as much as the picks need.
     */
    private banThatFits(element: HTMLDivElement, size: number, banRatio: number, floor: number,
                        available: number): number | undefined {
        const proportional = this.banFor(size, banRatio, floor);
        const smallest = Math.min(size, floor);
        if (this.heightAt(element, size, proportional) <= available) {
            return proportional;
        }
        if (smallest >= proportional || this.heightAt(element, size, smallest) > available) {
            return undefined;
        }
        for (let ban = proportional - BAN_STEP; ban > smallest; ban -= BAN_STEP) {
            if (this.heightAt(element, size, ban) <= available) {
                return ban;
            }
        }
        return smallest;
    }

    /** The row height at which a ban of the widest shape here is still READABLE_WIDTH wide. */
    private readableBan(element: HTMLDivElement): number {
        const aspects = Array.from(element.querySelectorAll('.chosen'))
            .map(pool => Number(window.getComputedStyle(pool).getPropertyValue('--panel-aspect')))
            .filter(aspect => aspect > 0);
        const aspect = aspects.length === 0 ? 1 : Math.max(...aspects);
        return Math.round((READABLE_WIDTH - STACK_PADDING * 2) * aspect + STACK_PADDING * 2);
    }
}

export default FitPanels;
