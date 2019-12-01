import {IModalState} from "../types";
import {ModalAction} from "../actions";
import {Actions} from "../constants";

export const initialModalState: IModalState = {
    showModal: false,
};

export const modalReducer = (state: IModalState = initialModalState, action: ModalAction) => {
    switch (action.type) {
        case Actions.SHOW_NAME_MODAL:
            console.log(Actions.SHOW_NAME_MODAL);
            return {
                ...state,
                showModal: true
            };
        case Actions.CHANGE_OWN_NAME:
            console.log(Actions.CHANGE_OWN_NAME, action);
            return {...state, showModal: action.value === null};
    }
    return state;
};