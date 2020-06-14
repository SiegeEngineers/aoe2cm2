import React, {useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {RouteComponentProps} from "react-router";

interface IProps extends RouteComponentProps<any> {
}

const ScrollToTop: React.FC<IProps> = (props) => {
    useEffect(() => {
        const unListen = props.history.listen(() => {
            window.scrollTo(0, 0);
        });
        return () => {
            unListen();
        }
    }, []);

    return <>{props.children}</>;
}

export default withRouter(ScrollToTop);