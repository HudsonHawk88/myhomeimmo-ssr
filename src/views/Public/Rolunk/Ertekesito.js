import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Services from './Services';

const Ertekesito = (props) => {
    const defaultErtekesito = {
        id: null,
        nev: '',
        beosztas: '',
        email: '',
        telefon: '',
        leiras: '',
        kep: []
    };
    const [ertekesito, setErtekesito] = useState(defaultErtekesito);

    const getErtekesito = (id) => {
        Services.getErtekesito(id, (err, res) => {
            if (!err) {
                setErtekesito(res[0]);
            }
        });
    };

    useEffect(() => {
        const params = new URLSearchParams(typeof window !== 'undefined' && window.location.search);
        const id = params.get('id');
        if (id) {
            getErtekesito(id);
        }
    }, [location]);

    const renderLeiras = () => {
        return (
            <React.Fragment>
                <div
                    className="public_rolunk__leiras"
                    dangerouslySetInnerHTML={{
                        __html: ertekesito.leiras
                    }}
                />
            </React.Fragment>
        );
    };

    const renderErtekesito = () => {
        const kep = ertekesito && ertekesito.kep && ertekesito.kep[0];
        return (
            <React.Fragment>
                <div className="ertkartya">
                    <div className="ertkartya_back" />
                    <div className="ertkartya_nevjegy">
                        <img src={kep && kep.src} className="ertkartya_kep" />
                        <div className="ertakartya_alapadatok">
                            <div className="row">
                                <div className="col-md-12">
                                    <span>{`Név: `}</span>
                                    <span>{`${ertekesito.nev}`}</span>
                                </div>
                                <div className="col-md-12">
                                    <span>{`Beosztás: `}</span>
                                    <span>{`${ertekesito.beosztas}`}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <span>{`E-mail: `}</span>
                                    <span>{`${ertekesito.email}`}</span>
                                </div>
                                <div className="col-md-12">
                                    <span>{`Telefon: `}</span>
                                    <span>{`${ertekesito.telefon}`}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="leiras" id="leiras">
                        {renderLeiras()}
                    </div>
                </div>
            </React.Fragment>
        );
    };

    return <div>{renderErtekesito()}</div>;
};

Ertekesito.propTypes = {};

export default Ertekesito;
