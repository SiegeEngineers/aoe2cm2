import * as React from 'react';
import '../pure-min.css'
import '../style2.css'

interface IProps {
    seconds: number;
    visible: boolean;
}

class Countdown extends React.Component<IProps, object> {

    public render() {
        if (!this.props.visible) {
            return (<div id="countdown-timer"/>);
        }

        return (
            <div id="countdown-timer">&ensp;{Countdown.format(this.props.seconds)}</div>
        );
    }

    private static format(number: number):string {
        const minutes: number = number / 60;
        const seconds: number = number % 60;

        const minutesString = Math.floor(minutes).toFixed(0);
        let secondsString = Math.floor(seconds).toFixed(0);
        if (seconds < 10) {
            secondsString = '0' + secondsString;
        }
        return minutesString + ':' + secondsString;
    }

}

export default Countdown;
