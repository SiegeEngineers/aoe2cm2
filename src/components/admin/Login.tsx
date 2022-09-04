import * as React from "react";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {connect} from "react-redux";
import {ApplicationState} from "../../types";
import {withTranslation, WithTranslation} from "react-i18next";
import {Redirect, RouteComponentProps} from "react-router";

interface Props extends WithTranslation, RouteComponentProps<any> {
    apiKey: string | undefined;
    onSetApiKey: (apiKey: string | undefined) => void;
}

interface State {
    username: string
    password: string
    loggedIn: boolean
    loginFailed: boolean
}

class Login extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {username: '', password: '', loggedIn: (!!props.apiKey), loginFailed: false};
    }

    private login() {
        fetch('/api/login', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'user': this.state.username,
                'password': this.state.password,
            }),
            method: "post"
        })
            .then((result) => {
                if (result.ok) {
                    return result.json();
                }
                this.setState({...this.state, loginFailed: true});
                return Promise.reject('Login failed');
            })
            .then((json) => this.props.onSetApiKey(json.apiKey));
    }

    public render() {

        if (this.props.apiKey) {
            return (<Redirect to={'/admin'}/>);
        }

        const alert = this.state.loginFailed ? <div className="notification is-danger">
            Login failed. Maybe you have a typo in your name or password?<br/>
            If the issue persists, contact an admin.
        </div> : null;

        return (
            <div className="container" style={{maxWidth: '400px'}}>
                <form className="content box" onSubmit={(e) => {
                    e.preventDefault();
                    this.login()
                }}>
                    <h2>Login</h2>
                    {alert}
                    <div className="field">
                        <label className="label">User</label>
                        <div className="control">
                            <input className="input" type="text" placeholder="username" value={this.state.username}
                                   required
                                   onChange={(event) => {
                                       this.setState({...this.state, username: event.target.value});
                                   }}/>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Password</label>
                        <div className="control">
                            <input className="input" type="password" placeholder="********" value={this.state.password}
                                   required
                                   onChange={(event) => {
                                       this.setState({...this.state, password: event.target.value});
                                   }}/>
                        </div>
                    </div>

                    <button className="button is-primary">Sign in</button>
                </form>
            </div>
        );
    }
}

export function mapStateToProps(state: ApplicationState) {
    return {
        apiKey: state.admin.apiKey,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onSetApiKey: (apiKey: string | undefined) => dispatch(actions.setApiKey(apiKey)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Login));
