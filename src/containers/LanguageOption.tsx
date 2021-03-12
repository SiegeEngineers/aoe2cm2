import {ApplicationState} from '../types';
import * as actions from '../actions/';
import {connect} from 'react-redux';
import LanguageOption from "../components/menu/LanguageOption";
import {Dispatch} from "redux";


export function mapStateToProps(state: ApplicationState) {
    return {};
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSetLanguage: (language: string) => dispatch(actions.setLanguage(language))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageOption);
