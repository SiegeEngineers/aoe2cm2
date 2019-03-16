import * as React from 'react';
import '../pure-min.css'
import '../style2.css'


interface IProps {
    language: string;
    onSetLanguage?: (language: string) => void;
}

class LanguageSelector extends React.Component<IProps, object> {

    public render() {

        const changeLanguage = () => {
            if (this.props.onSetLanguage !== undefined) {
                this.props.onSetLanguage(this.props.language);
            }
        };

        const imageSrc = '/images/flags/' + this.props.language + '.svg';

        return (
            <span className="language-selector" onClick={changeLanguage}>
                <img src={imageSrc} alt={this.props.language} style={{height: '2rem'}}/>
            </span>
        );
    }
}

export default LanguageSelector;
