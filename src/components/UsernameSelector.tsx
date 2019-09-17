import * as React from 'react';
import i18next from "i18next";
import {WithTranslation, withTranslation} from "react-i18next";

interface IProps extends WithTranslation {
    currentName: String | null;
    setNameCallback?: () => void;
}

class UsernameSelector extends React.Component<IProps, object> {

    public render() {
        let string = this.props.currentName;
        if (string === null || string === '') {
            string = i18next.t('setYourName') as string | null;
        }
        return (
            <button className='pure-button usernameSelector' onClick={this.callback}>{string}</button>
        );
    }


    private callback = () => {
        if (this.props.setNameCallback !== undefined) {
            this.props.setNameCallback();
        }
    }
}

export default withTranslation()(UsernameSelector);
