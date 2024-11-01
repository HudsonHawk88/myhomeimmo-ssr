import React, { useState, useEffect } from 'react';

import Gallery from '../../../commons/Gallery';
import Services from './Services';

const MyArt = (props) => {
    const [altalanos, setAltalanos] = useState('');
    const [galeriak, setGaleriak] = useState([]);

    const getGaleriaAdatok = () => {
        Services.listAltalanos((err, res) => {
            if (!err) {
                setAltalanos(res[0]);
            }
        });
        Services.listGaleriak((err, res) => {
            if (!err) {
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

    const getKepek = (galeria) => {
        let items = [];
        if (galeria && galeria.kepek.length > 0) {
            galeria.kepek.forEach((kep) => {
                items.push({
                    original: kep.src,
                    thumbnail: kep.src,
                    originalHeight: '400px',
                    // originalWidth: '100%',
                    /* thumbnailHeight: '300px', */
                    thumbnailWidth: '500px'
                    // sizes: '100%'
                });
            });
        }
        return items;
    };

    const renderKepek = (galeria) => {
        return (
            <div className="galeria">
                <Gallery showPlayButton={false} useBrowserFullscreen={true} thumbnailPosition="bottom" items={getKepek(galeria)} />
            </div>
        );
    };

    const renderGaleriak = () => {
        return galeriak.map((galeria) => {
            if (galeria.isActive) {
                return (
                    <div className="myart_galeria" key={galeria.id.toString()}>
                        <div className="galeria_cim">
                            <h3>{galeria.nev}</h3>
                        </div>
                        <div className="muvesz_leiras">
                            <div className="row">
                                <div className="col-md-12" dangerouslySetInnerHTML={{ __html: galeria.leiras }} />
                            </div>
                        </div>
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
