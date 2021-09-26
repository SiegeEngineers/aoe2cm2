import * as React from "react";
import {Link} from 'react-router-dom';

class Footer extends React.Component<object, object> {
    public render() {
        return (
            <footer className="footer px-4 py-6">
                <div className="container">
                    <div className="columns">
                        <div className="column is-half content is-small mb-0">
                            <p>
                                Created by <a href="https://siegeengineers.org">
                                <img alt='SiegeEngineers logo' className='inline-logo'
                                     style={{verticalAlign: "text-bottom"}}
                                     src="/images/SiegeEngineers.png"/> Siege
                                Engineers</a> (2019 &ndash; {new Date().getFullYear()})
                                &bull;
                                Based on the first version by <span className='is-family-code'>pip</span>
                            </p>
                            <p>
                                Age of Empires II &copy; Microsoft Corporation. <b>Captains Mode for Age of Empires
                                II</b> was created under Microsoft's "<a
                                href="https://www.xbox.com/en-us/developers/rules" rel='nofollow'>
                                Game Content Usage Rules</a>" using assets from Age of Empires II, and it is not
                                endorsed by or affiliated with Microsoft.
                            </p>
                        </div>
                        <div className="column is-half">
                            <nav className="breadcrumb is-small is-right has-bullet-separator"
                                 aria-label="footer links">
                                <ul>
                                    <li><a href="https://siegeengineers.org/donate">Support this project</a></li>
                                    <li><a href="https://github.com/SiegeEngineers/aoe2cm2">Contribute on GitHub</a>
                                    </li>
                                    <li><Link to="/api">API</Link></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
