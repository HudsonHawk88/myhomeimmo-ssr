import React, { useState, useEffect, createRef } from 'react';
import { Form, Label, Input, Button } from 'reactstrap';

import { handleInputChange, recaptchaOnChange } from '../../../commons/InputHandlers';
import ReCAPTCHA from 'react-google-recaptcha';

import Services from './Services';

const Kapcsolat = (props) => {
    const recaptchaRef = createRef();
    const defaultEmailObj = {
        ok: '',
        nev: '',
        email: '',
        telefon: '',
        uzenet: '',
        toEmail: ''
    };

    const [kapcsolat, setKapcsolat] = useState([]);
    const [emailObj, setEmailObj] = useState(defaultEmailObj);
    const [elfogadAdatkezeles, setElfogadAdatkezeles] = useState(false);
    const [elkuldte, setElkuldte] = useState(false);

    const { addNotification, reCaptchaKey } = props;

    const getKapcsolat = () => {
        Services.listKapcsolat().then((res) => {
            if (!res.err) {
                setKapcsolat(res);
            }
        });
    };

    const init = () => {
        getKapcsolat();
    };

    useEffect(() => {
        init();
    }, []);

    const sendMail = async (e, toEmail) => {
        e.preventDefault();
        let kuldObj = emailObj;
        kuldObj.toEmail = toEmail;

        const token = await recaptchaRef.current.executeAsync();
        const secret = process.env.reachaptchaSecretKey;

        const rechaptchaObj = {
            secret: secret,
            response: token
        };

        Services.checkRechaptcha(rechaptchaObj).then((res) => {
            if (res.success) {
                Services.sendEmail(kuldObj).then((res) => {
                    if (!res.err) {
                        addNotification('success', res.msg);
                        setEmailObj(defaultEmailObj);
                        setElfogadAdatkezeles(false);
                    } else {
                        addNotification('error', res.err);
                    }
                });
            }
        });
    };

    const renderKapcsolat = () => {
        let kapcsolatok = JSON.parse(JSON.stringify(kapcsolat));
        return (
            kapcsolatok &&
            kapcsolatok.length !== 0 &&
            kapcsolatok.map((item, index) => {
                let kep = item.kep[0];
                return (
                    <div className="kapcsolati_adatok" key={index.toString()}>
                        <div className="kapcsolat_nev">
                            <strong>{`${item.nev}`}</strong>
                        </div>
                        <div className="kapcsolat_alapadatok">
                            <div className="kapcsolat_kep">
                                <div>
                                    <img src={kep.src} alt={kep.title} />
                                </div>
                                <div className="kapcsolat_elerhetosegek">
                                    <div>
                                        <strong>{`Cím: `}</strong>
                                        {item.cim}
                                    </div>
                                    <div>
                                        <strong>{`Telefon: `}</strong>
                                        {item.telefon}
                                    </div>
                                    <div>
                                        <strong>{`Email: `}</strong>
                                        {item.email}
                                    </div>
                                </div>
                                <div className="kapcsolat_terkep">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10915.5994816901!2d16.845653!3d46.845661!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x5bcc4784fd93d883!2sMyhome%20Immo%20Kft.!5e0!3m2!1shu!2shu!4v1640359411151!5m2!1shu!2shu"
                                        width="100%"
                                        height="450px"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <div className="kapcsolat_form">
                                <div className="kapcsolat_form_leiras">
                                    <h3>{item.kapcsolatcim}</h3>
                                    <br />
                                    {item.kapcsolatleiras}
                                </div>
                                <div className="col-md-12" />
                                <br />
                                <div className="kapcsolat_form_inputs">
                                    <Form onSubmit={(e) => sendMail(e, item.email)}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <Label>Megkeresés oka: </Label>
                                                <Input type="text" name="ok" id="ok" value={emailObj.ok} onChange={(e) => handleInputChange(e, emailObj, setEmailObj)} />
                                            </div>
                                            <div className="col-md-12" />
                                            <br />
                                            <div className="col-md-12">
                                                <Label>Név: </Label>
                                                <Input type="text" name="nev" id="nev" value={emailObj.nev} onChange={(e) => handleInputChange(e, emailObj, setEmailObj)} />
                                            </div>
                                            <div className="col-md-12" />
                                            <br />
                                            <div className="col-md-12">
                                                <Label>Email: </Label>
                                                <Input type="email" name="email" id="email" value={emailObj.email} onChange={(e) => handleInputChange(e, emailObj, setEmailObj)} />
                                            </div>
                                            <div className="col-md-12" />
                                            <br />
                                            <div className="col-md-12">
                                                <Label>Telefonszám: </Label>
                                                <Input type="text" name="telefon" id="telefon" value={emailObj.telefon} onChange={(e) => handleInputChange(e, emailObj, setEmailObj)} />
                                            </div>
                                            <div className="col-md-12" />
                                            <br />
                                            <div className="col-md-12">
                                                <Label>Üzenet: </Label>
                                                <Input type="textarea" name="uzenet" id="uzenet" rows={7} value={emailObj.uzenet} onChange={(e) => handleInputChange(e, emailObj, setEmailObj)} />
                                            </div>
                                            <div className="col-md-12" />
                                            <br />
                                            <div className="col-md-12">
                                                <Label>
                                                    Az{' '}
                                                    <a href="https://www.myhomeimmo.hu/adatkezeles" target="_blank">
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
                                                <Button
                                                    color="success"
                                                    type="submit"
                                                    disabled={
                                                        !elfogadAdatkezeles || emailObj.nev === '' || emailObj.telefon === '' || emailObj.email === '' || emailObj.ok === '' || emailObj.uzenet === ''
                                                    }
                                                >
                                                    <i className="fas fa-paper-plane"></i>
                                                    &nbsp;&nbsp;Elküld
                                                </Button>
                                                <br />
                                                <br />
                                                <span className="recaptcha_text">
                                                    Ez az oldal védve van a Google reCAPTCHA-val és érvényesek rá a Google <a href="https://policies.google.com/privacy">Adatvédelmi irányelvei</a> és
                                                    az <a href="https://policies.google.com/terms">Általános Szerződési feltételei</a>.
                                                </span>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })
        );
    };

    return <div className="public_kapcsolat">{renderKapcsolat()}</div>;
};

export default Kapcsolat;
