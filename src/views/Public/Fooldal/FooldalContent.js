import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, Button, Badge } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Moment from 'moment';

const FooldalContent = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [ingatlanLista, setIngatlanLista] = useState([]);
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
    }, [data, ingatlanLista, location.pathname]);

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
                                            return (
                                                <img
                                                    key="kep.src"
                                                    src={kep.src}
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
                                <strong>Ár: {ingat.ar + ' ' + ingat.penznem}</strong>
                                {kaucio && (
                                    <>
                                        <br />
                                        <strong>Kaució: {kaucio + ' ' + ingat.penznem}</strong>
                                    </>
                                )}
                            </div>
                            <div className="col-md-12">
                                <strong>{ingat.cim}</strong>
                            </div>
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
