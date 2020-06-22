import * as React from "react";
import TurnExplanation from "../PresetEditor/TurnExplanation";

class Help extends React.Component<object, object> {
    public render() {
        return (
            <div className="container">
                <div className="content box">
                    <TurnExplanation/>
                </div>
            </div>
        );
    }
}

export default Help;