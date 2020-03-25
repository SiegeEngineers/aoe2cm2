import * as React from "react";

class Footer extends React.Component<object, object> {
    public render() {
        return (
            <div className="footer">
                <div style={{textAlign: 'center'}} className="text-primary">
                    Created by <a href="https://aoe2.se">Siege Engineers&nbsp;
                    <img className='inline-logo' src="/images/SiegeEngineers.png"/></a> (2019-2020),
                    based on the first version by pip.<br/>
                    <b>WARNING: THIS VERSION OF aoe2cm IS STILL UNDER HEAVY DEVELOPMENT.
                        DO NOT EXPECT IT TO WORK.
                        DO NOT USE IT FOR ANYTHING SERIOUS.</b>
                </div>
            </div>
        );
    }
}

export default Footer;