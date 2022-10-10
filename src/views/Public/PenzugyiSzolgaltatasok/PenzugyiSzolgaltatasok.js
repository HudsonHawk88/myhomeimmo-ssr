import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import Services from './Services';

const PenzugyiSzolgaltatasok = () => {
    const defaultSzolgaltatas = {
        kep: [],
        leiras: '',
        kalkulator: ''
    };
    const [szolgaltatas, setSzolgaltatas] = useState(defaultSzolgaltatas);

    const getPenzugyiSzolgaltatasok = () => {
        Services.listPenzugyiSzolgaltatasok().then((res) => {
            if (!res.err) {
                setSzolgaltatas({
                    kep: res.kep[0],
                    leiras: res.leiras,
                    kalkulator: res.kalkulator
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

    useEffect(() => {
        if (__isBrowser__) {
            let elem = document.getElementById('hncc04-05e3');
            console.log(elem);
        }
    }, [__isBrowser__]);

    const renderSzolgaltatas = () => {
        return (
            <React.Fragment>
                <img src={szolgaltatas && szolgaltatas.kep && szolgaltatas.kep.src} alt="Pajér András" />
                <div className="penzugyi_szolgaltatas__leiras" dangerouslySetInnerHTML={{ __html: szolgaltatas.leiras }} />
            </React.Fragment>
        );
    };

    return (
        <div className="penzugyi_szolgaltatas">
            <div className="row">
                <div className="col-md-12">{szolgaltatas && renderSzolgaltatas()}</div>
            </div>
            <div className="row">
                <div className="col-md-12 penzugyi_szolgaltatas__kalkulator" dangerouslySetInnerHTML={{ __html: szolgaltatas.kalkulator }} />
            </div>
        </div>
    );
};

export default PenzugyiSzolgaltatasok;
