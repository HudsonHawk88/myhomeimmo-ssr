import React, { useEffect, useState } from 'react';
import Services from './Services';
import FooldalContent from '../Fooldal/FooldalContent';

const Projekt = () => {
    const [projekt, setProjekt] = useState({});
    const [projIng, setProjIng] = useState([]);

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

    const getProjekt = (id) => {
        let result = {};
        Services.getProjekt(id, (err, r) => {
            if (!err) {
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
                Object.assign(result, r);
                setProjekt(result);
            }
        });
    };

    const getProjektIngatlanok = () => {
        const { projektingatlanok } = projekt;
        const ids =
            projekt && projektingatlanok && projektingatlanok.length > 0
                ? projektingatlanok.map((pi) => {
                      return pi.id;
                  })
                : [];
        if (ids.length > 0) {
            Services.getProjektIngatlanok(ids, (err, res) => {
                if (!err) {
                    setProjIng(res);
                }
            });
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(typeof window !== 'undefined' && window.location.search);
        const id = params.get('id');
        if (id) {
            getProjekt(id);
        }
    }, [location]);

    useEffect(() => {
        if (projekt) {
            getProjektIngatlanok();
        }
    }, [projekt]);

    const renderIngatlanok = () => {
        return projekt && projIng && projIng.length > 0 && <FooldalContent data={projIng} />;
    };

    const getMillAr = (ar) => {
        let millAr = ar / 1000000;
        millAr = millAr.toFixed(2);

        return millAr;
    };

    const getNegyedev = (negyev) => {
        switch (negyev) {
            case 1: {
                return 'I. negyedév';
            }
            case 2: {
                return 'II. negyedév';
            }
            case 3: {
                return 'III. negyedév';
            }
            case 4: {
                return 'IV. negyedév';
            }
            default: {
                return 'I. negyedév';
            }
        }
    };

    const getAtadasHonap = (atadho) => {
        switch (atadho) {
            case 1: {
                return 'január';
            }
            case 2: {
                return 'február';
            }
            case 3: {
                return 'március';
            }
            case 4: {
                return 'április';
            }
            case 5: {
                return 'május';
            }
            case 6: {
                return 'június';
            }
            case 7: {
                return 'július';
            }
            case 8: {
                return 'augusztus';
            }
            case 9: {
                return 'szeptember';
            }
            case 10: {
                return 'október';
            }
            case 11: {
                return 'november';
            }
            case 12: {
                return 'december';
            }
            default: {
                return '';
            }
        }
    };

    return (
        <div className="projekt">
            {console.log(projekt)}
            <div className="projekt_borito">
                <img src={projekt && projekt.borito && projekt.borito[0].src} alt={projekt && projekt.borito && projekt.borito[0].filename} />
            </div>
            <div className="projekt_alapadatok">
                <div className="bigikon">
                    <div className="bigikon_ikon">
                        <i className="fa-solid fa-money-bill" />
                    </div>
                    <div className="bigikon_text">
                        <strong>
                            Ár: <br />
                            {`${projekt.minar && projekt.maxar ? `${getMillAr(projekt.minar)} - ${getMillAr(projekt.maxar)} ${projekt.penznem}` : ''}`}
                        </strong>
                    </div>
                </div>
                <div className="bigikon">
                    <div className="bigikon_ikon">
                        <img src="/static/images/areaikon.png" />
                    </div>
                    <div className="bigikon_text">
                        <strong>
                            Alapterület: <br />
                            {`${projekt.minter ? projekt.minter : 0} - ${projekt.maxter ? projekt.maxter : ''} m`}
                            <sup>2</sup>
                        </strong>
                    </div>
                </div>
                <div className="bigikon">
                    <div className="bigikon_ikon">
                        <i className="fa-solid fa-door-open" />
                    </div>
                    <div className="bigikon_text">
                        <strong>
                            Szobaszám: <br />
                            {`${projekt.minszoba ? projekt.minszoba : 0} - ${projekt.maxszoba ? projekt.maxszoba : ''} db`}
                        </strong>
                    </div>
                </div>
                <div className="bigikon">
                    <div className="bigikon_ikon">
                        <i className="fa-solid fa-house" />
                    </div>
                    <div className="bigikon_text">
                        <strong>
                            Össz./szabad: <br />
                            {`${projekt.osszlakasszam ? projekt.osszlakasszam : 0} / ${projekt.szabadlakasszam ? projekt.szabadlakasszam : ''} db`}
                        </strong>
                    </div>
                </div>
                <div className="bigikon">
                    <div className="bigikon_ikon">
                        <i className="fa-solid fa-key" />
                    </div>
                    <div className="bigikon_text">
                        <strong>
                            Terv. átadás: <br />
                            {`${projekt.atadasev}. ${projekt.atadashonap ? getAtadasHonap(projekt.atadashonap) : projekt.atadasnegyedev ? getNegyedev(projekt.atadasnegyedév) : ''}`}
                        </strong>
                    </div>
                </div>
                <div className="bigikon">
                    <div className="bigikon_ikon">
                        <i className="fa-solid fa-seedling" />
                    </div>
                    <div className="bigikon_text">
                        <strong>
                            Energetika: <br />
                            {`${projekt.energetika && projekt.energetika}`}
                        </strong>
                    </div>
                </div>
            </div>
            <div className="projekt_adatok">
                <div className="projekt_cim">
                    <h1>{projekt && projekt.felirat}</h1>
                    <h3>{projekt && projekt.szlogen}</h3>
                </div>
                <div className="projekt_leiras">{projekt && projekt.leiras}</div>
            </div>
            <div className="projekt_ingatlanok">{renderIngatlanok()}</div>
            <div className="projekt_beruhazo" hidden={!projekt.beruhazo || (projekt.beruhazo && !projekt.beruhazo.beruhazoLathato)}>
                <h1>{'A beruházó'}</h1>
                <h3>{projekt.beruhazo && projekt.beruhazo.nev ? projekt.beruhazo.nev : ''}</h3>
                <div>{projekt.beruhazo && projekt.beruhazo.bemutat ? projekt.beruhazo.bemutat : ''}</div>
                <a href={projekt.beruhazo && projekt.beruhazo.weboldal ? projekt.beruhazo.weboldal : '#'} target="_blank">
                    {projekt.beruhazo && projekt.beruhazo.nev ? projekt.beruhazo.nev : ''}
                </a>
            </div>
        </div>
    );
};

export default Projekt;
