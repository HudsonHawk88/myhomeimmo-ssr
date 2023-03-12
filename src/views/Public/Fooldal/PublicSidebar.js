import React from 'react';
import PropTypes from 'prop-types';

const PublicSidebar = (props) => {
    return (
        <React.Fragment>
            <div className="sidebar_elements">
                <div className="banner">
                    <span>
                        Etikus ingatlanos vagyok!
                        <br />
                        <div id="etikus" />
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
