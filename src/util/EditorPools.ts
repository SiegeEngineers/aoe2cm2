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
     * The number of a pool added to these: the lowest one, from two, whose id and name none of them
     * carries. The first pool is the default one, so a new pool is never the first; a pool may have
     * ended up with a number's name under another id, once the pool before it was removed.
     */
    nextPoolNumber(pools: Pool[], nameFor: (number: number) => string): number {
        const ids = pools.map(value => value.id);
        const names = pools.map(value => value.name);
        let number = 2;
        while (ids.includes(Pool.idFor(number)) || names.includes(nameFor(number))) {
            number++;
        }
        return number;
    },
};
