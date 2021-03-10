import {IIconStyleState} from "../types";
import {IconStyleAction} from "../actions";
import {Actions} from "../constants";
import {Util} from "../util/Util";

export const initialIconStyleState: IIconStyleState = {
    iconStyle: Util.getIconStyleFromLocalStorage('units'),
};

export const iconStyleReducer = (state: IIconStyleState = initialIconStyleState, action: IconStyleAction) => {
    if (action.type === Actions.SET_ICON_STYLE) {
        console.log(Actions.SET_ICON_STYLE, action.iconStyle);
        Util.writeIconStyleToLocalStorage(action.iconStyle);
        return {
            ...state,
            iconStyle: action.iconStyle
        };
    } else {
        return state;
    }
};