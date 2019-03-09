import * as React from 'react';
import ActionType from "../models/ActionType";
import Civilisation from "../models/Civilisation";
import '../pure-min.css'
import '../style2.css'


interface IProps {
    civilisation?: Civilisation;
    active: boolean;
    actionType: ActionType;
}

class CivPanel extends React.Component<IProps, object> {
    public render() {
        const civilisation: Civilisation | undefined = this.props.civilisation;
        let imageSrc: string = "";
        let civilisationName = '';
        if (civilisation !== undefined) {
            imageSrc = "images/civs/" + civilisation.name.toLocaleLowerCase() + "_orig.png";
            civilisationName = civilisation.name;
        }
        let className: string = this.props.actionType.toString() + " card";
        if(this.props.active){
            className += " active-choice";
        }
        let contentClass: string = "box-content";
        if (this.props.civilisation !== undefined) {
            contentClass += " visible";
        }
        return (
            <div className={className}>
                <div className={contentClass}>
                    <div className="stretchy-wrapper">
                        <div className="stretchy-image">
                            <img src={imageSrc}/>
                        </div>
                        <div className="stretchy-text">
                            {civilisationName}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CivPanel;
