import React from 'react';
import PropTypes from 'prop-types';

const ProjektCard = (props) => {
    const { id, borito, adatok, onClickCard } = props;
    const { cim, telepules, oszzlakszam, szabadlakszam, ingtipus, atadasev, atadashonap, atadasnegyedev, minar, maxar, minter, maxter, minszoba, maxszoba, penznem } = adatok;

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

    /* const getTrunkedLeiras = (leir, maxLength) => {
        let result = '';
        const start = 0;
        let end = leir && leir.length ? (leir.length > maxLength ? maxLength : leir.length) : 0;
        if (end && end !== 0) {
            result = leir.substring(start, end);
        }
        if (leir && leir.length && leir.length > maxLength) {
            result = result.concat('...');
        }

        return result;
    }; */

    const getMillAr = (ar) => {
        let millAr = ar / 1000000;
        millAr = millAr.toFixed(2);

        return millAr;
    };

    return (
        <div className="projekt_card" key={id} onClick={onClickCard}>
            <div className="projekt_borito">
                <img src={borito && borito.src} alt={borito && borito.filename} />
            </div>
            {/* console.log('ADATOK: ', adatok) */}
            <div className="projekt_adatok">
                <span>
                    <strong>{cim}</strong>
                </span>
                <span>
                    Típus: <strong>{ingtipus}</strong>
                </span>
                <span>
                    Helység: <strong>{telepules}</strong>
                </span>
                <span>
                    Ár: <strong>{`${getMillAr(minar)} - ${getMillAr(maxar)} M ${penznem}`}</strong>
                </span>
                <span>
                    Méret:{' '}
                    <strong>
                        {`${minter} - ${maxter} m`}
                        <sup>2</sup>
                    </strong>
                </span>{' '}
                <span>
                    Szobák száma: <strong>{`${minszoba} - ${maxszoba} db`}</strong>
                </span>
                <span>
                    Várható átadás: <strong>{`${atadasev}. ${atadashonap ? getAtadasHonap(atadashonap) : getNegyedev(atadasnegyedev)}`}</strong>
                </span>
                <span>
                    Összes / szabad: <strong>{`${oszzlakszam} / ${szabadlakszam} db`}</strong>
                </span>
            </div>
        </div>
    );
};

ProjektCard.propTypes = {
    borito: PropTypes.object,
    adatok: PropTypes.object.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ProjektCard;
