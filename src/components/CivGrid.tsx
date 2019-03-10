import * as React from 'react';
import '../pure-min.css'
import '../style2.css'
import Civilisation from "../models/Civilisation";
import CivPanel from "../containers/CivPanel";
import ActionType from "../models/ActionType";
import Socket = SocketIOClient.Socket;

interface IProps {
    civilisations: Civilisation[],
    socket: Socket
}

class CivGrid extends React.Component<IProps, object> {
    public render() {

        const civPanels = this.props.civilisations.map((civ, index) => {
            return React.createElement(CivPanel, {actionType: ActionType.CHOICE, active: false, civilisation: civ, socket: this.props.socket});
        });

        return (
            <div>
                <div id="civgrid" className="chooser card">
                    <div className="pure-g chooser-grid box-content">
                        {civPanels}
                    </div>
                    <div className="card-background">cbg</div>
                </div>
            </div>
        );
    }
}

export default CivGrid;
