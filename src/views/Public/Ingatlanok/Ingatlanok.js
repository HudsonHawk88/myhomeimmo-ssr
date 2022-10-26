import React, { useState, useEffect, useCallback } from 'react';
import { Input, Label, Button } from 'reactstrap';
import Select from 'react-select';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { RVForm, RVFormGroup, RVInput, RVInputGroup, RVFormFeedback, RVInputGroupText } from '@inftechsol/reactstrap-form-validation';

import { handleInputChange } from '../../../commons/InputHandlers';
import FooldalContent from '../Fooldal/FooldalContent';
import Loading from '../../../commons/Loading';

import Services from './Services';
import { arFormatter } from '../../../commons/Lib.js';

const Ingatlanok = (props) => {
    const location = useLocation();

    const defaultTelepulesObj = {
        telepulesnev: 'Zalaegerszeg',
        km: '0'
    };

    const [telepulesObj, setTelepulesObj] = useState(defaultTelepulesObj);
    const [ingatlanOptions, setIngatlanOptions] = useState([]);

    const defaultKeresoObj = {
        tipus: '',
        altipus: '',
        rendeltetes: '',
        statusz: '',
        referenciaSzam: '',
        ar: '',
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
        Services.getIngatlanOptions().then((res) => {
            if (!res.err) {
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
        Services.getAltipusOptions().then((res) => {
            if (!res.err) {
                setAltipusOptions(res);
            }
        });
    }, []);

    const getTelepulesekOpts = useCallback(() => {
        Services.listTelepulesek().then((res) => {
            if (!res.err) {
                let telOpts = [];
                res.forEach((item) => {
                    telOpts.push({
                        label: item.telepulesnev,
                        value: item.telepulesnev
                    });
                });
                setTelepulesekOpts(telOpts);
                /*                 setSelectedTelepules({ label: 'Zalaegerszeg', value: 'Zalaegerszeg' });
                setKeresoObj({ ...keresoObj, telepules: { telepulesnev: 'Zalaegerszeg', km: '0' } }); */
            } else {
                props.notification('error', res.msg);
            }
        });
    }, []);

    const listIngatlanok = (kereso) => {
        setLoading(true);
        /* let k = kereso ? kereso : keresoObj; */
        Services.keresesIngatlanok(kereso).then((res) => {
            if (!res.err) {
                // console.log(res);
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
                keresoKey.forEach((kkey) => {
                    if (key === kkey) {
                        if (kkey === 'telepules') {
                            if (kereso[kkey].telepulesnev !== '') {
                                setSelectedTelepules({ label: kereso[kkey].telepulesnev, value: kereso[kkey].telepulesnev });
                                setTelepulesObj({ telepulesnev: kereso[kkey].telepulesnev, km: kereso[kkey].km });
                                newObj.telepules = { telepulesnev: kereso[kkey].telepulesnev, km: kereso[kkey].km };
                            } else {
                                setSelectedTelepules(null);
                                setTelepulesObj(defaultTelepulesObj);
                            }
                        } else {
                            newObj[kkey] = kereso[kkey];
                        }
                    } else {
                        newObj[key] = kereso[key] ? kereso[key] : '';
                    }
                });
            });
        } else {
            setSelectedTelepules({ label: 'Zalaegerszeg', value: 'Zalaegerszeg' });
        }
        setKeresoObj(newObj);
        listIngatlanok(newObj);
    }, [location.search]);

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

    const keres = () => {
        let newKereso = keresoObj;
        newKereso.telepules = telepulesObj;
        listIngatlanok(newKereso);
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
        const altipus = altipusOptions.find((altyp) => altyp.tipus_id === parseInt(keresoObj.tipus, 10) || altyp.tipus_id === keresoObj.tipus);
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
        const altipus = altipusOptions.find((altyp) => altyp.tipus_id === parseInt(keresoObj.tipus, 10) || altyp.tipus_id === keresoObj.tipus);
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
                                    disabled={keresoObj.tipus === '' || !altipusOptions.find((altyp) => altyp.tipus_id === parseInt(keresoObj.tipus, 10) || altyp.tipus_id === keresoObj.tipus)}
                                    value={keresoObj.altipus}
                                    onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                                >
                                    <option key="defaultRendeltetes" value="">
                                        {altipusOptions.find((altyp) => altyp.tipus_id === parseInt(keresoObj.tipus, 10) || altyp.tipus_id === keresoObj.tipus)
                                            ? 'Kérjük válasszon altipust...'
                                            : 'Ehhez a típushoz nem tartozik altípus...'}
                                    </option>
                                    {renderAltipusOptions()}
                                </RVInput>
                            </RVFormGroup>
                        </div>
                    </div>
                    <div className="row g-3">
                        {/*   <div className="col-md-3">
                            <Label>Altipus:</Label>
                            <Input type="text" name="altipus" id="altipus" value={keresoObj.altipus} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                        <div className="col-md-3">
                            <Label>Rendeltetés:</Label>
                            <Input type="text" name="rendeltetes" id="rendeltetes" value={keresoObj.rendeltetes} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div> */}

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
                            <Label>Max. ár: (Ft)</Label>
                            <Input type="text" id="ar" name="ar" value={arFormatter(keresoObj.ar)} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                        <div className="col-md-3">
                            <RVFormGroup>
                                <Label>{'Pénznem:'}</Label>
                                <RVInput type="select" name="penznem" id="penznem" value={keresoObj.penznem} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
                                    {/*  <option key="defaultPénznem" value="">
                                        {'Kérjük válasszon pénznemet...'}
                                    </option> */}
                                    {penznemOptions.map((item) => {
                                        return (
                                            <option key={item.id} value={item.value}>
                                                {item.nev}
                                            </option>
                                        );
                                    })}
                                </RVInput>
                            </RVFormGroup>
                        </div>
                        <div className="col-md-3">
                            <Label>Min. alapterület: (m2)</Label>
                            <Input type="text" id="alapterulet" name="alapterulet" value={keresoObj.alapterulet} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                        <div className="col-md-3">
                            <Label>Szobaszám:</Label>
                            <Input type="text" id="szobaszam" name="szobaszam" value={keresoObj.szobaszam} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <Label>Referencia szám:</Label>
                            <Input type="text" id="referenciaSzam" name="referenciaSzam" value={keresoObj.referenciaSzam} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                        <div className="col-md-4">
                            <Label>Min. telekméret: (m2)</Label>
                            <Input type="text" id="telek" name="telek" value={keresoObj.telek} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                        <div className="col-md-4">
                            <Label>Emelet:</Label>
                            <Input type="text" id="emelet" name="emelet" value={keresoObj.emelet} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
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
                        <div className="col-md-4">
                            <Label>Erkély</Label>
                            &nbsp;&nbsp;
                            <Input type="checkbox" id="isErkely" name="isErkely" checked={keresoObj.isErkely} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                        <div className="col-md-4">
                            <Label>Lift</Label>
                            &nbsp;&nbsp;
                            <Input type="checkbox" id="isLift" name="isLift" checked={keresoObj.isLift} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                        <div className="col-md-4">
                            <Label>Új építés</Label>
                            &nbsp;&nbsp;
                            <Input type="checkbox" id="isUjEpitesu" name="isUjEpitesu" checked={keresoObj.isUjEpitesu} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <Button color="success" onClick={() => keres()}>
                                <i className="fas fa-search"></i>&nbsp;&nbsp; Keresés
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="public-inner-content">
            <Helmet>
                <title>Ingatlanok</title>
            </Helmet>
            {renderKereso()}
            <div className="nodata">{ingatlanok.length === 0 && 'A keresés nem hozott találatot vagy nem választott egyetlen szűrőfeltételt sem!'}</div>
            {loading ? <Loading isLoading={loading} /> : <FooldalContent data={ingatlanok} />}
        </div>
    );
};

export default Ingatlanok;
