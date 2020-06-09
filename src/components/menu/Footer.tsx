import * as React from "react";

class Footer extends React.Component<object, object> {
    public render() {
        return (
            <footer className="footer">
                <div className="container">
                    <div className="content">
                        <p style={{textAlign: 'center'}}>
                            Created by <a href="https://aoe2.se">
                            <img alt='SiegeEngineers logo' className='inline-logo'
                                 src="/images/SiegeEngineers.png"/> Siege Engineers</a> (2019 &ndash; 2020)
                            &middot;
                            Based on the first version by <span className='is-family-code'>pip</span>&nbsp; &middot;
                            Contribute on <a href="https://github.com/SiegeEngineers/aoe2cm2">GitHub</a>
                        </p>
                        <p style={{textAlign: 'center'}}>
                            Age of Empires II &copy; Microsoft Corporation.<br/>
                            <b> Captains Mode for Age of Empires II</b> was created under Microsoft's "<a
                            href="https://www.xbox.com/en-us/developers/rules" rel='nofollow'>Game Content Usage
                            Rules</a>" using assets
                            from Age of Empires II, and it is not endorsed by or affiliated with Microsoft.
                        </p>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;