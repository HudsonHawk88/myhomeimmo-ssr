import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Services from './Services.js';
import IngatlanCard from '../../../commons/IngatlanCard.js';

const FooldalContent = (props) => {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [ingatlanOptions, setIngatlanOptions] = useState([]);

    const getData = () => {
        Services.listIngatlanok((err, res) => {
            if (!err) {
                setData(res);
            }
        });
    };

    const scrollToElement = (id) => {
        var element = document.getElementById(id);
        if (element) {
            element.scrollIntoView();
        }
    };

    /* console.log(props) */

    useEffect(() => {
        /*     console.log(props) */
        if (data) {
            if (location.pathname === '/') {
                scrollToElement('root');
            } else {
                scrollToElement('ingatlan_0');
            }
        }
    }, [data, location.pathname]);

    /*     const ertekFormatter = (ingatlan) => {
        switch (ingatlan.statusz) {
            case 'Kiadó': {
                return `Ár: ${ingatlan.ar} ${ingatlan.penznem}/hó ${ingatlan.kaucio ? 'Kaució: ' + ingatlan.kaucio + ' ' + ingatlan.penznem : ''}`;
            }
            case 'Illeték': {
                return `${arFormatter(ingatlan.illetek)} ${ingatlan.penznem}`;
            }
            default: {
                return `Ár: ${ingatlan.ar} ${ingatlan.penznem}`;
            }
        }
    }; */

    const getOptions = () => {
        Services.getIngatlanOptions((err, res) => {
            if (!err) {
                setIngatlanOptions(res);
            }
        });
    };

    useEffect(() => {
        getOptions();
        getData();
    }, []);

    const renderKiemeltIngatlanok = () => {
        return (
            data &&
            data.map((ingat) => {
                return <IngatlanCard key={'ING_' + ingat.id} ingatlanOptions={ingatlanOptions} ingat={ingat} />;
            })
        );
    };

    return <React.Fragment>{renderKiemeltIngatlanok()}</React.Fragment>;
};

export default FooldalContent;
