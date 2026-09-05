import Preset from "../models/Preset";
import Segment from "../models/Segment";
import Turn from "../models/Turn";
import Player from "../constants/Player";
import Action from "../constants/Action";
import Exclusivity from "../constants/Exclusivity";
import {ICategoryLimits} from "../types";

export const PresetCombiner = {

    /**
     * One preset that plays the turns of both in order, with a pause between them. Every pool of
     * either preset becomes a pool of the combined one, under a fresh id so that the two cannot
     * clash. Only presets that leakingCategories() and sharedOptionIds() both clear may be combined.
     */
    combine(first: Preset, second: Preset, name: string): Preset {
        const pools = [
            ...first.segments.map(segment => ({preset: first, segment})),
            ...second.segments.map(segment => ({preset: second, segment})),
        ];
        // The pools are numbered through, so the first keeps the default id and the rest cannot clash.
        const idOf = (preset: Preset, segmentId: string) =>
            Segment.idFor(1 + pools.findIndex(pool => pool.preset === preset && pool.segment.id === segmentId));
        // A pool that was a preset's only one has no name of its own, so it goes by the preset's.
        const segments = pools.map(pool => new Segment(idOf(pool.preset, pool.segment.id),
            pool.segment.name || pool.preset.name, pool.segment.options));
        const turns: Turn[] = [
            ...first.turns.map(turn => PresetCombiner.copy(turn, idOf(first, turn.segmentId))),
            // The pause chooses nothing, so it carries no category: the default one would have to
            // be a category of some option, which neither half of the draft need have.
            new Turn(Player.NONE, Action.PAUSE, Exclusivity.GLOBAL, false, false, Player.NONE, []),
            ...second.turns.map(turn => PresetCombiner.copy(turn, idOf(second, turn.segmentId))),
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
        return [...new Set(reaching(first, second).concat(reaching(second, first)))];
    },
};
