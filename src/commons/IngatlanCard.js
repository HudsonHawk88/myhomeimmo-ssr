import React from 'react';
import { Button, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Moment from 'moment';
import PropTypes from 'prop-types';
import { arFormatter } from './Lib.js';

const IngatlanCard = (props) => {
    const navigate = useNavigate();
    const { ingat, ingatlanOptions } = props;

    const viewIngatlan = (id) => {
        navigate(`/ingatlan?id=${id}`, { state: { id: id } });
    };

    const isNew = (isUjEpitesu) => {
        if (isUjEpitesu) {
            return true;
        } else {
            return false;
        }
    };

    const isVip = (isVip) => {
        if (isVip) {
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
                        <React.Fragment>
                            Szoba: {ingatlan.szobaszam}
                            <br />
                        </React.Fragment>
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

    const renderBadges = () => {
        return (
            <React.Fragment>
                {isNewIngatlan(ingat.rogzitIdo) && (
                    <React.Fragment>
                        <Badge color="danger" key={'badge_' + ingat.id}>
                            Új!
                        </Badge>
                    </React.Fragment>
                )}
                {isNew(ingat.isUjEpitesu) && (
                    <React.Fragment>
                        <Badge color="primary">Újépítés!</Badge>
                    </React.Fragment>
                )}
                {isVip(ingat.isVip) && <Badge color="black">VIP</Badge>}
            </React.Fragment>
        );
    };

    const renderKep = () => {
        let keplista = ingat.kepek;

        return ingat.kepek && ingat.kepek.length !== 0 ? (
            keplista.map((kep) => {
                if (kep.isCover) {
                    let extIndex = kep.src.lastIndexOf('.');
                    let extension = kep.src.substring(extIndex);
                    let fname = kep.src.substring(0, extIndex);
                    let icon = fname + '_icon' + extension;
                    return <img key={kep.title} src={icon} alt={kep.title} />;
                }
            })
        ) : (
            <React.Fragment />
        );
    };

    const renderAdatok = () => {
        const kaucio = ingat.kaucio + '';

        return (
            <React.Fragment>
                <strong>{`Státusz: `}</strong>
                {ingat.statusz}
                <br />
                <strong>Típus: </strong>
                {tipusFormatter(ingat.tipus + '')}
                <br />
                <strong>Ár: {arFormatter(ingat.ar) + ' ' + ingat.penznem}</strong>
                {kaucio && kaucio !== '' && (
                    <React.Fragment>
                        <br />
                        <strong>Kaució: {arFormatter(ingat.kaucio) + ' ' + ingat.penznem}</strong>
                    </React.Fragment>
                )}
                <br />
                {`Település: ${ingat && ingat.helyseg && ingat.helyseg.telepules && ingat.helyseg.telepules.telepulesnev}`}
                <br />
                {(ingat.telek || ingat.alapterulet) && meretFormatter(ingat)}
                <sup>2</sup>
                <br />
                {szobaFormatter(ingat)}
                {szintFormatter(ingat)}&nbsp;&nbsp;
            </React.Fragment>
        );
    };

    return (
        <div className="ingat_card__card" onClick={() => viewIngatlan(ingat.id)}>
            <div className="ingat_card__badges">{ingat && renderBadges()}</div>
            <div className="ingat_card__card__image">{ingat && renderKep()}</div>
            <div className="ingat_card__card__adatok">{ingat && renderAdatok()}</div>
        </div>
    );
};

IngatlanCard.propTypes = {};

export default IngatlanCard;
