import React from 'react';
import { Helmet } from 'react-helmet';

import FooldalContent from './FooldalContent';
import PublicSidebar from './PublicSidebar';

const Fooldal = (props) => {
    return (
        <div className="public-inner-content">
            <Helmet>
                <title>Myhome Ingatlanközvetítő Iroda</title>
            </Helmet>
            <div className="ingatlanok_lista">
                <FooldalContent {...props} />
            </div>
            <div className="public_sidebar_right">
                <PublicSidebar />
            </div>
        </div>
    );
};

export default Fooldal;
