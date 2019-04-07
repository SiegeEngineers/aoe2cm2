import * as React from 'react';
import '../pure-min.css'
import '../style2.css'

interface IProps {
    countdownUntil?: Date;
}

interface IState {
    seconds: number;
}

class Countdown extends React.Component<IProps, IState> {

    private interval: number | null;

    constructor(props: object) {
        super(props);
        this.state = {seconds: this.props.countdownUntil !== undefined ? (this.props.countdownUntil.getTime() - Date.now()) / 1000 : -1};
        this.interval = null;
    }

    componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
        if (this.interval !== null) {
            window.clearInterval(this.interval);
        }
        this.interval = window.setInterval(() => {
            if (nextProps.countdownUntil !== undefined) {
                this.setState({...this.state, seconds: (nextProps.countdownUntil.getTime() - Date.now()) / 1000});
            } else {
                this.setState({...this.state, seconds: -1});
            }
            if (this.state.seconds <= 0) {
                this.setState({...this.state, seconds: 0});
                if (this.interval !== null) {
                    window.clearInterval(this.interval);
                }
            }
        }, 100);
    }

    public render() {
        if (this.props.countdownUntil === undefined) {
            return (<div id="countdown-timer"/>);
        }

        return (
            <div id="countdown-timer">0:{Countdown.format(this.state.seconds)}</div>
        );
    }

    private static format(number: number):string {
        const numberstring = Math.floor(number).toFixed(0);
        if (number < 10) {
            return '0' + numberstring;
        }
        return numberstring;
    }

}

export default Countdown;
