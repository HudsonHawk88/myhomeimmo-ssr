import React, { useEffect, useState } from 'react';

import Services from './Services';

const Reklam = () => {
    const [ingatlanok, setIngatlanok] = useState([]);
    const [startIndex, setStartIndex] = useState(0);

    let ind = 0;
    let delay = 15000; // Millisecond 15 másodpercs
    const element = document.getElementById('reklam_cont');

    const getFullscreenAndPortrait = () => {
        /*   let current_mode = screen.orientation; */

        if (element) {
            element.requestFullscreen({
                navigationUI: 'hide'
            });
        }

        // we still need prefixed methods for Chrome & Safari
        /* if(document.querySelector("#reklam_container").requestFullscreen)
        document.querySelector("#reklam_container").requestFullscreen();
        else if(document.querySelector("#reklam_container").webkitRequestFullScreen)
        document.querySelector("#reklam_container").webkitRequestFullScreen(); */

        /* current_mode.lock("landscape"); */
    };

    const getIngatlanok = () => {
        Services.listIngatlanok((err, res) => {
            if (!err) {
                setIngatlanok(res);
                setInterval(() => {
                    addTwo(res);
                }, delay);
            }
        });
    };

    const addTwo = (ingek) => {
        const index = ind;
        let isBiggerThanMax = index + 4 >= ingek.length;
        if (isBiggerThanMax) {
            ind = 0;
        } else {
            ind += 4;
        }
        setStartIndex(ind);
    };

    const renderIngatlanok = () => {
        let start = ingatlanok[startIndex];
        let second = ingatlanok[startIndex + 1];
        let third = ingatlanok[startIndex + 2];
        let end = ingatlanok[startIndex + 3];
        return (
            <React.Fragment>
                <div className="reklamdiv">
                    {start && (
                        <React.Fragment>
                            <div className="reklamdiv__kep">
                                <img src={start.kepek[0].src} alt={start.kepek[0].title} />
                            </div>
                            <div className="reklamdiv__cim">{start && start.cim}</div>
                            <div className="reklamdiv__refid">{start && start.refid}</div>
                            <div className="reklamdiv__leiras">{start && start.leiras}</div>
                            <div className="reklamdiv__ar">{start && 'Ár: ' + start.ar}</div>
                        </React.Fragment>
                    )}
                </div>
                <div className="reklamdiv">
                    {second && (
                        <React.Fragment>
                            <div className="reklamdiv__kep">
                                <img src={second.kepek[0].src} alt={second.kepek[0].title} />
                            </div>
                            <div className="reklamdiv__cim">{second && second.cim}</div>
                            <div className="reklamdiv__refid">{second && second.refid}</div>
                            <div className="reklamdiv__leiras">{second && second.leiras}</div>
                            <div className="reklamdiv__ar">{second && 'Ár: ' + second.ar}</div>
                        </React.Fragment>
                    )}
                </div>
                <div className="reklamdiv">
                    {third && (
                        <React.Fragment>
                            <div className="reklamdiv__kep">
                                <img src={third.kepek[0].src} alt={third.kepek[0].title} />
                            </div>
                            <div className="reklamdiv__cim">{third && third.cim}</div>
                            <div className="reklamdiv__refid">{third && third.refid}</div>
                            <div className="reklamdiv__leiras">{third && third.leiras}</div>
                            <div className="reklamdiv__ar">{third && 'Ár: ' + third.ar}</div>
                        </React.Fragment>
                    )}
                </div>
                <div className="reklamdiv">
                    {end && (
                        <React.Fragment>
                            <div className="reklamdiv__kep">
                                <img src={end.kepek[0].src} alt={end.kepek[0].title} />
                            </div>
                            <div className="reklamdiv__cim">{end && end.cim}</div>
                            <div className="reklamdiv__refid">{end && end.refid}</div>
                            <div className="reklamdiv__leiras">{end && end.leiras}</div>
                            <div className="reklamdiv__ar">{end && 'Ár: ' + end.ar}</div>
                        </React.Fragment>
                    )}
                </div>
            </React.Fragment>
        );
    };

    const init = () => {
        getIngatlanok();
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        getFullscreenAndPortrait();
    }, [element]);

    return (
        <div className="reklam_container" id="reklam_cont">
            {renderIngatlanok()}
        </div>
    );
};

export default Reklam;
