import * as React from "react";

class Footer extends React.Component<object, object> {
    public render() {
        return (
            <div className="footer">
                <div style={{textAlign: 'center'}} className="text-primary">
                    Created by pip (2015-2017), <a href="https://aoe2.se">Siege Engineers&nbsp;
                    <img className='inline-logo' src="/images/SiegeEngineers.png"/></a> (2019).<br/>
                    <b>WARNING: THIS VERSION OF aoe2cm IS STILL UNDER HEAVY DEVELOPMENT.
                        DO NOT EXPECT IT TO WORK.
                        DO NOT USE IT FOR ANYTHING SERIOUS.</b>
                </div>
            </div>
        );
    }
}

export default Footer;