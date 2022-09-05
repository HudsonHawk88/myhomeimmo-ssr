import React, { useState, useEffect } from 'react';
import { UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody } from 'reactstrap';
import KeresoForm from '../../views/Public/Fooldal/KeresoForm';
import Gallery from '../../commons/Gallery';

const PublicHeaderCarousel = (props) => {
    const { ingatlanok } = props;

    const arFormatter = (ingatlan) => {
        let kaucio = '';
        let ar = '';
        function chunk(str, n) {
            var ret = [];
            var i;
            var len;

            for (i = 0, len = str.length; i < len; i += n) {
                ret.push(str.substr(i, n));
            }

            return ret;
        }

        if (ingatlan.kaucio) {
            kaucio = ingatlan.kaucio + '';
            kaucio = kaucio.split('').reverse().join('');
            kaucio = chunk(kaucio, 3).join('.');
            kaucio = kaucio.split('').reverse().join('');
        }

        if (ingatlan.ar) {
            ar = ingatlan.ar + '';
            ar = ar.split('').reverse().join('');
            ar = chunk(ar, 3).join('.');
            ar = ar.split('').reverse().join('');
        }

        switch (ingatlan.statusz) {
            case 'Kiadó': {
                return `Ár: ${ar} ${ingatlan.penznem}/hó ${ingatlan.kaucio ? 'Kaució: ' + kaucio + ' ' + ingatlan.penznem : ''}`;
            }
            default: {
                return `Ár: ${ar} ${ingatlan.penznem}`;
            }
        }
    };

    const item = (ingatlan, kep, index) => {
        // const imageStyle = {
        //     height: '400px',
        //     width: '65%'
        // }

        return (
            <div className="carousel_image" key={index.toString()}>
                <img src={kep.src} alt={kep.title} />
                <p className="image-gallery-description">
                    {ingatlan.cim}
                    <br />
                    <span>{`Referenciaszám: `}</span>
                    {ingatlan.refid}
                    <br />
                    <span>{`Település: `}</span>
                    {ingatlan.telepules}
                    <br />
                    <span>{arFormatter(ingatlan)}</span>
                </p>
            </div>
        );
    };

    /*  useMemo(() => {
        if (location.pathname === '/') {
            setLoading(true);
        if (ingatlanok && ingatlanok.length !== 0) {
            setLoading(false)
        }
        }
        
        
    }, [ingatlanok, location]) */

    const getItems = () => {
        let items = [];
        /*     console.log(ingatlanok) */
        ingatlanok &&
            ingatlanok.forEach((ingatlan, index) => {
                let kep = ingatlan && ingatlan.kepek && ingatlan.kepek.length !== 0 && JSON.parse(JSON.stringify(ingatlan.kepek[0]));
                if (kep) {
                    items.push({
                        original: kep.src,
                        thumbnail: kep.src,
                        originalHeight: '600px',
                        originalWidth: '200px',
                        renderItem: () => item(ingatlan, kep, index),
                        thumbnailWidth: '500px'
                    });
                }
            });

        return items;
    };

    return (
        <div className="undernav row">
            <div className="col-md-6 undernav__kereso">
                <UncontrolledAccordion defaultOpen="1">
                    <AccordionItem>
                        <AccordionHeader targetId="1">Gyorskereső</AccordionHeader>
                        <AccordionBody accordionId="1">
                            <KeresoForm />
                        </AccordionBody>
                    </AccordionItem>
                </UncontrolledAccordion>
            </div>
            <div className="col-md-6 undernav__carousel">
                <Gallery items={getItems()} showFullscreenButton={false} showThumbnails={false} showPlayButton={false} infinite={true} autoPlay={true} slideInterval={15000} showBullets={false} />
            </div>
        </div>
    );
};

export default PublicHeaderCarousel;
