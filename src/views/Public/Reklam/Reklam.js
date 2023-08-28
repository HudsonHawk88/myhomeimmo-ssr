import React, { useEffect, useState } from 'react';

import Services from './Services';
import { Button } from 'reactstrap';

const Reklam = () => {
    const [ingatlanok, setIngatlanok] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    let ind = 0;
    let delay = 15000; // Millisecond 15 másodpercs
    /* const element = document.getElementById('reklam_cont'); */
    const element = document.documentElement;

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
        let isBiggerThanMax = index + 1 >= ingek.length;
        if (isBiggerThanMax) {
            ind = 0;
        } else {
            ind += 1;
        }
        setStartIndex(ind);
    };

    function fullscreen() {
        var isInFullScreen =
            (document.fullscreenElement && document.fullscreenElement !== null) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
            (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
            (document.msFullscreenElement && document.msFullscreenElement !== null);

        var docElm = document.documentElement;
        if (!isInFullScreen) {
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            } else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    const showFullScreen = () => {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            /* Safari */
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            /* IE11 */
            element.msRequestFullscreen();
        }
    };

    const exitFullScreen = () => {
        if (isFullScreen && document && document.documentElement) {
            document.exitFullscreen();
        }
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    useEffect(() => {
        if (isFullScreen) {
            exitFullScreen();
        } else {
            showFullScreen;
        }
    }, [isFullScreen]);

    const renderIngatlanok = () => {
        let start = ingatlanok[startIndex];
        return (
            <React.Fragment>
                <div className="reklamdiv" id="reklamdiv">
                    {start && (
                        <React.Fragment>
                            <Button style={{ backgroundColor: 'transparent', color: 'red', position: 'absolute', zIndex: 999 }} onClick={fullscreen}>
                                FS
                            </Button>
                            <div className="reklamdiv__kep">
                                <img src={start.kepek[0].src} alt={start.kepek[0].title} />
                                <img src={start.kepek[1] && start.kepek[1].src} alt={start.kepek[1] && start.kepek[1].title} />
                                <img src={start.kepek[2] && start.kepek[2].src} alt={start.kepek[2] && start.kepek[2].title} />
                                <img src={start.kepek[3] && start.kepek[3].src} alt={start.kepek[3] && start.kepek[3].title} />
                            </div>
                            <div className="reklamdiv__cim">{start && start.cim}</div>
                            <div className="reklamdiv__refid">{start && start.refid}</div>
                            <div className="reklamdiv__leiras">{start && start.leiras}</div>
                            <div className="reklamdiv__ar">{start && 'Ár: ' + start.ar}</div>
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

    /* useEffect(() => {
        getFullscreenAndPortrait();
    }, [element]); */

    return (
        <div className="reklam_container" id="reklam_cont">
            {renderIngatlanok()}
        </div>
    );
};

export default Reklam;
