import React, { useState, useEffect } from 'react';

import Services from './Services';

const Adatkezeles = () => {
    const defaultAdatkezeles = {
        azonosito: '',
        tipus: '',
        leiras: ''
    };
    const [adatkezeles, setAdatkezeles] = useState(defaultAdatkezeles);

    const getAdatkezeles = () => {
        Services.listAdatkezeles().then((res) => {
            if (!res.err) {
                setAdatkezeles({
                    azonosito: res[0].azonosito,
                    tipus: res[0].tipus,
                    leiras: res[0].leiras
                });
            }
        });
    };

    const init = () => {
        getAdatkezeles();
    };

    useEffect(() => {
        init();
    }, []);

    const renderAdatkezeles = () => {
        return (
            <React.Fragment>
                <div className="adatkezeles__leiras" dangerouslySetInnerHTML={{ __html: adatkezeles.leiras }} />
            </React.Fragment>
        );
    };

    return <div className="adatkezeles">{renderAdatkezeles()}</div>;
};

export default Adatkezeles;
