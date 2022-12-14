import React, { useState, createRef } from 'react';
import { Form, Input, Button, Label } from 'reactstrap';

import { handleInputChange, addFile } from '../../../commons/InputHandlers';
import ReCAPTCHA from 'react-google-recaptcha';
// import ReCAPTCHA from "react-google-recaptcha-enterprise";
import Services from './Services';

const MyJob = (props) => {
    const recaptchaRef = createRef();
    const defaultJobObj = {
        nev: '',
        telefon: '',
        email: '',
        oneletrajz: ''
    };
    const ref = createRef();

    const [jobObj, setJobObj] = useState(defaultJobObj);
    const [elfogadAdatkezeles, setElfogadAdatkezeles] = useState(false);
    const [elkuldte, setElkuldte] = useState(false);
    const [verified, setVerified] = useState(false);

    const { addNotification, reCaptchaKey } = props;

    const resetFIleInput = (id) => {
        let el = document.getElementById(id);
        el.click();
    };

    const sendMail = async (e) => {
        e.preventDefault();
        let kuldObj = jobObj;
        if (kuldObj.oneletrajz === '') {
            delete kuldObj.oneletrajz;
        }

        const token = await recaptchaRef.current.executeAsync();
        const secret = process.env.reachaptchaSecretKey;

        const rechaptchaObj = {
            secret: secret,
            response: token
        };

        Services.checkRechaptcha(rechaptchaObj).then((res) => {
            if (res.success) {
                Services.sendJobApply(kuldObj).then((res) => {
                    if (!res.err) {
                        addNotification('success', res.msg);
                        setJobObj(defaultJobObj);
                        resetFIleInput('reset');
                        setElfogadAdatkezeles(false);
                        setElkuldte(true);

                        setTimeout(() => {
                            setElkuldte(false);
                        }, 5000);
                    } else {
                        addNotification('error', res.err);
                    }
                });
            }
        });
    };

    const renderJobForm = () => {
        return (
            <React.Fragment>
                <Form onSubmit={sendMail}>
                    <div className="col-md-12 job_title">
                        <h1>
                            <strong>Jelentkez??s elk??ld??se</strong>
                        </h1>
                    </div>
                    <div className="col-md-12" />
                    <br />
                    <div className="col-md-12">
                        <Label>N??v: *</Label>
                        <Input type="text" name="nev" id="nev" value={jobObj.nev} onChange={(e) => handleInputChange(e, jobObj, setJobObj)} />
                    </div>
                    <div className="col-md-12" />
                    <br />
                    <div className="col-md-12">
                        <Label>E-mail: *</Label>
                        <Input type="email" name="email" id="email" value={jobObj.email} onChange={(e) => handleInputChange(e, jobObj, setJobObj)} />
                    </div>
                    <div className="col-md-12" />
                    <br />
                    <div className="col-md-12">
                        <Label>Telefon: *</Label>
                        <Input type="text" name="telefon" id="telefon" value={jobObj.telefon} onChange={(e) => handleInputChange(e, jobObj, setJobObj)} />
                    </div>
                    <div className="col-md-12" />
                    <br />
                    <div className="col-md-12">
                        <Label>??n??letrajz: </Label>
                        <Input type="file" name="oneletrajz" id="oneletrajz" ref={ref} onChange={(e) => addFile(e, jobObj, setJobObj)} />
                    </div>
                    <div className="col-md-12" />
                    <br />
                    <div className="col-md-12">
                        <Label>
                            Az{' '}
                            <a href="https://www.myhomeimmo.hu/adatkezeles" target="_blank">
                                {' '}
                                adatkezel??si t??j??koztat??t
                            </a>{' '}
                            megismertem, ??s hozz??j??rulok az abban r??gz??tett adatkezel??si c??lokb??l t??rt??n?? adatkezel??shez: *
                        </Label>
                        <Input type="checkbox" name="elfogadAdatkezeles" id="elfogadAdatkezeles" checked={elfogadAdatkezeles} onChange={(e) => setElfogadAdatkezeles(e.target.checked)} required />
                    </div>
                    <div className="col-md-12" />
                    <br />
                    {/* <ReCAPTCHA ref={recaptchaRef} sitekey={reCaptchaKey} onChange={recaptchaOnChange} /> */}

                    {/* <ReCAPTCHA ref={recaptchaRef} sitekey={reCaptchaKey} /> */}
                    <ReCAPTCHA
                        sitekey={reCaptchaKey}
                        size="invisible"
                        ref={recaptchaRef}
                        onChange={() => {
                            recaptchaRef.current.reset();
                        }}
                    />
                    <Button color="success" type="submit">
                        <i className="fas fa-paper-plane"></i>
                        &nbsp;&nbsp;Elk??ld
                    </Button>
                    <br />
                    <br />
                    <span className="recaptcha_text">
                        Ez az oldal v??dve van a Google reCAPTCHA-val ??s ??rv??nyesek r?? a Google <a href="https://policies.google.com/privacy">Adatv??delmi ir??nyelvei</a> ??s az{' '}
                        <a href="https://policies.google.com/terms">??ltal??nos Szerz??d??si felt??telei</a>.
                    </span>
                    <button hidden type="reset" id="reset" />
                </Form>
            </React.Fragment>
        );
    };

    const renderKoszonjuk = () => {
        return <div className="koszonjuk">K??sz??nj??k jelentkez??s??t! Hamarosan jelentkezni fogunk!</div>;
    };

    return <div className="myjob">{!elkuldte ? renderJobForm() : renderKoszonjuk()}</div>;
};

export default MyJob;
