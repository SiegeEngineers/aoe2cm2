import * as React from 'react';
import {WithTranslation, withTranslation} from "react-i18next";
import {RouteComponentProps} from "react-router";
import {withRouter} from "react-router-dom";


interface IProps extends WithTranslation, RouteComponentProps<any> {
    activeIconStyle: string;
    iconStyle: string;
    displayString: string;
    onSetIconStyle?: (iconStyle: string) => void;
}

class IconStyleSelector extends React.Component<IProps, object> {

    componentDidMount() {
        let query = new URLSearchParams(this.props.location.search);
        const iconStyle = query.get('iconStyle');
        if (iconStyle === this.props.iconStyle) {
            this.propagateIconStyleChange();
        }
    }

    public render() {
        let className = "civ-select button is-light has-tooltip-left has-tooltip-arrow";
        let style = {filter: 'grayscale(100%)'}
        if (this.props.iconStyle === this.props.activeIconStyle) {
            className += ' is-link is-hovered';
            style = {filter: 'none'}
        }

        const image = `/images/icon_${this.props.iconStyle}.png`;
        return (
            <button className={className} onClick={this.changeIconStyle}
                    aria-label={this.props.displayString}
                    data-tooltip={this.props.displayString}>
                <img alt={this.props.iconStyle} src={image} width="24px" height="24px" style={style}/>
            </button>
        );
    }

    private changeIconStyle = () => {
        this.updateUrlParameters();
        this.propagateIconStyleChange();
    };

    private updateUrlParameters() {
        let searchParams = new URLSearchParams(this.props.location.search);
        searchParams.set('iconStyle', this.props.iconStyle);
        this.props.history.push({
            search: searchParams.toString()
        });
    }

    private propagateIconStyleChange() {
        if (this.props.onSetIconStyle !== undefined) {
            this.props.onSetIconStyle(this.props.iconStyle);
        }
    }
}

export default withTranslation()(withRouter(IconStyleSelector));
