import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjektCard from './ProjektCard';
import Services from './Services';
import { object } from 'prop-types';

const Projektek = () => {
    const [projektek, setProjektek] = useState([]);
    const [maxAr, setMaxAr] = useState([]);
    const [minAr, setMinAr] = useState([]);

    const navigate = useNavigate();

    const getInt = (amount) => {
        let ar;
        const tipus = typeof amount;
        if (tipus === 'string') {
            ar = amount.replace(/ /g, '');
        }
        /* else if (tipus === 'number') {
            let str = amount + '';
            ar = str.replace(/ /g, '');
        } */
        console.log('Ar: ', ar);
        ar = tipus === 'number' ? ar : parseInt(ar, 10);

        return ar;
    };

    const getArakEsAlapteruletek = (result, callback) => {
        const arak = [];
        const alapteruletek = [];
        result.forEach((r) => {
            arak.push(getInt(r.ar));
            if (r.alapterulet && r.alapterulet !== '') {
                alapteruletek.push(getInt(r.alapterulet));
            }
        });
        if (callback) {
            callback(arak);
        }
    };

    const getProjektIngatlanok = (projekt) => {
        const { projektingatlanok } = projekt;
        let newProjektek = [];
        let newProjekt = Object.assign({}, projekt);
        const ingatlanok = projektingatlanok || [];
        if (ingatlanok && ingatlanok.length > 0) {
            console.log(ingatlanok);
            const minar = Math.min(...ingatlanok.map((item) => getInt(item.ar)));
            const maxar = Math.max(...ingatlanok.map((item) => getInt(item.ar)));

            /* re['minar'] = minAr;
                re['maxar'] = maxAr; */

            /*        setProjektek(newProjektek); */
            /*  const { minTer, maxTer } = getMinMaxTer(alapteruletek); */
            let newArak = { minar, maxar };
            console.log(newArak);
            Object.assign(newProjekt, newArak);
        } else {
            Object.assign(newProjekt, { minar: null, maxar: null });
        }
        return newProjekt;
    };

    const getPenzem = (ing) => {};

    const getProjektek = () => {
        Services.listProjektek((err, res) => {
            if (!err) {
                res.forEach((r) => {
                    let arak = { minar: null, maxar: null };
                    let teruletek = { minter: null, maxter: null };
                    let szobak = { minszoba: null, maxszoba: null };
                    if (r.projektingatlanok && r.projektingatlanok.length > 0) {
                        const minar = Math.min(...r.projektingatlanok.map((item) => getInt(item.ar)));
                        const maxar = Math.max(...r.projektingatlanok.map((item) => getInt(item.ar)));
                        const minter = Math.min(...r.projektingatlanok.map((item) => item.alapterulet));
                        const maxter = Math.max(...r.projektingatlanok.map((item) => item.alapterulet));
                        const minfelszoba = Math.min(...r.projektingatlanok.map((item) => item.felszobaszam));
                        const maxfelszoba = Math.max(...r.projektingatlanok.map((item) => item.felszobaszam));
                        const minszoba = Math.min(...r.projektingatlanok.map((item) => item.szobaszam));
                        const maxszoba = Math.max(...r.projektingatlanok.map((item) => item.szobaszam));
                        arak = { minar, maxar };
                        teruletek = { minter, maxter };
                        szobak = { minszoba: minszoba + minfelszoba, maxszoba: maxszoba + maxfelszoba };
                    }
                    r.minar = arak.minar;
                    r.maxar = arak.maxar;
                    r.minter = teruletek.minter;
                    r.maxter = teruletek.maxter;
                    r.minszoba = szobak.minszoba;
                    r.maxszoba = szobak.maxszoba;
                });
                setProjektek(res);
            }
        });
    };

    const viewProjekt = (id) => {
        navigate(`/projekt?id=${id}`, { state: { id: id } });
    };

    useEffect(() => {
        getProjektek();
    }, []);

    const renderProjektek = () => {
        return (
            <div className="projektek_lista">
                {projektek.length > 0 &&
                    projektek.map((projekt) => {
                        if (projekt) {
                            console.log(projekt);
                            const { borito, id, minar, maxar, minter, maxter, minszoba, maxszoba, energetika, penznem } = projekt;
                            const adatok = Object.assign(
                                {},
                                {
                                    cim: projekt.felirat,
                                    telepules: projekt.cim && projekt.cim.telepules && projekt.cim.telepules.telepulesnev && projekt.cim.telepules.telepulesnev,
                                    leiras: projekt.leiras,
                                    oszzlakszam: projekt.osszlakasszam,
                                    szabadlakszam: projekt.szabadlakasszam,
                                    ingtipus: projekt.ingtipus,
                                    atadasev: projekt.atadasev,
                                    atadashonap: projekt.atadashonap && projekt.atadashonap !== '' && projekt.atadashonap !== 0 ? projekt.atadashonap : null,
                                    atadasnegyedev: projekt.atadasnegyedev,
                                    minar: minar,
                                    maxar: maxar,
                                    minter: minter,
                                    maxter: maxter,
                                    minszoba: minszoba,
                                    maxszoba: maxszoba,
                                    energetika: energetika,
                                    penznem: penznem
                                }
                            );
                            return <ProjektCard key={id} id={id} borito={borito && Array.isArray(borito) && borito[0]} onClickCard={() => viewProjekt(id)} adatok={adatok} />;
                        }
                    })}
            </div>
        );
    };

    return (
        <div className="projektek">
            <div className="projektek_borito">
                <img src="/static/images/mh_projekt_borito.jpg" alt="projektek_borito" />
            </div>
            <div className="projektek_cim">
                <h1>{'Új építéseink'}</h1>
            </div>
            {renderProjektek()}
        </div>
    );
};

export default Projektek;
