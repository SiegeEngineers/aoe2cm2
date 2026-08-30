import Preset from "../models/Preset";
import Segment from "../models/Segment";
import Turn from "../models/Turn";
import Player from "../constants/Player";
import Action from "../constants/Action";
import Exclusivity from "../constants/Exclusivity";
import {ICategoryLimits} from "../types";

/** The first pool keeps the default id, so turns that carry none of their own belong to it. */
const FIRST_SEGMENT_ID = Segment.DEFAULT_ID;
const SECOND_SEGMENT_ID = 'segment-2';

export const PresetCombiner = {

    /**
     * One preset that plays the turns of both in order, each on its own pool, with a pause between
     * them. Only presets that leakingCategories() and sharedOptionIds() both clear may be combined.
     */
    combine(first: Preset, second: Preset, name: string): Preset {
        const segments = [
            new Segment(FIRST_SEGMENT_ID, first.name, first.options),
            new Segment(SECOND_SEGMENT_ID, second.name, second.options),
        ];
        const turns: Turn[] = [
            ...first.turns.map(turn => PresetCombiner.copy(turn, FIRST_SEGMENT_ID)),
            // The pause chooses nothing, so it carries no category: the default one would have to
            // be a category of some option, which neither half of the draft need have.
            new Turn(Player.NONE, Action.PAUSE, Exclusivity.GLOBAL, false, false, Player.NONE, []),
            ...second.turns.map(turn => PresetCombiner.copy(turn, SECOND_SEGMENT_ID)),
        ];
        return new Preset(name, [], turns, undefined,
            PresetCombiner.mergeCategoryLimits(first.categoryLimits, second.categoryLimits), segments);
    },

    /** Both presets may descend from the same one, so the turns are copied under fresh ids. */
    copy(turn: Turn, segmentId: string): Turn {
        return new Turn(turn.player, turn.action, turn.exclusivity, turn.hidden, turn.parallel,
            turn.executingPlayer, turn.categories, undefined, segmentId);
    },

    /** The categories of the two presets do not meet, so the looser limit only guards against data. */
    mergeCategoryLimits(first: ICategoryLimits, second: ICategoryLimits): ICategoryLimits {
        const merge = (a: { [category: string]: number }, b: { [category: string]: number }) => {
            const merged: { [category: string]: number } = {...a};
            Object.keys(b).forEach(category => {
                merged[category] = merged.hasOwnProperty(category)
                    ? Math.max(merged[category], b[category]) : b[category];
            });
            return merged;
        };
        return {pick: merge(first.pick, second.pick), ban: merge(first.ban, second.ban)};
    },

    /** The ids both presets use: an option belongs to one pool, so they have to stay unique. */
    sharedOptionIds(first: Preset, second: Preset): string[] {
        const secondIds = second.options.map(value => value.id);
        return first.options.map(value => value.id).filter(id => secondIds.includes(id));
    },

    /**
     * A category limit is spent over the whole draft, so one preset's limit must not reach the
     * other's options, or that half is played under a rule its own preset never had. Returns the
     * categories where it would.
     */
    leakingCategories(first: Preset, second: Preset): string[] {
        const reaching = (preset: Preset, other: Preset) => {
            const categories = other.options.map(option => option.category);
            return Object.keys(preset.categoryLimits.pick)
                .concat(Object.keys(preset.categoryLimits.ban))
                .filter(category => categories.includes(category));
        };
        const all = reaching(first, second).concat(reaching(second, first));
        return all.filter((category, index) => all.indexOf(category) === index);
    },
};
