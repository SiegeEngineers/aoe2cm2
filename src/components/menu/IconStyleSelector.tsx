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

        let className = "civ-select button is-light";
        let style = {filter: 'grayscale(100%)'}
        if (this.props.iconStyle === this.props.activeIconStyle) {
            className += ' is-link is-hovered';
            style = {filter: 'none'}
        }

        const image = `/images/icon_${this.props.iconStyle}.png`;
        return (
            <button className={className} onClick={changeIconStyle}>
                <img alt={this.props.iconStyle} title={this.props.iconStyle} src={image} width="24px" height="24px" style={style}/>
            </button>
        );
    }
}

export default withTranslation()(IconStyleSelector);
