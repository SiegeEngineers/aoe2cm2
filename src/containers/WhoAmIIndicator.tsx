import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import * as actions from "../actions";
import WhoAmIIndicator from "../components/draft/WhoAmIIndicator";


export function mapStateToProps(state: ApplicationState) {
    return {
        whoAmI: state.ownProperties.whoAmI
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>, ownProps: any) {
}

export default connect(mapStateToProps, mapDispatchToProps)(WhoAmIIndicator);
