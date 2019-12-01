import * as React from "react";
import {Link} from "react-router-dom";

class Preset extends React.Component<object, object> {
    public render() {
        return (
            <div>
                <p>Description of a single preset</p>
                <Link to='/'>Go to index</Link>
            </div>
        );
    }
}

export default Preset;