import {IPresetEditorState} from "../types";
import DraftOption from "../models/DraftOption";
import Pool from "../models/Pool";

/** What the preset editor shows of the pools of the preset being edited. */
export const EditorPools = {
    pools(state: IPresetEditorState): Pool[] {
        const preset = state.editorPreset;
        return preset === null ? [] : preset.pools;
    },

    /** The index of the pool on show, held within the pools there are. */
    activeIndex(state: IPresetEditorState): number {
        const pools = EditorPools.pools(state);
        return Math.max(0, Math.min(state.activePool, pools.length - 1));
    },

    /** The options of the pool on show. */
    activeOptions(state: IPresetEditorState): DraftOption[] {
        const pools = EditorPools.pools(state);
        return pools.length === 0 ? [] : pools[EditorPools.activeIndex(state)].options;
    },

    /**
     * The number of a pool added to these: the lowest one, from two, whose id none of them carries.
     * The first pool is the default one, so a new pool is never the first.
     */
    nextPoolNumber(pools: Pool[]): number {
        const existing = pools.map(value => value.id);
        let number = 2;
        while (existing.includes(Pool.idFor(number))) {
            number++;
        }
        return number;
    },
};
