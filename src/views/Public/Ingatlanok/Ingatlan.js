import React, { useState, useEffect, createRef } from 'react';
import { Card, CardBody, CardHeader, Form, Label, Input, Button } from 'reactstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { handleInputChange } from '../../../commons/InputHandlers';

import Gallery from '../../../commons/Gallery.js';
import Loading from '../../../commons/Loading.js';
import Services from './Services.js';
import { arFormatter } from '../../../commons/Lib.js';

const Ingatlan = (props) => {
    const { addNotification, reCaptchaKey, history } = props;
    const location = useLocation();
    const { state } = location;
    const recaptchaRef = createRef();

    const defaultIngatlanObj = {
        alapterulet: '',
        allapot: '',
        ar: '',
        penznem: '',
        beepithetoseg: '',
        cim: '',
        emelet: '',
        epitesmod: '',
        felszobaszam: '',
        futes: '',
        gaz: '',
        helyseg: {},
        id: '',
        irsz: '',
        isAktiv: false,
        isErkely: false,
        isHirdetheto: false,
        isKiemelt: false,
        isTetoter: false,
        isLift: false,
        isUjEpitesu: false,
        kaucio: '',
        kepek: [],
        leiras: '',
        refid: '',
        rogzitIdo: '',
        statusz: '',
        szennyviz: '',
        szobaszam: '',
        telek: '',
        telektipus: '',
        telepules: '',
        tipus: '',
        altipus: '',
        rendeltetes: '',
        villany: '',
        viz: '',
        hirdeto: {}
    };

    const defaultEmailObj = {
        nev: '',
        telefon: '',
        toEmail: '',
        email: '',
        refId: '',
        uzenet: ''
    };

    const [ingatlanObj, setIngatlanObj] = useState(defaultIngatlanObj);
    const [loading, setLoading] = useState(false);
    const [emailObj, setEmailObj] = useState(defaultEmailObj);
    const [elfogadAdatkezeles, setElfogadAdatkezeles] = useState(false);
    const [ingatlanOptions, setIngatlanOptions] = useState([]);
    const [altipusOptions, setAltipusOptions] = useState([]);

    const getIngatlan = (id) => {
        setLoading(true);
        Services.getIngatlan(id).then((res) => {
            if (!res.err) {
                res[0].tipus = res[0].tipus + '';
                setIngatlanObj(res[0]);
                setLoading(false);
            }
        });
    };

    const getOptions = () => {
        Services.getIngatlanOptions().then((res) => {
            if (!res.err) {
                setIngatlanOptions(res);
            }
        });
        Services.getAltipusOptions().then((res) => {
            if (!res.err) {
                setAltipusOptions(res);
            }
        });
    };

    useEffect(() => {
        getOptions();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(typeof window !== 'undefined' && window.location.search);
        const id = params.get('id');
        if (id) {
            getIngatlan(id);
        }
    }, [location]);

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

    const altipusFormatter = (tipus, subtype) => {
        let altipus = '';
        altipusOptions.forEach((option) => {
            const tipus_id = option.tipus_id + '';
            if (tipus_id + '' === tipus) {
                option.options.forEach((opt) => {
                    if (opt.value === subtype || parseInt(opt.value, 10) === subtype) {
                        altipus = opt.nev;
                    }
                });
            }
        });
        return altipus;
    };

    const getKepek = () => {
        let items = [];

        if (ingatlanObj && ingatlanObj.kepek) {
            ingatlanObj.kepek.forEach((kep) => {
                let extIndex = kep.src.lastIndexOf('.');
                let extension = kep.src.substring(extIndex);
                let fname = kep.src.substring(0, extIndex);
                let icon = fname + '_icon' + extension;
                items.push({
                    original: kep.src,
                    thumbnail: icon,
                    originalHeight: '400px',
                    // originalWidth: '100%',
                    // thumbnailHeight: '300px',
                    thumbnailWidth: '500px'
                    // sizes: '100%'
                });
            });
        }
        return items;
    };

    const getAvatar = (avatar) => {
        if (avatar) {
            return avatar[0];
        } else {
            return [];
        }
    };

    const illetekFormatter = (illetek) => {
        let newAr = illetek;
        newAr = newAr.replace(/\D/g, '');
        newAr = newAr.replace('.', '').split('').reverse().join(''); // reverse
        if (newAr.length > 0) {
            var newValue = '';
            for (var i = 0; i < newAr.length; i++) {
                if (i % 3 === 0 && i > 0) {
                    newValue += '.';
                }
                newValue += newAr[i];
            }
            newValue = newValue.split('').reverse().join('');
            return newValue;
        }
    };

    const ertekFormatter = (ingatlan) => {
        switch (ingatlan.statusz) {
            case 'Kiadó': {
                return `Ár: ${ingatlanObj.ar} ${ingatlanObj.penznem}/hó ${ingatlanObj.kaucio ? 'Kaució: ' + ingatlanObj.kaucio + ' ' + ingatlanObj.penznem : ''}`;
            }
            case 'Illeték': {
                return `${arFormatter(ingatlan.illetek)} ${ingatlanObj.penznem}`;
            }
            default: {
                return `Ár: ${ingatlanObj.ar} ${ingatlanObj.penznem}`;
            }
        }
    };

    const meretFormatter = (ingatlan) => {
        switch (ingatlan.tipus) {
            case '3': {
                return `Méret: ${ingatlanObj.telek} m`;
            }
            case '6': {
                return `Méret: ${ingatlanObj.telek} m`;
            }
            case '13': {
                return `Méret: ${ingatlanObj.telek} m`;
            }
            case '10': {
                return `Méret: ${ingatlanObj.telek} m`;
            }
            default: {
                return `Méret: ${ingatlanObj.alapterulet} m`;
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
                    return `Szoba: ${ingatlan.szobaszam} Félszoba: ${ingatlan.felszobaszam}`;
                } else if (ingatlan.szobaszam) {
                    return `Szoba: ${ingatlan.szobaszam}`;
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
                return ingatlan.emelet && (parseInt(ingatlan.emelet, 10) ? ingatlan.emelet + '. emelet' : ingatlan.emelet);
            }
        }
    };

    const getNemUresFields = (ertek) => {
        let hidden = false;
        if (ertek === '' || ertek === 0) {
            hidden = true;
        }
        return hidden;
    };

    const sendMail = async (e) => {
        e.preventDefault();
        let kuldObj = emailObj;
        kuldObj.toEmail = ingatlanObj.rogzitoEmail;
        // kuldObj.toEmail = 'info@inftechsol.hu';
        kuldObj.refId = ingatlanObj.refid;

        const token = await recaptchaRef.current.executeAsync();
        const secret = process.env.reachaptchaSecretKey;

        const rechaptchaObj = {
            secret: secret,
            response: token
        };

        Services.checkRechaptcha(rechaptchaObj).then((res) => {
            if (res.success) {
                Services.sendErdeklodes(kuldObj).then((res) => {
                    if (!res.err) {
                        addNotification('success', res.msg);
                        setEmailObj(defaultEmailObj);
                    } else {
                        addNotification('error', res.err);
                    }
                });
            }
        });
    };

    const getIlletek = (ar) => {
        let illetek = '';
        let ingar = ar + '';
        ingar = ingar.replace(/\D/g, '');
        ingar = ingar.replace('.', '').split('').join('');
        ingar = parseInt(ingar, 10);
        if (ingar && !isNaN(ingar)) {
            illetek = Math.round(ingar * 0.04);
            illetek = illetek + '';
        }
        return ertekFormatter({ illetek: illetek, statusz: 'Illeték' });
    };

    const isTelekAdatokHidden = () => {
        let isHidden = true;
        if (ingatlanObj) {
            if (ingatlanObj.tipus === 2 || ingatlanObj.tipus === 3 || ingatlanObj.tipus === 6 || ingatlanObj.tipus === 13 || ingatlanObj.tipus === 10) {
                isHidden = false;
            }
        }

        return isHidden;
    };

    const isIngatlanAdatokHidden = () => {
        let isHidden = false;
        if (ingatlanObj.tipus === '3' || ingatlanObj.tipus === '6' || ingatlanObj.tipus === '7' || ingatlanObj.tipus === '10' || ingatlanObj.tipus === '13') {
            isHidden = true;
        }

        return isHidden;
    };

    const openFacebookShare = (url, title, w, h) => {
        if (__isBrowser__) {
            var left = screen.width / 2 - w / 2;
            var top = screen.height / 2 - h / 2;
            return window.open(
                url,
                title,
                'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left
            );
        } else {
            return false;
        }
    };

    const renderIngatlan = () => {
        let kep = ingatlanObj.hirdeto && getAvatar(ingatlanObj.hirdeto.feladoAvatar);
        return (
            <div className="ingatlan_card">
                {/* <meta property="og:title" content={ingatlanObj.cim} /> */}
                {/* <meta property="og:image" content={ingatlanObj.kepek[0].src} /> */}
                <div className="ingatlan_adatok">
                    <div className="ingatlan_cim">{ingatlanObj.cim}</div>
                    <div className="galeria">
                        <Gallery showPlayButton={false} lazyLoad useBrowserFullscreen={true} thumbnailPosition="bottom" items={getKepek()} />
                    </div>
                    <div className="alapadatok">
                        <strong>Ár: {arFormatter(ingatlanObj.ar) + ' ' + ingatlanObj.penznem}</strong>&nbsp;&nbsp;
                        {ingatlanObj.kaucio && ingatlanObj.kaucio !== '' && (
                            <>
                                {' '}
                                <strong>Kaució: {arFormatter(ingatlanObj.kaucio) + ' ' + ingatlanObj.penznem}</strong>
                            </>
                        )}
                        {`${ingatlanObj.kaucio && ' '}Település: ${ingatlanObj.helyseg.telepules && ingatlanObj.helyseg.telepules.telepulesnev}`}
                        &nbsp;&nbsp;
                        {(ingatlanObj.telek || ingatlanObj.alapterulet) && meretFormatter(ingatlanObj)}
                        <sup>2</sup>&nbsp;&nbsp;
                        {szobaFormatter(ingatlanObj)}&nbsp;&nbsp;
                        {szintFormatter(ingatlanObj)}&nbsp;&nbsp;
                    </div>
                    <div className="adatok">
                        <Card className="adat">
                            <CardHeader>
                                <h4>
                                    <strong>Ingatlan adatai</strong>
                                </h4>
                            </CardHeader>
                            <CardBody>
                                <div className="row">
                                    <div className="col-md-6" hidden={getNemUresFields(ingatlanObj.statusz)}>
                                        <React.Fragment>
                                            <strong>{`Ingatlan státusza: `}</strong>
                                            {ingatlanObj.statusz}
                                        </React.Fragment>
                                    </div>
                                    <div className="col-md-6" hidden={getNemUresFields(ingatlanObj.epitesmod)}>
                                        <React.Fragment>
                                            <strong>{`Építés módja: `}</strong>
                                            {ingatlanObj.epitesmod}
                                        </React.Fragment>
                                    </div>
                                    <div className="col-md-12" />
                                    <br />
                                    <div className="col-md-6" hidden={getNemUresFields(ingatlanObj.tipus)}>
                                        <React.Fragment>
                                            <strong>{`Ingatlan típusa: `}</strong>
                                            {tipusFormatter(ingatlanObj.tipus)}
                                        </React.Fragment>
                                    </div>
                                    <div className="col-md-6" hidden={getNemUresFields(ingatlanObj.altipus)}>
                                        <React.Fragment>
                                            <strong>{`Ingatlan altípusa: `}</strong>
                                            {altipusFormatter(ingatlanObj.tipus, ingatlanObj.altipus)}
                                        </React.Fragment>
                                    </div>
                                    <div className="col-md-12" />
                                    <br />
                                    <div className="col-md-6" hidden={getNemUresFields(ingatlanObj.telepules)}>
                                        <React.Fragment>
                                            <strong>{`Település: `}</strong>
                                            {ingatlanObj.telepules}
                                        </React.Fragment>
                                    </div>
                                    <div className="col-md-6" hidden={getNemUresFields(ingatlanObj.rendeltetes)}>
                                        <React.Fragment>
                                            <strong>{`Rendeltetés: `}</strong>
                                            {ingatlanObj.rendeltetes}
                                        </React.Fragment>
                                    </div>
                                    <div className="col-md-12" />
                                    <br />
                                    <div className="col-md-6" hidden={!ingatlanObj.isTetoter}>
                                        <React.Fragment>
                                            <strong>{`Tetőtéri: `}</strong>
                                            {ingatlanObj.isTetoter ? 'Igen' : 'Nem'}
                                        </React.Fragment>
                                    </div>
                                    <div className="col-md-6" hidden={ingatlanObj.tipus !== 1}>
                                        <React.Fragment>
                                            <strong>{`Erkély: `}</strong>
                                            {ingatlanObj.isErkely ? 'Van' : 'Nincs'}
                                        </React.Fragment>
                                    </div>
                                    <div className="col-md-12" />
                                    <br />
                                    <div className="col-md-6" hidden={getNemUresFields(ingatlanObj.futes)}>
                                        <React.Fragment>
                                            <strong>{`Fűtés típusa: `}</strong>
                                            {ingatlanObj.futes}
                                        </React.Fragment>
                                    </div>
                                    <div className="col-md-6" hidden={getNemUresFields(ingatlanObj.alapterulet)}>
                                        <React.Fragment>
                                            <strong>{`Alapterület: `}</strong>
                                            {`${ingatlanObj.alapterulet} m`}
                                            <sup>2</sup>
                                        </React.Fragment>
                                    </div>
                                    <div className="col-md-12" />
                                    <br />
                                    <div className="col-md-6" hidden={isTelekAdatokHidden()}>
                                        <React.Fragment>
                                            <strong>{`Telek mérete: `}</strong>
                                            {`${ingatlanObj.telek ? ingatlanObj.telek : '0'} m`}
                                            <sup>2</sup>
                                        </React.Fragment>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="tulajdonsag" hidden={isIngatlanAdatokHidden()}>
                            <CardHeader>
                                <h4>
                                    <strong>Ingatlan tulajdonságai</strong>
                                </h4>
                            </CardHeader>
                            <CardBody>
                                <div className="row">
                                    <div className="col-md-6" hidden={getNemUresFields(ingatlanObj.allapot)}>
                                        <React.Fragment>
                                            <strong>{`Állapota: `}</strong>
                                            {ingatlanObj.allapot}
                                        </React.Fragment>
                                    </div>
                                    {/* <div className='col-md-6'>
                                            
                                </div>
                                <div className='col-md-12' />
                                <br />
                                <div className='col-md-6'>
                                    
                                </div>
                                <div className='col-md-6'>
                                    
                                </div> */}
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="leiras">
                            <CardHeader>
                                <h4>
                                    <strong>Ingatlan leírása</strong>
                                </h4>
                            </CardHeader>
                            <CardBody>
                                <div className="row">
                                    <div className="col-md-12">{ingatlanObj.leiras}</div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="illetek" hidden={ingatlanObj.statusz === 'Kiadó'}>
                            <CardHeader>
                                <h4>
                                    <strong>Várható illeték</strong>
                                </h4>
                            </CardHeader>
                            <CardBody>
                                <strong>{getIlletek(ingatlanObj.ar)}</strong>
                            </CardBody>
                        </Card>
                    </div>
                </div>
                <div className="ertekesito_adatok">
                    <div className="elado_avatar">
                        <img src={kep && kep.src} alt={ingatlanObj.hirdeto && ingatlanObj.hirdeto.feladoNev} />
                    </div>
                    <div className="elado_adatok">
                        <div>
                            <span>Név:</span>
                            {ingatlanObj.hirdeto && ingatlanObj.hirdeto.feladoNev}
                        </div>
                        <div>
                            <span>E-mail:</span>
                            {` ${ingatlanObj.hirdeto && ingatlanObj.hirdeto.feladoEmail}`}
                        </div>
                        <div>
                            <span>Telefon:</span>
                            {ingatlanObj.hirdeto && ingatlanObj.hirdeto.feladoTelefon}
                        </div>
                    </div>
                    <button className="facebook-share" data-href={`${process.env.shareUrl}${ingatlanObj.id}`} data-layout="button" data-size="large">
                        <span onClick={() => openFacebookShare(`https://www.facebook.com/sharer/sharer.php?u=${process.env.shareUrl}${ingatlanObj.id}`, 'Megosztás facebookon', 800, 800)}>
                            <i className="fa fa-facebook-f" /> Megosztás
                        </span>
                    </button>
                    <div className="erdeklodes_form">
                        <Form onSubmit={sendMail}>
                            <div className="row">
                                <div className="col-md-12">
                                    <Label>Név:</Label>
                                    <Input type="text" name="nev" id="nev" value={emailObj.nev} onChange={(e) => handleInputChange(e, emailObj, setEmailObj)} />
                                </div>
                                <div className="col-md-12" />
                                <br />
                                <div className="col-md-12">
                                    <Label>E-mail cím:</Label>
                                    <Input type="email" name="email" id="email" value={emailObj.email} onChange={(e) => handleInputChange(e, emailObj, setEmailObj)} />
                                </div>
                                <div className="col-md-12" />
                                <br />
                                <div className="col-md-12">
                                    <Label>Telefonszám:</Label>
                                    <Input type="text" name="telefon" id="telefon" value={emailObj.telefon} onChange={(e) => handleInputChange(e, emailObj, setEmailObj)} />
                                </div>
                                <div className="col-md-12" />
                                <br />
                                <div className="col-md-12">
                                    <Label>Üzenet:</Label>
                                    <Input type="textarea" name="uzenet" id="uzenet" rows="7" value={emailObj.uzenet} onChange={(e) => handleInputChange(e, emailObj, setEmailObj)} />
                                </div>
                                <div className="col-md-12" />
                                <br />
                                <div className="col-md-12">
                                    <Label>
                                        Az{' '}
                                        <a href="https://www.myhomeimmo.hu/adatkezeles" target="_blank">
                                            {' '}
                                            adatkezelési tájékoztatót
                                        </a>{' '}
                                        megismertem, és hozzájárulok az abban rögzített adatkezelési célokból történő adatkezeléshez: *
                                    </Label>
                                    <Input
                                        type="checkbox"
                                        name="elfogadAdatkezeles"
                                        id="elfogadAdatkezeles"
                                        checked={elfogadAdatkezeles}
                                        onChange={(e) => setElfogadAdatkezeles(e.target.checked)}
                                        required
                                    />
                                </div>
                                <div className="col-md-12" />
                                <br />
                                <div className="col-md-12">
                                    <ReCAPTCHA
                                        sitekey={reCaptchaKey}
                                        size="invisible"
                                        ref={recaptchaRef}
                                        onChange={() => {
                                            recaptchaRef.current.reset();
                                        }}
                                    />
                                    <Button color="success" disabled={!elfogadAdatkezeles || emailObj.nev === '' || emailObj.telefon === '' || emailObj.email === '' || emailObj.uzenet === ''}>
                                        <i className="fas fa-paper-plane"></i>
                                        &nbsp;&nbsp;Elküld
                                    </Button>
                                    <br />
                                    <br />
                                    <span className="recaptcha_text">
                                        Ez az oldal védve van a Google reCAPTCHA-val és érvényesek rá a Google <a href="https://policies.google.com/privacy">Adatvédelmi irányelvei</a> és az{' '}
                                        <a href="https://policies.google.com/terms">Általános Szerződési feltételei</a>.
                                    </span>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        );
    };

    return loading ? (
        <Loading isLoading={loading} />
    ) : (
        <React.Fragment>
            <Helmet>
                <meta name="description" content={ingatlanObj.leiras} />
                <meta name="og:title" content={ingatlanObj.cim} />
                <meta name="og:description" content={ingatlanObj.leiras} />
                <meta name="og:image" content={ingatlanObj.kepek && ingatlanObj.kepek.length !== 0 && ingatlanObj.kepek[0].src} />
                <title>{ingatlanObj.cim}</title>
            </Helmet>
            {renderIngatlan()}
        </React.Fragment>
    );
    // <div className='row'>
    //     <div className='col-md-12'>

    //     </div>
    // </div>
};

export default Ingatlan;
