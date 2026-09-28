import {IPresetEditorState} from "../types";
import {PresetEditorAction} from "../actions";
import {Actions} from "../constants";
import Preset from "../models/Preset";
import Turn from "../models/Turn";
import Pool from "../models/Pool";
import DraftOption from "../models/DraftOption";
import {ICategoryLimits} from "../types";
import {EditorPools} from "../util/EditorPools";

export const initialPresetEditorState: IPresetEditorState = {
    editorPreset: null,
    activePool: 0
};

/** Drops the limits of categories no draft option carries any more. */
const prunedCategoryLimits = (limits: ICategoryLimits, options: DraftOption[]): ICategoryLimits => {
    const categories = options.map(option => option.category);
    const keep = (limit: { [category: string]: number }) => Object.keys(limit)
        .filter(category => categories.includes(category))
        .reduce((kept, category) => ({...kept, [category]: limit[category]}), {});
    return {pick: keep(limits.pick), ban: keep(limits.ban)};
};

/**
 * A turn that carries no pool of its own belongs to the first one, so the first pool keeps the id
 * that means exactly that, and the turns of the pool it replaces come with it.
 */
const withDefaultFirst = (pools: Pool[], turns: Turn[]): { pools: Pool[], turns: Turn[] } => {
    if (pools.some(pool => pool.id === Pool.DEFAULT_ID)) {
        return {pools, turns};
    }
    const renamed = pools[0];
    return {
        pools: [new Pool(Pool.DEFAULT_ID, renamed.name, renamed.options), ...pools.slice(1)],
        turns: turns.map(turn => turn.poolId === renamed.id
            ? Turn.withPoolId(turn, Pool.DEFAULT_ID) : turn),
    };
};

/** The preset with some of its parts replaced. */
const changed = (preset: Preset, changes: { name?: string, turns?: Turn[], categoryLimits?: ICategoryLimits, pools?: Pool[] }): Preset =>
    new Preset(changes.name ?? preset.name, changes.pools ?? preset.pools, changes.turns ?? preset.turns, preset.presetId,
        changes.categoryLimits ?? preset.categoryLimits);

/** The preset drawing from these pools, its limits on categories no option carries any more dropped. */
const withPools = (preset: Preset, pools: Pool[], turns: Turn[] = preset.turns): Preset =>
    changed(preset, {turns, pools, categoryLimits: prunedCategoryLimits(preset.categoryLimits, Pool.optionsOf(pools))});

export const presetEditorReducer = (state: IPresetEditorState = initialPresetEditorState, action: PresetEditorAction) => {
    switch (action.type) {
        case Actions.SET_EDITOR_PRESET:
            console.log(Actions.SET_EDITOR_PRESET, action.value);
            return {
                ...state,
                activePool: 0,
                editorPreset: action.value
            };

        case Actions.SET_EDITOR_TURN:
            console.log(Actions.SET_EDITOR_TURN, action.value, action.index);
            const editorPreset = state.editorPreset;
            if (editorPreset === null) {
                return state;
            } else {
                if (action.value === null) {
                    if (editorPreset.turns.length > action.index) {
                        editorPreset.turns.splice(action.index, 1);
                    }
                } else if (editorPreset.turns.length <= action.index) {
                    editorPreset.turns.push(action.value);
                } else {
                    editorPreset.turns[action.index] = action.value;
                }
                return {
                    ...state,
                    editorPreset: Preset.fromPojo(editorPreset) as Preset
                };
            }

        case Actions.DUPLICATE_EDITOR_TURN:
            console.log(Actions.DUPLICATE_EDITOR_TURN, action.index);
            const editorPreset2 = state.editorPreset;
            if (editorPreset2 === null) {
                return state;
            } else {
                if (editorPreset2.turns.length > action.index) {
                    const t = editorPreset2.turns[action.index];
                    const turnCopy = new Turn(t.player, t.action, t.exclusivity, t.hidden, t.parallel, t.executingPlayer, t.categories, undefined, t.poolId);
                    editorPreset2.turns.splice(action.index, 0, turnCopy);
                }
                return {
                    ...state,
                    editorPreset: Preset.fromPojo(editorPreset2) as Preset
                };
            }

        case Actions.SET_EDITOR_TURN_ORDER:
            console.log(Actions.SET_EDITOR_TURN_ORDER, action.turns);

            if (state.editorPreset === null) {
                return state;
            }
            // The sortable list hands the turns back as plain objects, without the methods of a Turn.
            return {
                ...state,
                editorPreset: changed(state.editorPreset, {turns: Turn.fromPojoArray(action.turns)})
            };

        case Actions.SET_EDITOR_NAME:
            console.log(Actions.SET_EDITOR_NAME, action.value);
            if (state.editorPreset === null) {
                return state;
            } else {
                return {
                    ...state,
                    editorPreset: changed(state.editorPreset, {name: action.value})
                };
            }

        case Actions.SET_EDITOR_DRAFT_OPTIONS:
            console.log(Actions.SET_EDITOR_DRAFT_OPTIONS, action.value);
            if (state.editorPreset === null) {
                return state;
            } else {
                // The options being set are those of the pool the editor is showing.
                const activeIndex = EditorPools.activeIndex(state);
                const pools = state.editorPreset.pools.map((pool, index) =>
                    index === activeIndex ? new Pool(pool.id, pool.name, action.value) : pool);
                return {
                    ...state,
                    editorPreset: withPools(state.editorPreset, pools)
                };
            }
        case Actions.SET_EDITOR_POOLS: {
            if (state.editorPreset === null || action.value.length === 0) {
                return state;
            }
            // The turns of a pool that is gone move to the first one; other turns draw from no pool.
            const poolIds = action.value.map(value => value.id);
            const kept = withDefaultFirst(action.value, state.editorPreset.turns.map(turn =>
                !turn.choosesDraftOption() || poolIds.includes(turn.poolId)
                    ? turn
                    : Turn.withPoolId(turn, poolIds[0])));
            const pools = Pool.namedWhenAlone(kept.pools);
            return {
                ...state,
                activePool: Math.min(state.activePool, pools.length - 1),
                editorPreset: withPools(state.editorPreset, pools, kept.turns)
            };
        }
        case Actions.SET_EDITOR_ACTIVE_POOL:
            return {...state, activePool: Math.max(0, action.value)};
        case Actions.SET_EDITOR_CATEGORY_LIMIT_PICK:
            console.log(Actions.SET_EDITOR_CATEGORY_LIMIT_PICK, action.key, action.value);
            if (state.editorPreset === null) {
                return state;
            } else {
                const categoryLimits = JSON.parse(JSON.stringify(state.editorPreset.categoryLimits));
                if (action.value === null) {
                    delete categoryLimits.pick[action.key];
                } else {
                    categoryLimits.pick[action.key] = action.value;
                }
                return {
                    ...state,
                    editorPreset: changed(state.editorPreset, {categoryLimits})
                };
            }
        case Actions.SET_EDITOR_CATEGORY_LIMIT_BAN:
            console.log(Actions.SET_EDITOR_CATEGORY_LIMIT_BAN, action.key, action.value);
            if (state.editorPreset === null) {
                return state;
            } else {
                const categoryLimits = {
                    pick: state.editorPreset.categoryLimits.pick,
                    ban: state.editorPreset.categoryLimits.ban
                };
                if (action.value === null) {
                    delete categoryLimits.ban[action.key];
                } else {
                    categoryLimits.ban[action.key] = action.value;
                }
                return {
                    ...state,
                    editorPreset: changed(state.editorPreset, {categoryLimits})
                };
            }

    }
    return state;
};