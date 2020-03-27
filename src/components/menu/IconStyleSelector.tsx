import * as React from 'react';
import {WithTranslation, withTranslation} from "react-i18next";


interface IProps extends WithTranslation {
    activeIconStyle: string;
    iconStyle: string;
    displayString: string;
    onSetIconStyle?: (iconStyle: string) => void;
}

class IconStyleSelector extends React.Component<IProps, object> {

    public render() {

        const changeIconStyle = () => {
            if (this.props.onSetIconStyle !== undefined) {
                this.props.onSetIconStyle(this.props.iconStyle);
            }
        };

        let className = "civ-select pure-button";
        if (this.props.iconStyle === this.props.activeIconStyle) {
            className += ' pure-button-active';
        }

        const imageStatus = this.props.iconStyle === this.props.activeIconStyle ? 'on' : 'off';
        const image = `/images/${this.props.iconStyle}-${imageStatus}.png`;
        return (
            <button className={className} onClick={changeIconStyle}>
                <img alt={this.props.iconStyle} src={image}/>
            </button>
        );
    }
}

export default withTranslation()(IconStyleSelector);
