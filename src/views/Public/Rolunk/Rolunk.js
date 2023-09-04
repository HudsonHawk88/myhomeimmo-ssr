import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Services from './Services';

const Rolunk = (props) => {
    const navigate = useNavigate();
    const [rolunk, setRolunk] = useState([]);
    const [currentId, setCurrentId] = useState(null);

    const getRolunk = () => {
        Services.listRolunk((err, res) => {
            if (!err) {
                let newArr = [];
                const fonok = res.filter((r) => r.nev === 'Berki Mónika');
                const tobbiek = res.filter((r) => r.nev !== 'Berki Mónika');
                newArr = newArr.concat(fonok, tobbiek);
                setRolunk(newArr);
            }
        });
    };

    const init = () => {
        getRolunk();
    };

    useEffect(() => {
        init();
    }, []);

    const viewRolunk = (id) => {
        setCurrentId(id);
        navigate(`/rolunk/ertekesito?id=${id}`, { state: { id: id } });
    };

    const renderRolunk = () => {
        let aboutUs = JSON.parse(JSON.stringify(rolunk));
        return (
            aboutUs &&
            aboutUs.length !== 0 &&
            aboutUs.map((item, index) => {
                let kep = item.kep[0];
                return (
                    <div className={`public_rolunk__item ${item.id === currentId ? 'active' : ''}`} key={item.id + '_item'} onClick={() => viewRolunk(item.id)}>
                        <div className="public_rolunk__baloldal">
                            <div className="public_rolunk__fejlec">
                                <div className="public_rolunk__fejlec__logo" />
                                <div className="public_rolunk__fejlec__adatok">
                                    <strong>{item.nev}</strong>
                                    <br />
                                    <span className="public_rolunk__beosztas">{item.beosztas}</span>
                                    <br />
                                    <span className="public_rolunk__cegnev1">MYHOME IMMO KFT.</span>
                                    <br />
                                    <span className="public_rolunk__cegnev2">Ingatlaniroda</span>
                                </div>
                            </div>
                            <div className="public_rolunk__alapadatok">
                                <div>
                                    <img src={'/static/images/telikon.png'} className="ikon" />
                                    <span>{item.telefon}</span>
                                </div>
                                <div>
                                    <img src={'/static/images/emailikon.png'} className="ikon" />
                                    <span>{item.email}</span>
                                </div>
                                <div>
                                    <img src={'/static/images/cimikon.png'} className="ikon" />
                                    <span>{'8900 Zalaegerszeg, Eötvös utca 4.'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="public_rolunk__kep">
                            <img src={kep.src} alt={item.nev} />
                        </div>
                    </div>
                );
            })
        );
    };

    /*  const renderLeiras = () => {
        return (
            <React.Fragment>
                <div
                    className="public_rolunk__leiras"
                    id={currentId}
                    hidden={isHidden && isHidden.length !== 0 && !isHidden[currentId].isHidden}
                    dangerouslySetInnerHTML={{
                        __html: isHidden && isHidden.length !== 0 && isHidden[currentId].item.leiras
                    }}
                />
            </React.Fragment>
        );
    }; */

    return (
        <div className="public_rolunk">
            {renderRolunk()}
            {/* <div className="leiras" id="leiras" /> */}
        </div>
    );
};

export default Rolunk;
