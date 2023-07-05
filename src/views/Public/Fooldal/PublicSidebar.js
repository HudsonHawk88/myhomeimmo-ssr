import React from 'react';
import PropTypes from 'prop-types';

const PublicSidebar = (props) => {
    return (
        <React.Fragment>
            <div className="sidebar_elements">
                <div className="banner">
                    <span>
                        <div id="etikus" />
                    </span>
                </div>
            </div>
            <div className="sidebar_elements">
                <div className="banner">
                    <span>
                        <div id="hitelnet" />
                        <div id="partnerbankok">
                            <div id="otp" />
                            <div id="unicredit" />
                            <div id="erste" />
                        </div>
                        <div id="partnerbankok">
                            <div id="kh" />
                            <div id="mbh" />
                            <div id="cib" />
                        </div>
                    </span>
                </div>
            </div>
            <div className="sidebar_elements">
                <div className="banner">
                    <span>
                        Weboldalkészítés, számítógép-, és telefonszervíz, informatikai oktatás és egyéb informatikai szolgáltatások eléhető áron!
                        <br />
                        <button className="glow-on-hover" onClick={() => window.open('https://inftechsol.hu/elerhetosegek', '_blank')}>
                            Érdekel
                        </button>
                    </span>
                </div>
            </div>
        </React.Fragment>
    );
};

PublicSidebar.propTypes = {};

export default PublicSidebar;
