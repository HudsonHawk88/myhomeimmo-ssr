import React from 'react';
import { Helmet } from 'react-helmet-async';

import FooldalContent from './FooldalContent';

const Fooldal = (props) => {
    return (
        <div className="public-inner-content">
            <Helmet defer={false}>
                <title>Myhome Ingatlanközvetítő Iroda</title>
                <meta property="og:image" content={'https://inftechsol.hu/images/megoszt2.png'} />
            </Helmet>
            <FooldalContent {...props} />
        </div>
    );
};

export default Fooldal;
