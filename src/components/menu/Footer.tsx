import * as React from "react";

class Footer extends React.Component<object, object> {
    public render() {
        return (
            <div className="footer">
                <div style={{textAlign: 'center'}} className="text-primary">
                    Created by <a href="https://aoe2.se">Siege Engineers&nbsp;
                    <img alt='SiegeEngineers logo' className='inline-logo'
                         src="/images/SiegeEngineers.png"/></a> (2019-2020),
                    based on the first version by pip
                    &#8196;·&#8196;
                    <a href="https://github.com/SiegeEngineers/aoe2cm2">GitHub</a>
                </div>
                <div style={{textAlign: 'center'}} className="text-primary">
                    Age of Empires II © Microsoft Corporation.
                    <b> Captains Mode for Age of Empires II</b> was created under Microsoft's "<a
                    href="https://www.xbox.com/en-us/developers/rules">Game Content Usage Rules</a>" using assets
                    from Age of Empires II, and it is not endorsed by or affiliated with Microsoft.
                </div>
            </div>
        );
    }
}

export default Footer;