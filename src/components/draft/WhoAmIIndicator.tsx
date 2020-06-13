import * as React from 'react';
import Player from '../../constants/Player';
import {Trans, WithTranslation, withTranslation} from "react-i18next";

interface IProps extends WithTranslation {
    forPlayer: Player,
    whoAmI: Player | undefined,
}

class WhoAmIIndicator extends React.Component<IProps, object> {

    public render() {
        if (this.props.forPlayer === this.props.whoAmI) {
            return (
                <span className='tag is-dark has-background-info-dark has-text-weight-bold' style={{height: 'auto'}}>
                    <Trans i18nKey={'you'}>you</Trans>
                </span>
            );
        } else {
            return null;
        }
    }
}


export default withTranslation()(WhoAmIIndicator);
