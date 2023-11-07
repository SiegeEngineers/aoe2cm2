import {IPresetEditorState} from "../types";
import {PresetEditorAction} from "../actions";
import {Actions} from "../constants";
import Preset from "../models/Preset";
import Turn from "../models/Turn";

export const initialPresetEditorState: IPresetEditorState = {
    editorPreset: null
};

export const presetEditorReducer = (state: IPresetEditorState = initialPresetEditorState, action: PresetEditorAction) => {
    switch (action.type) {
        case Actions.SET_EDITOR_PRESET:
            console.log(Actions.SET_EDITOR_PRESET, action.value);
            return {
                ...state,
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
                    const turnCopy = new Turn(t.player, t.action, t.exclusivity, t.hidden, t.parallel, t.executingPlayer, t.categories);
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
            return {
                ...state,
                editorPreset: new Preset(
                    state.editorPreset.name,
                    state.editorPreset.options,
                    action.turns,
                    state.editorPreset.presetId,
                    state.editorPreset.categoryLimits,
                )
            };

        case Actions.SET_EDITOR_NAME:
            console.log(Actions.SET_EDITOR_NAME, action.value);
            if (state.editorPreset === null) {
                return state;
            } else {
                return {
                    ...state,
                    editorPreset: new Preset(
                        action.value,
                        state.editorPreset.options,
                        state.editorPreset.turns,
                        state.editorPreset.presetId,
                        state.editorPreset.categoryLimits,
                    )
                };
            }

        case Actions.SET_EDITOR_DRAFT_OPTIONS:
            console.log(Actions.SET_EDITOR_DRAFT_OPTIONS, action.value);
            if (state.editorPreset === null) {
                return state;
            } else {
                const categoryLimits = JSON.parse(JSON.stringify(state.editorPreset.categoryLimits));;
                const categories = [...new Set(action.value.map(value => value.category))].sort();
                for (let cat in categoryLimits.pick) {
                    if (!categories.includes(cat)) {
                        delete categoryLimits.pick[cat];
                    }
                }
                for (let cat in categoryLimits.ban) {
                    if (!categories.includes(cat)) {
                        delete categoryLimits.ban[cat];
                    }
                }
                return {
                    ...state,
                    editorPreset: new Preset(
                        state.editorPreset.name,
                        action.value,
                        state.editorPreset.turns,
                        state.editorPreset.presetId,
                        categoryLimits,
                    )
                };
            }
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
                    editorPreset: new Preset(
                        state.editorPreset.name,
                        state.editorPreset.options,
                        state.editorPreset.turns,
                        state.editorPreset.presetId,
                        categoryLimits,
                    )
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
                    editorPreset: new Preset(
                        state.editorPreset.name,
                        state.editorPreset.options,
                        state.editorPreset.turns,
                        state.editorPreset.presetId,
                        categoryLimits,
                    )
                };
            }

    }
    return state;
};