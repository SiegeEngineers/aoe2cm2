import {IPresetEditorState} from "../types";
import {PresetEditorAction} from "../actions";
import {Actions} from "../constants";
import Preset from "../models/Preset";

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
                    action.turns
                )
            };

        case Actions.SET_EDITOR_NAME:
            console.log(Actions.SET_EDITOR_NAME, action.value);
            if (state.editorPreset === null) {
                return state;
            } else {
                return {
                    ...state,
                    editorPreset: new Preset(action.value, state.editorPreset.options, state.editorPreset.turns)
                };
            }

        case Actions.SET_EDITOR_DRAFT_OPTIONS:
            console.log(Actions.SET_EDITOR_DRAFT_OPTIONS, action.value);
            if (state.editorPreset === null) {
                return state;
            } else {
                return {
                    ...state,
                    editorPreset: new Preset(state.editorPreset.name, action.value, state.editorPreset.turns)
                };
            }

    }
    return state;
};