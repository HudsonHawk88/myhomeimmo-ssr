import React, { useState, useEffect } from 'react';

import Services from './Services';

const PenzugyiSzolgaltatasok = () => {
    const defaultSzolgaltatas = {
        kep: [],
        leiras: ''
    };
    const [szolgaltatas, setSzolgaltatas] = useState(defaultSzolgaltatas);

    const getPenzugyiSzolgaltatasok = () => {
        Services.listPenzugyiSzolgaltatasok().then((res) => {
            if (!res.err) {
                setSzolgaltatas({
                    kep: res.kep[0],
                    leiras: res.leiras
                });
            }
        });
    };

    const init = () => {
        getPenzugyiSzolgaltatasok();
    };

    useEffect(() => {
        init();
    }, []);

    const renderSzolgaltatas = () => {
        return (
            <React.Fragment>
                <img src={szolgaltatas && szolgaltatas.kep && szolgaltatas.kep.src} alt="Pajér András" />
                <div className="penzugyi_szolgaltatas__leiras" dangerouslySetInnerHTML={{ __html: szolgaltatas.leiras }} />
            </React.Fragment>
        );
    };

    return <div className="penzugyi_szolgaltatas">{szolgaltatas && renderSzolgaltatas()}</div>;
};

export default PenzugyiSzolgaltatasok;
