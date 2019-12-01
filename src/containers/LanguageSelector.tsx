import {IStoreState} from '../types';
import * as actions from '../actions/';
import {connect} from 'react-redux';
import LanguageSelector from "../components/menu/LanguageSelector";
import {Dispatch} from "redux";


export function mapStateToProps(state: IStoreState) {
    return {};
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSetLanguage: (language: string) => dispatch(actions.setLanguage(language))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);
