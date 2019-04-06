import * as React from 'react';
import '../pure-min.css'
import '../style2.css'

interface IState {
    seconds: number;
}

class Countdown extends React.Component<object, IState> {

    private readonly interval: number;

    constructor(props: object) {
        super(props);
        this.state = {seconds: 30};
        this.interval = window.setInterval(() => {
            this.setState({...this.state, seconds: this.state.seconds - 1});
            if (this.state.seconds < 1) {
                window.clearInterval(this.interval);
            }
        }, 1000);
    }

    public render() {

        return (
            <div id="countdown-timer">0:{Countdown.format(this.state.seconds)}</div>
        );
    }

    private static format(number: number):string {
        if (number < 10) {
            return '0' + number;
        }
        return number.toString();
    }

}

export default Countdown;
