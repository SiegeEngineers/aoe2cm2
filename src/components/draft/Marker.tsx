import * as React from "react";

interface IProps {
    number: number
    onClick?: () => void
}

interface IState {
}

class Marker extends React.Component<IProps, IState> {


    public render() {
        const colour = this.getColour(this.props.number);
        const callback = this.props.onClick ? this.props.onClick : () => {
        };
        return (
            <div onClick={callback} className="marker" style={{backgroundColor: colour.bg, color: colour.fg}}>
                {this.props.number > 0 ? this.props.number : '▨'}
            </div>
        );
    }

    private getColour = (index: number) => {
        const colours = {
            0: {bg: "rgba(50,50,50,1)", fg: "rgba(120,120,120,1)"},
            1: {bg: "rgba(0,120,215,1)", fg: "rgba(255,255,255,1)"},
            2: {bg: "rgba(236,9,9,1)", fg: "rgba(255,255,255,1)"},
            3: {bg: "rgba(3,251,3,1)", fg: "rgba(0,0,0,1)"},
            4: {bg: "rgba(255,241,0,1)", fg: "rgba(0,0,0,1)"},
            5: {bg: "rgba(24,241,243,1)", fg: "rgba(0,0,0,1)"},
            6: {bg: "rgba(254,3,251,1)", fg: "rgba(255,255,255,1)"},
            7: {bg: "rgba(211,211,211,1)", fg: "rgba(0,0,0,1)"},
            8: {bg: "rgba(246,149,20,1)", fg: "rgba(0,0,0,1)"},
            9: {bg: "rgba(255,255,255,1)", fg: "rgba(0,0,0,1)"},
        };
        const idx = index as keyof typeof colours;
        return colours[idx];
    }
}

export default Marker;