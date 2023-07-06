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
                    <div className={`public_rolunk__item ${item.id === currentId ? 'active' : ''}`} key={item.id + '_item'}>
                        <div className="public_rolunk__kep">
                            <div>
                                <img src={kep.src} alt={item.nev} />
                            </div>
                        </div>
                        <div className="public_rolunk__alapadatok">
                            <div>
                                <strong>{item.nev}</strong>
                                <br />
                                {item.beosztas}
                                <br />
                                <hr />
                                {item.email}
                                <br />
                                {item.telefon}
                                <br />
                                <button
                                    hidden={item.id === currentId}
                                    onClick={(e) => {
                                        viewRolunk(item.id);
                                    }}
                                >
                                    Részletek...
                                </button>
                            </div>
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
            <div className="item">{renderRolunk()}</div>
            {/* <div className="leiras" id="leiras" /> */}
        </div>
    );
};

export default Rolunk;
