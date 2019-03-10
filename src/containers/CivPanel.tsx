import {IStoreState} from '../types';
import {connect} from 'react-redux';
import CivPanel from "../components/CivPanel";


export function mapStateToProps(state: IStoreState) {
    return {
        whoAmI: state.whoAmI
    };
}

export function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CivPanel);