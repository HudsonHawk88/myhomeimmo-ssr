import React, { useState, useEffect } from 'react';

import Services from './Services';

const MyArt = (props) => {
    const [altalanos, setAltalanos] = useState('');
    const [galeriak, setGaleriak] = useState([]);

    const getGaleriaAdatok = () => {
        Services.listAltalanos().then((res) => {
            if (!res.err) {
                setAltalanos(res[0]);
            }
        });
        Services.listGaleriak().then((res) => {
            if (!res.err) {
                setGaleriak(res);
            }
        });
    };

    const init = () => {
        getGaleriaAdatok();
    };

    useEffect(() => {
        init();
    }, []);

    const renderKepek = (galeria) => {
        const kepek = JSON.parse(JSON.stringify(galeria.kepek));

        return kepek.map((kep) => {
            return <img key={kep.filename} src={kep.src} alt={kep.filename} />;
        });
    };

    const renderGaleriak = () => {
        const galeriakJson = JSON.parse(JSON.stringify(galeriak));
        return galeriakJson.map((galeria) => {
            if (galeria.isActive) {
                return (
                    <div className="myart_galeria" key={galeria.id.toString()}>
                        <div className="galeria_cim">
                            <h3>{galeria.nev}</h3>
                        </div>
                        <div className="muvesz_leiras" dangerouslySetInnerHTML={{ __html: galeria.leiras }} />
                        <div className="muvesz_adatok">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <strong>Művész neve:</strong>
                                            {galeria.muveszNev}
                                        </div>
                                        <div className="col-md-6">
                                            <strong>Művész email:</strong>
                                            {galeria.muveszEmail}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <strong>Művész telefonszáma:</strong>
                                            {galeria.muveszTelefon}
                                        </div>
                                        <div className="col-md-6">
                                            <strong>Művész webcíme:</strong>
                                            <a href={galeria.muveszUrl} target="_blank">
                                                {galeria.muveszUrl}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="muvesz_kepek">{renderKepek(galeria)}</div>
                    </div>
                );
            }
        });
    };

    return (
        <div className="public_myart">
            <div className="myart_altalanos" dangerouslySetInnerHTML={{ __html: altalanos.leiras }} />
            <br />
            <div className="myart_galeriak">{renderGaleriak()}</div>
        </div>
    );
};

export default MyArt;
