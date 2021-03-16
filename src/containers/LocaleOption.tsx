import {ApplicationState} from '../types';
import * as actions from '../actions/';
import {connect} from 'react-redux';
import LocaleOption from "../components/menu/LocaleOption";
import {Dispatch} from "redux";


export function mapStateToProps(state: ApplicationState) {
    return {};
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSetLanguage: (language: string) => dispatch(actions.setLanguage(language))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocaleOption);
