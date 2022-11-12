import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, Button, Badge } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Moment from 'moment';
import { arFormatter } from '../../../commons/Lib.js';
import Services from './Services.js';

const FooldalContent = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [ingatlanLista, setIngatlanLista] = useState([]);
    const [ingatlanOptions, setIngatlanOptions] = useState([]);
    const { data } = props;
    const viewIngatlan = (id) => {
        /*     history.push({
      pathname: `/ingatlan?id=${id}`,
      state: { id: id }
    }) */
        navigate(`/ingatlan?id=${id}`, { replace: true, state: { id: id } });
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
            setIngatlanLista(data);
            if (location.pathname === '/') {
                scrollToElement('root');
            } else {
                scrollToElement('ingatlan_0');
            }
        }

        return () => {
            setIngatlanLista({});
        };
    }, [data, location.pathname]);

    const isNew = (isUjEpitesu) => {
        if (isUjEpitesu) {
            return true;
        } else {
            return false;
        }
    };

    const isNewIngatlan = (rogzitIdo) => {
        // TODO: Nem működik jól, megjavítani!!!!
        const today = Moment(Moment.now());
        const differDays = -14;
        const currentDiff = Moment(rogzitIdo).diff(today, 'days');
        if (parseInt(currentDiff, 10) > differDays) {
            return true;
        } else {
            return false;
        }
    };

    const ertekFormatter = (ingatlan) => {
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
    };

    const meretFormatter = (ingatlan) => {
        switch (ingatlan.tipus + '') {
            case '3': {
                return `Méret: ${ingatlan.telek} m`;
            }
            case '6': {
                return `Méret: ${ingatlan.telek} m`;
            }
            case '13': {
                return `Méret: ${ingatlan.telek} m`;
            }
            case '10': {
                return `Méret: ${ingatlan.telek} m`;
            }
            default: {
                return `Méret: ${ingatlan.alapterulet} m`;
            }
        }
    };

    const szobaFormatter = (ingatlan) => {
        switch (ingatlan.tipus) {
            case 3: {
                return '';
            }
            case 6: {
                return '';
            }
            case 13: {
                return '';
            }
            case 10: {
                return '';
            }
            case 5: {
                return '';
            }
            case 7: {
                return '';
            }
            case 8: {
                return '';
            }
            default: {
                if (ingatlan.felszobaszam) {
                    return (
                        <span>
                            Szoba: {ingatlan.szobaszam}
                            &nbsp; Félszoba: {ingatlan.felszobaszam}
                            <br />
                        </span>
                    );
                } else if (ingatlan.szobaszam) {
                    return (
                        <>
                            Szoba: {ingatlan.szobaszam}
                            <br />
                        </>
                    );
                }
            }
        }
    };

    const szintFormatter = (ingatlan) => {
        switch (ingatlan.tipus) {
            case 3: {
                return '';
            }
            case 6: {
                return '';
            }
            case 13: {
                return '';
            }
            case 10: {
                return '';
            }
            case 5: {
                return '';
            }
            case 7: {
                return '';
            }
            case 8: {
                return '';
            }
            case 2: {
                return '';
            }
            default: {
                return ingatlan.emelet && (parseInt(ingatlan.emelet, 10) ? 'Emelet: ' + ingatlan.emelet + '. emelet' : ingatlan.emelet);
            }
        }
    };

    const getOptions = () => {
        Services.getIngatlanOptions().then((res) => {
            if (!res.err) {
                setIngatlanOptions(res);
            }
        });
    };

    useEffect(() => {
        getOptions();
    }, []);

    const tipusFormatter = (type) => {
        let tipus = '';
        ingatlanOptions.forEach((option) => {
            if (option.nev === 'tipus') {
                option.options.forEach((opt) => {
                    if (opt.value + '' === type) {
                        tipus = opt.nev;
                    }
                });
            }
        });
        return tipus;
    };

    const renderKiemeltIngatlanok = () => {
        const badgeStyle = {
            fontSize: '17px'
        };
        return data.map((ingat, index) => {
            // if (ingat.isKiemelt) {
            let keplista = ingat.kepek;
            const kaucio = ingat.kaucio + '';
            return (
                <Card key={index.toString()} id={`ingatlan_${index.toString()}`}>
                    <CardBody>
                        <div className="row">
                            <div className="col-md-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {isNew(ingat.isUjEpitesu) && (
                                    <Badge style={badgeStyle} color="primary">
                                        Újépítés!
                                    </Badge>
                                )}
                                &nbsp;&nbsp;
                                {isNewIngatlan(ingat.rogzitIdo) && (
                                    <Badge style={badgeStyle} color="danger">
                                        Új!
                                    </Badge>
                                )}
                            </div>
                            <div className="col-md-12" />
                            <br />
                            <div className="col-md-12">
                                {ingat.kepek && ingat.kepek.length !== 0 ? (
                                    keplista.map((kep) => {
                                        if (kep.isCover) {
                                            let extIndex = kep.src.lastIndexOf('.');
                                            let extension = kep.src.substring(extIndex);
                                            let fname = kep.src.substring(0, extIndex);
                                            let icon = fname + '_icon' + extension;
                                            return (
                                                <img
                                                    key={kep.title}
                                                    src={icon}
                                                    alt={kep.title}
                                                    // style={imageStyle}
                                                />
                                            );
                                        }
                                    })
                                ) : (
                                    <React.Fragment />
                                )}
                            </div>
                            <div className="col-md-12" />
                            <br />
                            <div className="col-md-12">
                                {/* <strong>Ár: {ingat.ar + ' ' + ingat.penznem}</strong>
                                {kaucio && (
                                    <>
                                        <br />
                                        <strong>Kaució: {kaucio + ' ' + ingat.penznem}</strong>
                                    </>
                                )} */}
                                <strong>{`Ingatlan státusza: `}</strong>
                                {ingat.statusz}
                                <br />
                                <strong>Ingatlan típusa: </strong>
                                {tipusFormatter(ingat.tipus + '')}
                                <br />
                                <strong>Ár: {arFormatter(ingat.ar) + ' ' + ingat.penznem}</strong>
                                {ingat.kaucio && ingat.kaucio !== '' && (
                                    <>
                                        <br />
                                        <strong>Kaució: {arFormatter(ingat.kaucio) + ' ' + ingat.penznem}</strong>
                                    </>
                                )}
                                <br />
                                {`${ingat.kaucio && ' '}Település: ${ingat.helyseg.telepules && ingat.helyseg.telepules.telepulesnev}`}
                                <br />
                                {(ingat.telek || ingat.alapterulet) && meretFormatter(ingat)}
                                <sup>2</sup>
                                <br />
                                {szobaFormatter(ingat)}&nbsp;&nbsp;
                                {szintFormatter(ingat)}&nbsp;&nbsp;
                            </div>
                            {/*    <div className="col-md-12">
                                <strong>{ingat.cim}</strong>
                            </div> */}
                        </div>
                    </CardBody>
                    <CardFooter style={{ textAlign: 'center' }}>
                        <Button onClick={() => viewIngatlan(ingat.id)} color="info">
                            Megtekintés
                        </Button>
                    </CardFooter>
                </Card>
            );
            // }
        });
    };

    return <React.Fragment>{renderKiemeltIngatlanok()}</React.Fragment>;
};

export default FooldalContent;
