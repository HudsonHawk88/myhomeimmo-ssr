import React, { useState, useEffect } from 'react';
import Services from './Services';

const Rolunk = (props) => {
    const [rolunk, setRolunk] = useState([]);
    const [isHidden, setIsHidden] = useState([]);
    const [currentId, setCurrentId] = useState(1);

    const getDefaultIsHidden = (items) => {
        let newArray = [null];
        items.forEach((item) => {
            if (item)
                newArray.push({
                    isHidden: item.id === 1 ? true : false,
                    item: item
                });
        });
        setCurrentId(1);
        setIsHidden(newArray);
    };

    const getRolunk = () => {
        Services.listRolunk().then((res) => {
            if (!res.err) {
                setRolunk(res);
                getDefaultIsHidden(res);
            }
        });
    };

    const init = () => {
        getRolunk();
    };

    useEffect(() => {
        init();
        setTimeout(() => {
            scrollToElement('leiras');
        }, 100);
    }, []);

    const scrollToElement = (id) => {
        var element = document.getElementById(id);
        if (element) {
            element.scrollIntoView(true, { behavior: 'smooth' });
        }
    };

    const toggleRolunk = (id, isHidden, e) => {
        let items = isHidden;
        setCurrentId(id);
        const n = items.map((el) => {
            if (el) {
                if (el.item.id === id) {
                    el.isHidden = !el.isHidden;
                } else {
                    el.isHidden = false;
                }
            }
            return el;
        });
        setIsHidden(n);
        setTimeout(() => {
            scrollToElement('leiras');
        }, 100);
    };

    const renderRolunk = () => {
        let aboutUs = JSON.parse(JSON.stringify(rolunk));
        return (
            aboutUs &&
            aboutUs.length !== 0 &&
            aboutUs.map((item) => {
                let kep = item.kep[0];
                return (
                    <div className={`public_rolunk__item ${isHidden && isHidden.length !== 0 && isHidden[item.id].isHidden ? 'active' : ''}`} key={item.id + 'item'}>
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
                                    hidden={isHidden && isHidden.length !== 0 && isHidden[item.id].isHidden}
                                    onClick={(e) => {
                                        toggleRolunk(item.id, isHidden, e);
                                    }}
                                >
                                    Több...
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })
        );
    };

    const renderLeiras = () => {
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
                {/*     <a href="#" hidden={isHidden && isHidden.length !== 0 && !isHidden[currentId].isHidden} onClick={() => toggleRolunk(currentId)}>
                    Kevesebb...
                </a> */}
            </React.Fragment>
        );
    };

    return (
        <div className="public_rolunk">
            <div className="item">{renderRolunk()}</div>
            <div className="leiras" id="leiras">
                {renderLeiras()}
            </div>
        </div>
    );
};

export default Rolunk;
