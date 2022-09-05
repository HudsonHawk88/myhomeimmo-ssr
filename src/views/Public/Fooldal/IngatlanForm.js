import React, { useState } from 'react';
import { Form, Input, Label, Button } from 'reactstrap';

import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';

const IngatlanForm = () => {
    const { addNotification } = props;

    const defaultMailForm = {
        nev: '',
        telefon: '',
        statusz: '',
        email: ''
    };

    const [mailForm, setMailForm] = useState(defaultMailForm);
    const [elfogadAdatkezeles, setElfogadAdatkezeles] = useState(false);

    const sendMail = () => {
        Services.sendMail(mailForm).then((res) => {
            if (!res.err) {
                setMailForm(defaultMailForm);
                addNotification(res.msg);
            } else {
                addNotification(res.err);
            }
        });

        setMailForm(defaultMailForm);
    };

    return (
        <Form>
            <div className="col-md-12">
                <Label>Név: *</Label>
                <Input type="text" name="nev" id="nev" value={mailForm.nev} onChange={(e) => handleInputChange(e, mailForm, setMailForm)} required />
            </div>
            <br />
            <div className="col-md-12">
                <Label>Telefon: *</Label>
                <Input type="tel" name="telefon" id="telefon" value={mailForm.telefon} onChange={(e) => handleInputChange(e, mailForm, setMailForm)} required />
            </div>
            <br />
            <div className="col-md-12">
                <Label>E-mail: *</Label>
                <Input type="email" name="email" id="email" value={mailForm.email} onChange={(e) => handleInputChange(e, mailForm, setMailForm)} required />
            </div>
            <br />
            <div className="col-md-12">
                <Label>Státusz: *</Label>
                <Input type="select" name="statusz" id="statusz" value={mailForm.statusz} onChange={(e) => handleInputChange(e, mailForm, setMailForm)} required>
                    <option key="" value="">
                        Kérjük válasszon státuszt...
                    </option>
                    <option key="elado" value="Eladó">
                        Eladó
                    </option>
                    <option key="kiadó" value="Kiadó">
                        Kiadó
                    </option>
                </Input>
            </div>
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
                <Input type="checkbox" name="elfogadAdatkezeles" id="elfogadAdatkezeles" checked={elfogadAdatkezeles} onChange={(e) => setElfogadAdatkezeles(e.target.checked)} required />
            </div>
            <br />
            <div className="col-md-12">
                <Button color="success" onClick={() => sendMail()} disabled={!elfogadAdatkezeles || mailForm.nev === '' || mailForm.telszam === '' || mailForm.email === '' || mailForm.statusz === ''}>
                    <i className="fas fa-paper-plane"></i>
                    &nbsp;&nbsp;Elküld
                </Button>
            </div>
        </Form>
    );
};

export default IngatlanForm;
