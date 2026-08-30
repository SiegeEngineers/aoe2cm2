import DraftOption from "../models/DraftOption";

/** Pictures far from square make for a strip rather than a panel, so the shape is kept sane. */
const MIN_ASPECT = 0.4;
const MAX_ASPECT = 1.6;

/** How far a picture may sit from its pool's shape before it is shown whole rather than cropped. */
const TOLERANCE = 0.25;

/** Enough of a pool's pictures to take a median from. */
const SAMPLE = 9;

const ratios: Map<string, number> = new Map<string, number>();
const loading: Set<string> = new Set<string>();
const failed: Set<string> = new Set<string>();
const awaited: WeakSet<HTMLImageElement> = new WeakSet<HTMLImageElement>();

const ratioOf = (image: HTMLImageElement): number => image.naturalHeight / image.naturalWidth;

/**
 * Gives the panels of a pool the shape of the pictures in it, as a custom property the stylesheet
 * sizes them from. Everything the app ships with is square and measures 1. An uploaded picture,
 * such as the wide map screenshots of a league, would otherwise be cropped or leave a gap above
 * the name.
 */
export const PanelAspect = {

    apply(element: HTMLElement | null, options: DraftOption[] = []): void {
        if (element === null) {
            return;
        }
        const again = () => PanelAspect.apply(element, options);
        const shown = Array.from(element.querySelectorAll('img'));
        // Each picture that lands can move the shape, and each is waited for only once.
        shown.filter(image => image.naturalWidth === 0 && !awaited.has(image)).forEach(image => {
            awaited.add(image);
            image.addEventListener('load', () => { awaited.delete(image); again(); }, {once: true});
        });

        const drawn = shown.filter(image => image.naturalWidth > 0 && image.naturalHeight > 0);
        // Nothing drafted here yet, so the pool's own pictures are measured rather than waiting for
        // the first pick to reshape every panel around it.
        const measured = drawn.length > 0 ? drawn.map(ratioOf) : PanelAspect.poolRatios(options, again);
        if (measured.length === 0) {
            return;
        }
        // The median rather than the mean: one odd picture should not reshape the pool around it.
        const sorted = measured.sort((a, b) => a - b);
        const aspect = Math.min(MAX_ASPECT, Math.max(MIN_ASPECT, sorted[Math.floor(sorted.length / 2)]));
        const value = aspect.toFixed(4);
        if (element.style.getPropertyValue('--panel-aspect') !== value) {
            element.style.setProperty('--panel-aspect', value);
            // The panels have a new shape, so whatever sized them to the screen measures again.
            window.dispatchEvent(new Event('resize'));
        }

        // The picture fills the panel, which crops whatever is shaped differently. The odd one
        // out, such as the dice among a pool of wide maps, is shown whole instead.
        drawn.forEach(image => {
            image.style.objectFit = Math.abs(ratioOf(image) - aspect) / aspect > TOLERANCE ? 'contain' : '';
        });
    },

    poolRatios(options: DraftOption[], again: () => void): number[] {
        const urls = options.map(option => option.imageUrls.unit)
            .filter(url => url.length > 0 && !failed.has(url))
            .slice(0, SAMPLE);
        urls.filter(url => !ratios.has(url) && !loading.has(url)).forEach(url => {
            loading.add(url);
            const image = new Image();
            image.addEventListener('load', () => {
                loading.delete(url);
                // A picture that lands without a size would divide the shape by zero.
                if (image.naturalWidth > 0 && image.naturalHeight > 0) {
                    ratios.set(url, ratioOf(image));
                } else {
                    failed.add(url);
                }
                again();
            }, {once: true});
            image.addEventListener('error', () => {
                loading.delete(url);
                failed.add(url);
            }, {once: true});
            image.src = url;
        });
        return urls.map(url => ratios.get(url)).filter((ratio): ratio is number => ratio !== undefined);
    },
};
