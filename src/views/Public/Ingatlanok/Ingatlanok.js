import React, { useState, useEffect, useCallback } from 'react';
import { Input, Label, Button } from 'reactstrap';
import Select from 'react-select';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { RVForm, RVFormGroup, RVInput, RVInputGroup, RVFormFeedback, RVInputGroupText } from '@inftechsol/reactstrap-form-validation';

import { handleInputChange } from '../../../commons/InputHandlers';
import FooldalContent from '../Fooldal/FooldalContent';
import Loading from '../../../commons/Loading';

import Services from './Services';
import { arFormatter } from '../../../commons/Lib.js';

const Ingatlanok = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const toBool = (value) => {
        let result = true;
        if (value === 'false' || value === '') {
            result = false;
        }

        return result;
    };

    const defaultTelepulesObj = {
        telepulesnev: 'Zalaegerszeg',
        km: '0'
    };

    const [telepulesObj, setTelepulesObj] = useState(defaultTelepulesObj);

    const defaultKeresoObj = {
        tipus: '',
        altipus: '',
        rendeltetes: '',
        statusz: '',
        referenciaSzam: '',
        minar: '',
        maxar: '',
        minatvaltott: '',
        maxatvaltott: '',
        penznem: 'Ft',
        alapterulet: '',
        szobaszam: '',
        telepules: defaultTelepulesObj,
        referenciaSzam: '',
        telek: '',
        emelet: '',
        epitesmod: '',
        futes: '',
        allapot: '',
        isErkely: false,
        isTetoter: false,
        isLift: false,
        isUjEpitesu: false
    };

    const [keresoObj, setKeresoObj] = useState(defaultKeresoObj);
    const [selectedTelepules, setSelectedTelepules] = useState([]);
    const [tipusOptions, setTipusOptions] = useState([]);
    const [statuszOptions, setStatuszOptions] = useState([]);
    const [futesOptions, setFutesOptions] = useState([]);
    const [epitesmodOptions, setEpitesmodOptions] = useState([]);
    const [allapotOptions, setAllapotOptions] = useState([]);
    const [altipusOptions, setAltipusOptions] = useState([]);
    const [rendeltesOptions, setRendeltetesOptions] = useState([]);
    const [penznemOptions, setPenznemOptions] = useState([]);
    const [emeletOptions, setEmeletOptions] = useState([]);
    const [ingatlanok, setIngatlanok] = useState([]);
    const [telepulesekOpts, setTelepulesekOpts] = useState([]);
    const [loading, setLoading] = useState(false);

    const getOptions = useCallback(() => {
        Services.getIngatlanOptions((err, res) => {
            if (!err) {
                res &&
                    res.forEach((item) => {
                        if (
                            item.nev === 'tipus' ||
                            item.nev === 'altipus' ||
                            item.nev === 'rendeltetes' ||
                            item.nev === 'statusz' ||
                            item.nev === 'futesmod' ||
                            item.nev === 'epitesmod' ||
                            item.nev === 'allapot' ||
                            item.nev === 'penznem' ||
                            item.nev === 'emelet'
                        ) {
                            if (item.nev === 'tipus') {
                                setTipusOptions(item.options);
                            } else if (item.nev === 'statusz') {
                                setStatuszOptions(item.options);
                            } else if (item.nev === 'futesmod') {
                                setFutesOptions(item.options);
                            } else if (item.nev === 'epitesmod') {
                                setEpitesmodOptions(item.options);
                            } else if (item.nev === 'allapot') {
                                setAllapotOptions(item.options);
                            } else if (item.nev === 'rendeltetes') {
                                setRendeltetesOptions(item.options);
                            } else if (item.nev === 'penznem') {
                                setPenznemOptions(item.options);
                            } else if (item.nev === 'emelet') {
                                setEmeletOptions(item.options);
                            }
                        }
                    });
            }
        });
        Services.getAltipusOptions((err, res) => {
            if (!err) {
                setAltipusOptions(res);
            }
        });
    }, []);

    const getTelepulesekOpts = useCallback(() => {
        Services.listTelepulesek((err, res) => {
            if (!err) {
                let telOpts = [];
                res &&
                    res.forEach((item) => {
                        telOpts.push({
                            label: item.telepulesnev,
                            value: item.telepulesnev
                        });
                    });
                setTelepulesekOpts(telOpts);
            }
        });
    }, []);

    const listIngatlanok = (kere) => {
        setLoading(true);
        if (kere['minatvaltott']) {
            kere['minatvaltott'] = getIntAr(kere['minatvaltott']);
        }
        if (kere['maxatvaltott']) {
            kere['maxatvaltott'] = getIntAr(kere['maxatvaltott']);
        }

        Services.keresesIngatlanok(kere, (err, res) => {
            if (!err) {
                setIngatlanok(res);
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        const newObj = defaultKeresoObj;
        if (location && location.search) {
            let kereso = location.search.substring(1);
            kereso = JSON.parse('{"' + decodeURI(kereso).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
            if (kereso && kereso.telepules !== 'undefined') {
                kereso.telepules = JSON.parse(kereso.telepules);
            }

            const keresoObjKeys = Object.keys(keresoObj);
            const keresoKey = Object.keys(kereso);
            keresoObjKeys.forEach((key) => {
                keresoKey.forEach(async (kkey) => {
                    if (key === kkey) {
                        if (kkey === 'telepules') {
                            if (kereso[kkey].telepulesnev !== '') {
                                setSelectedTelepules({ label: kereso[kkey].telepulesnev, value: kereso[kkey].telepulesnev });
                                setTelepulesObj({ telepulesnev: kereso[kkey].telepulesnev, km: kereso[kkey].km });
                                newObj.telepules = { telepulesnev: kereso[kkey].telepulesnev, km: kereso[kkey].km };
                            } else {
                                setSelectedTelepules(null);
                                setTelepulesObj({
                                    telepulesnev: '',
                                    km: '0'
                                });
                            }
                        } else if (kkey === 'minar' || kkey === 'maxar') {
                            newObj[kkey] = kereso[kkey];
                        } else {
                            if (kereso[kkey] === 'false' || kereso[kkey] === 'true') {
                                if (kereso[kkey] === 'true') newObj[kkey] = toBool(kereso[kkey]);
                            }
                        }
                    }
                });
            });
        } else {
            setSelectedTelepules({ label: 'Zalaegerszeg', value: 'Zalaegerszeg' });
        }

        const kkk = {};
        const keee = Object.keys(newObj);
        keee.forEach((k) => {
            if (newObj[k] || k === 'minatvaltott' || k === 'maxatvaltott') {
                if (newObj[k] !== '' || k === 'minatvaltott' || k === 'maxatvaltott') {
                    if (k === 'minar' || k === 'maxar' || k === 'minatvaltott' || k === 'maxatvaltott') {
                        Object.assign(kkk, { [k]: getIntAr(newObj[k]) });
                    } else {
                        Object.assign(kkk, { [k]: newObj[k] });
                    }
                }
            }
        });
        if (!newObj.minar || newObj.minar === '') {
            Object.assign(kkk, { minar: '' });
        }
        if (!newObj.maxar || newObj.maxar === '') {
            Object.assign(kkk, { maxar: '' });
        }

        convertCurr(kkk.minar, kkk.maxar, keres);
        // setKeresoObj(kkk);
        // listIngatlanok(kkk);
    }, []);

    useEffect(() => {
        getOptions();
        getTelepulesekOpts();
    }, [getOptions, getTelepulesekOpts]);

    const handleTelepulesChange = (e) => {
        if (e) {
            setSelectedTelepules(e);
            setKeresoObj({
                ...keresoObj,
                telepules: {
                    telepulesnev: e.label,
                    km: '0'
                }
            });
            setTelepulesObj({
                telepulesnev: e.label,
                km: '0'
            });
        } else {
            setSelectedTelepules(null);
            setKeresoObj({
                ...keresoObj,
                telepules: {
                    telepulesnev: '',
                    km: '0'
                },
                irszam: ''
            });
            setTelepulesObj({
                telepulesnev: '',
                km: '0'
            });
        }
    };

    const scrollToElement = (id) => {
        var element = document.getElementById(id);
        if (element) {
            element.scrollIntoView();
        }
    };

    useEffect(() => {
        if (loading) {
            scrollToElement('root');
        }
    }, [loading]);

    const getParams = () => {
        let newKereso = keresoObj;
        newKereso.telepules = telepulesObj;
        const kereso = {};
        Object.keys(newKereso).map((key) => {
            if (newKereso[key] !== '' || key === 'ar') {
                if (key === 'telepules') {
                    Object.assign(kereso, { ['telepules']: { telepulesnev: newKereso.telepules.telepulesnev, km: newKereso.telepules.km } });
                } else {
                    if (newKereso[key] === 'true' || newKereso[key] === 'false') {
                        Object.assign(kereso, { [key]: toBool(newKereso[key]) });
                    } else {
                        Object.assign(kereso, { [key]: newKereso[key] });
                    }
                }
            }
        });

        return kereso;
    };

    const getCurr = (currName) => {
        switch (currName) {
            case 'Ft':
                return 'HUF';
            case 'Euró':
                return 'EUR';
            case 'Dollár':
                return 'USD';
            default:
                return 'HUF';
        }
    };

    const getIntAr = (amount) => {
        let ar;
        const tipus = typeof amount;
        if (tipus === 'string') {
            ar = amount.replace(/ /g, '');
        } else if (tipus === 'number') {
            let str = amount + '';

            ar = str.replace(/ /g, '');
        }

        ar = parseInt(ar, 10);

        return ar;
    };

    const convertCurr = (minar, maxar, callback) => {
        let minAr = minar && minar !== '' ? getIntAr(minar.toString()) : null;
        let maxAr = maxar && maxar !== '' ? getIntAr(maxar.toString()) : null;
        const to = 'Euró';
        if (minAr) {
            Services.convertCurr({ from: getCurr(), to: getCurr(to), amount: minAr }, (err, res) => {
                if (!err) {
                    if (maxAr) {
                        Services.convertCurr({ from: getCurr(), to: getCurr(to), amount: maxAr }, (error, result) => {
                            if (!error) {
                                if (callback) {
                                    if (res && res.curr && result && result.curr) callback(res.curr.atvaltott, result.curr.atvaltott);
                                }
                            }
                        });
                    } else {
                        if (callback && res && res.curr) {
                            callback(res.curr.atvaltott, null);
                        }
                    }
                } else {
                    if (maxAr) {
                        if (callback) {
                            callback(parseInt(minAr.toString().concat('000000'), 10) / 400, parseInt(maxAr.toString().concat('000000'), 10) / 400);
                        }
                    } else {
                        if (callback) {
                            callback(parseInt(minAr.toString().concat('000000'), 10) / 400, null);
                        }
                    }
                }
            });
        } else if (maxAr) {
            Services.convertCurr({ from: getCurr(), to: getCurr(to), amount: maxAr }, (error, result) => {
                if (!error) {
                    if (callback && result && result.curr) {
                        callback(null, result.curr.atvaltott);
                    }
                } else {
                    if (callback) {
                        if (minAr) {
                            callback(parseInt(minAr.toString().concat('000000'), 10) / 400, parseInt(maxAr.toString().concat('000000'), 10) / 400);
                        }
                    }
                }
            });
        } else {
            if (callback) {
                callback(null, null);
            }
        }
    };

    const keres = (minatvaltott, maxatvaltott) => {
        let sendObj = keresoObj;
        sendObj.telepules = telepulesObj;
        sendObj['minatvaltott'] = minatvaltott ? getIntAr(minatvaltott) : 0;
        sendObj['maxatvaltott'] = maxatvaltott ? getIntAr(maxatvaltott) : null;
        let newKereso = keresoObj;
        newKereso.telepules = telepulesObj.telepulesnev;
        const ker = getParams();
        Object.assign(ker, { minar: '', maxar: '' });
        const queryParams = Object.keys(ker)
            .map((key) => {
                if (key === 'telepules') {
                    return key + '=' + JSON.stringify(newKereso[key]);
                } else {
                    return key + '=' + newKereso[key];
                }
            })
            .join('&');
        navigate(`/ingatlanok?${queryParams}`);
        listIngatlanok(sendObj);
    };

    const renderKmOptions = () => {
        return (
            <React.Fragment>
                <option key="0" value="0">
                    + 0 km
                </option>
                <option key="5" value="5">
                    + 5 km
                </option>
                <option key="10" value="10">
                    + 10 km
                </option>
                <option key="15" value="15">
                    + 15 km
                </option>
                <option key="20" value="20">
                    + 20 km
                </option>
                <option key="25" value="25">
                    + 25 km
                </option>
                <option key="30" value="30">
                    + 30 km
                </option>
                <option key="35" value="35">
                    + 35 km
                </option>
                <option key="40" value="40">
                    + 40 km
                </option>
                <option key="45" value="45">
                    + 45 km
                </option>
                <option key="50" value="50">
                    + 50 km
                </option>
            </React.Fragment>
        );
    };

    const renderAltipusOptions = () => {
        const altipus = altipusOptions && altipusOptions.find((altyp) => altyp.tipus_id === parseInt(keresoObj.tipus, 10) || altyp.tipus_id === keresoObj.tipus);
        return (
            altipus &&
            altipus.options &&
            altipus.options.map((item) => {
                return (
                    <option key={item.id} value={item.value}>
                        {item.nev}
                    </option>
                );
            })
        );
    };

    useEffect(() => {
        const altipus = altipusOptions && altipusOptions.find((altyp) => altyp.tipus_id === parseInt(keresoObj.tipus, 10) || altyp.tipus_id === keresoObj.tipus);
        if (!altipus) {
            setKeresoObj({
                ...keresoObj,
                altipus: ''
            });
        }
    }, [keresoObj.tipus]);

    const renderKereso = () => {
        return (
            <div className="reszletes_kereso" id="reszletes_kereso">
                <div className="row">
                    <h3>Összetett kereső:</h3>
                    <div className="row">
                        <div className="col-md-4">
                            <Label>Ingatlan státusza:</Label>
                            <Input type="select" name="statusz" id="statusz" value={keresoObj.statusz} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
                                <option key="" value="">
                                    Kérjük válasszon státuszt...
                                </option>
                                {statuszOptions.map((statusz) => {
                                    return (
                                        <option key={statusz.id} value={statusz.value}>
                                            {statusz.nev}
                                        </option>
                                    );
                                })}
                            </Input>
                        </div>
                        <div className="col-md-4">
                            <Label>Ingatlan típusa:</Label>
                            <Input type="select" name="tipus" id="tipus" value={keresoObj.tipus} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
                                <option key="" value="">
                                    Kérjük válasszon típust...
                                </option>
                                {tipusOptions.map((tipus) => {
                                    return (
                                        <option key={tipus.id} value={tipus.value + ''}>
                                            {tipus.nev}
                                        </option>
                                    );
                                })}
                            </Input>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{'Altipus:'}</Label>
                                <RVInput
                                    type="select"
                                    name="altipus"
                                    id="altipus"
                                    disabled={
                                        keresoObj.tipus === '' ||
                                        (altipusOptions && !altipusOptions.find((altyp) => altyp.tipus_id === parseInt(keresoObj.tipus, 10) || altyp.tipus_id === keresoObj.tipus))
                                    }
                                    value={keresoObj.altipus}
                                    onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                                >
                                    <option key="defaultRendeltetes" value="">
                                        {altipusOptions && altipusOptions.find((altyp) => altyp.tipus_id === parseInt(keresoObj.tipus, 10) || altyp.tipus_id === keresoObj.tipus)
                                            ? 'Kérjük válasszon altipust...'
                                            : 'Ehhez a típushoz nem tartozik altípus...'}
                                    </option>
                                    {renderAltipusOptions()}
                                </RVInput>
                            </RVFormGroup>
                        </div>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{'Rendeltetés:'}</Label>
                                <RVInput type="select" name="rendeltetes" id="rendeltetes" value={keresoObj.rendeltetes} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
                                    <option key="defaultRendeltetes" value="">
                                        Kérjük válasszon rendeltetést...
                                    </option>
                                    {rendeltesOptions.map((item) => {
                                        return (
                                            <option key={item.id} value={item.value}>
                                                {item.value}
                                            </option>
                                        );
                                    })}
                                </RVInput>
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <Label>Település:</Label>
                            <Select
                                type="select"
                                name="telepulesnev"
                                id="telepulesnev"
                                options={telepulesekOpts}
                                value={selectedTelepules}
                                isClearable
                                placeholder="Kérjük válasszon települést..."
                                onChange={(e) => {
                                    handleTelepulesChange(e);
                                }}
                            />
                        </div>
                        <div className="col-md-4">
                            <Label>+ km </Label>
                            <Input
                                type="select"
                                name="km"
                                id="km"
                                value={telepulesObj.km}
                                onChange={(e) =>
                                    setTelepulesObj({
                                        ...telepulesObj,
                                        km: e.target.value
                                    })
                                }
                            >
                                {renderKmOptions()}
                            </Input>
                        </div>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <Label>Min. ár: (millió Ft)</Label>
                            <Input
                                type="text"
                                id="minar"
                                name="minar"
                                value={arFormatter(keresoObj.minar)}
                                onChange={(e) => {
                                    setKeresoObj({
                                        ...keresoObj,
                                        minar: arFormatter(e.target.value)
                                    });
                                }}
                            />
                        </div>
                        <div className="col-md-3">
                            <Label>Max. ár: (millió Ft)</Label>
                            <Input
                                type="text"
                                id="maxar"
                                name="maxar"
                                value={arFormatter(keresoObj.maxar)}
                                onChange={(e) => {
                                    setKeresoObj({
                                        ...keresoObj,
                                        maxar: arFormatter(e.target.value)
                                    });
                                }}
                            />
                        </div>
                        <div className="col-md-3">
                            <RVFormGroup>
                                <Label>{'Min. alapterület:'}</Label>
                                <RVInputGroup>
                                    <RVInput
                                        pattern="[0-9]+"
                                        name="alapterulet"
                                        id="alapterulet"
                                        invalid={false}
                                        value={keresoObj.alapterulet}
                                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                                    />
                                    <RVInputGroupText>
                                        m <sup>2</sup>
                                    </RVInputGroupText>
                                </RVInputGroup>
                            </RVFormGroup>
                        </div>
                        <div className="col-md-3">
                            <Label>{'Szobaszam:'}</Label>
                            <RVInput pattern="[0-9]+" name="szobaszam" id="szobaszam" invalid={false} value={keresoObj.szobaszam} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <Label>Referencia szám:</Label>
                            <Input type="text" id="referenciaSzam" name="referenciaSzam" value={keresoObj.referenciaSzam} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{'Min. telekméret:'}</Label>
                                <RVInputGroup>
                                    <RVInput pattern="[0-9]+" name="telek" id="telek" invalid={false} value={keresoObj.telek} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                                    <RVInputGroupText>
                                        m <sup>2</sup>
                                    </RVInputGroupText>
                                </RVInputGroup>
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <Label>Emelet: </Label>
                            <Input type="select" name="emelet" id="emelet" value={keresoObj.emelet} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
                                <option key="" value="">
                                    Kérjük válasszon emeletet...
                                </option>
                                {emeletOptions.map((emelet) => {
                                    return (
                                        <option key={emelet.id} value={emelet.value}>
                                            {emelet.nev}
                                        </option>
                                    );
                                })}
                            </Input>
                        </div>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <Label>Építés módja: *</Label>
                            <Input type="select" name="epitesmod" id="epitesmod" value={keresoObj.epitesmod} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
                                <option key="" value="">
                                    Kérjük válasszon építési módot...
                                </option>
                                {epitesmodOptions.map((epitesmod) => {
                                    return (
                                        <option key={epitesmod.id} value={epitesmod.value}>
                                            {epitesmod.nev}
                                        </option>
                                    );
                                })}
                            </Input>
                        </div>
                        <div className="col-md-4">
                            <Label>Fűtés módja:</Label>
                            <Input type="select" name="futes" id="futes" value={keresoObj.futes} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
                                <option key="" value="">
                                    Kérjük válasszon fűtési módot...
                                </option>
                                {futesOptions.map((futesmod) => {
                                    return (
                                        <option key={futesmod.id} value={futesmod.value}>
                                            {futesmod.nev}
                                        </option>
                                    );
                                })}
                            </Input>
                        </div>
                        <div className="col-md-4">
                            <Label>Ingatlan állapota:</Label>
                            <Input type="select" name="allapot" id="allapot" value={keresoObj.allapot} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
                                <option key="" value="">
                                    Kérjük válasszon állapotot...
                                </option>
                                {allapotOptions.map((allapot) => {
                                    return (
                                        <option key={allapot.id} value={allapot.value}>
                                            {allapot.nev}
                                        </option>
                                    );
                                })}
                            </Input>
                        </div>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <Label>Erkély</Label>
                            &nbsp;&nbsp;
                            <Input type="checkbox" id="isErkely" name="isErkely" checked={keresoObj.isErkely} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                        <div className="col-md-3">
                            <Label>Tetőtér</Label>
                            &nbsp;&nbsp;
                            <Input type="checkbox" id="isTetoter" name="isTetoter" checked={keresoObj.isTetoter} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                        <div className="col-md-3">
                            <Label>Lift</Label>
                            &nbsp;&nbsp;
                            <Input type="checkbox" id="isLift" name="isLift" checked={keresoObj.isLift} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                        <div className="col-md-3">
                            <Label>Új építés</Label>
                            &nbsp;&nbsp;
                            <Input type="checkbox" id="isUjEpitesu" name="isUjEpitesu" checked={keresoObj.isUjEpitesu} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 p-0">
                            <Button color="dark" onClick={() => convertCurr(keresoObj.minar, keresoObj.maxar, keres)}>
                                <i className="fas fa-search"></i>&nbsp;&nbsp; Keresés
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="ingatlanok_osszkereso">
            <Helmet>
                <title>Ingatlanok</title>
            </Helmet>
            {renderKereso()}
            {loading ? (
                <Loading isLoading={loading} />
            ) : (
                <div className="nodata">{ingatlanok && ingatlanok.length === 0 && 'A keresés nem hozott találatot vagy nem választott egyetlen szűrőfeltételt sem!'}</div>
            )}

            <FooldalContent data={ingatlanok || []} />
        </div>
    );
};

export default Ingatlanok;
