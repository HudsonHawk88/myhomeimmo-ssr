import React, { useState, useEffect } from 'react';
import { Input, Label, Button } from 'reactstrap';
import Select from 'react-select';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

import { handleInputChange } from '../../../commons/InputHandlers';
import FooldalContent from '../Fooldal/FooldalContent';
import Loading from '../../../commons/Loading';

import Services from './Services';

const Ingatlanok = (props) => {
    const location = useLocation();

    const defaultTelepulesObj = {
        telepulesnev: '',
        irszam: '',
        km: '0'
    };

    const [telepulesObj, setTelepulesObj] = useState(defaultTelepulesObj);
    const [telepulesek, setTelepulesek] = useState([]);

    const defaultKeresoObj = {
        tipus: '',
        statusz: '',
        irszam: '',
        referenciaSzam: '',
        ar: '',
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
    const [tipusOptions, setTipusOptions] = useState([]);
    const [statuszOptions, setStatuszOptions] = useState([]);
    const [futesOptions, setFutesOptions] = useState([]);
    const [epitesmodOptions, setEpitesmodOptions] = useState([]);
    const [allapotOptions, setAllapotOptions] = useState([]);

    const getOptions = () => {
        Services.getIngatlanOptions().then((res) => {
            if (!res.err) {
                res.forEach((item) => {
                    if (item.nev === 'tipus' || item.nev === 'statusz' || item.nev === 'futesmod' || item.nev === 'epitesmod' || item.nev === 'allapot') {
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
                        }
                    }
                });
            }
        });
    };

    useEffect(() => {
        getOptions();
    }, []);

    const getTelepulesekOpts = (items) => {
        let telOpts = [];
        items.forEach((item) => {
            telOpts.push({
                label: item.telepulesnev,
                value: item.telepulesnev,
                irszam: item.irszam
            });
        });
        setTelepulesekOpts(telOpts);
        if (telOpts.length === 1) {
            setTelepulesObj({
                ...telepulesObj,
                telepulesnev: telOpts[0].value,
                irszam: telOpts[0].irszam
            });
        }
    };

    const handleTelepulesChange = (e) => {
        if (e) {
            setTelepulesekOpts([e]);
            setTelepulesObj({
                ...telepulesObj,
                telepulesnev: e.label,
                irszam: e.irszam
            });
            setKeresoObj({
                ...keresoObj,
                telepules: {
                    ...keresoObj.telepules,
                    telepulesnev: e.label,
                    irszam: e.irszam
                }
            });
        } else {
            setKeresoObj({
                ...keresoObj,
                telepules: {
                    telepulesnev: '',
                    irszam: '',
                    km: '0'
                },
                irszam: ''
            });
            setTelepulesObj({
                ...telepulesObj,
                telepulesnev: '',
                irszam: ''
            });
            getTelepulesekOpts(telepulesek);
        }
    };

    useEffect(() => {
        if (location && location.search) {
            let kereso = location.search.substring(1);
            kereso = JSON.parse('{"' + decodeURI(kereso).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
            if (kereso && kereso.telepules !== 'undefined') {
                kereso.telepules = JSON.parse(kereso.telepules);
            }

            const keresoObjKeys = Object.keys(keresoObj);
            const keresoKey = Object.keys(kereso);
            const newObj = {};
            keresoObjKeys.forEach((key) => {
                keresoKey.forEach((kkey) => {
                    if (key === kkey) {
                        if (kkey === 'telepules') {
                            newObj[kkey] = kereso[kkey];
                            if (kereso[kkey].telepulesnev !== '' || kereso[kkey].irszam !== '') {
                                setTelepulesObj(kereso[kkey]);
                            } else {
                                setTelepulesObj({
                                    ...telepulesObj,
                                    irszam: 8900
                                });
                                getTelepulesByIrsz('8900');
                            }
                        } else {
                            newObj[kkey] = kereso[kkey];
                        }
                    } else {
                        newObj[key] = kereso[key] ? kereso[key] : '';
                    }
                });
            });
            setKeresoObj(newObj);
            listIngatlanok(newObj);
        } else {
            setTelepulesObj({
                ...telepulesObj,
                irszam: 8900
            });
            getTelepulesByIrsz('8900');
        }
    }, [location]);

    const [ingatlanok, setIngatlanok] = useState([]);
    const [telepulesekOpts, setTelepulesekOpts] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const listIngatlanok = (kereso) => {
        setLoading(true);
        Services.keresesIngatlanok(kereso).then((res) => {
            if (!res.err) {
                // console.log(res);
                setIngatlanok(res);
                setLoading(false);
            }
        });
        // console.log(ingatlanok);
    };

    const listTelepulesek = () => {
        Services.listTelepulesek().then((res) => {
            if (!res.err) {
                setTelepulesek(res);
            }
        });
    };

    const isIrszamTyped = () => {
        if (telepulesObj.irszam && telepulesObj.irszam.length === 4) {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        listTelepulesek();
    }, []);

    const keres = () => {
        let newKereso = keresoObj;
        newKereso.telepules = telepulesObj;
        listIngatlanok(newKereso);
    };

    const getTelepulesByIrsz = (irsz) => {
        Services.getTelepulesByIrsz(irsz).then((res) => {
            if (!res.err) {
                if (res.length === 1) {
                    setTelepulesObj({
                        ...telepulesObj,
                        telepulesnev: res[0].telepulesnev,
                        irszam: res[0].irszam
                    });
                    getTelepulesekOpts(res);
                } else {
                    setTelepulesObj({
                        ...telepulesObj,
                        telepulesnev: keresoObj.telepules.telepulesnev,
                        irszam: res[0].irszam
                    });
                    if (keresoObj.telepules.telepulesnev === '') {
                        getTelepulesekOpts(res);
                    } else {
                        setTelepulesekOpts([
                            {
                                label: keresoObj.telepules.telepulesnev,
                                value: keresoObj.telepules.telepulesnev,
                                irszam: keresoObj.telepules.irszam
                            }
                        ]);
                    }
                }
            }
        });
    };

    useEffect(() => {
        if (isIrszamTyped()) {
            getTelepulesByIrsz(telepulesObj.irszam);
        }
    }, [isIrszamTyped()]);

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

    const renderKereso = () => {
        return (
            <div className="reszletes_kereso" id="reszletes_kereso">
                <div className="row">
                    <h3>Összetett kereső:</h3>
                    <div className="row">
                        <div className="col-md-6">
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
                        <div className="col-md-6">
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
                    </div>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <Label>Irányítószám:</Label>
                            <Input type="text" name="irszam" id="irszam" value={telepulesObj.irszam} onChange={(e) => handleInputChange(e, telepulesObj, setTelepulesObj)} />
                        </div>
                        <div className="col-md-4">
                            <Label>Település:</Label>
                            <Select
                                type="select"
                                name="telepulesnev"
                                id="telepulesnev"
                                options={telepulesekOpts}
                                value={telepulesekOpts.length === 1 ? telepulesekOpts[0] : ''}
                                isClearable
                                placeholder="Kérjük válasszon települést..."
                                onChange={(e) => {
                                    handleTelepulesChange(e);
                                    if (e) {
                                        setTelepulesObj({ ...telepulesObj, telepulesnev: e.value });
                                    }
                                }}
                            />
                        </div>
                        <div className="col-md-4">
                            <Label>+ km </Label>
                            <Input type="select" name="km" id="km" value={telepulesObj.km} onChange={(e) => handleInputChange(e, telepulesObj, setTelepulesObj)}>
                                {renderKmOptions()}
                            </Input>
                        </div>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <Label>Max. ár: (Ft)</Label>
                            <Input type="text" id="ar" name="ar" value={keresoObj.ar} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                        <div className="col-md-4">
                            <Label>Min. alapterület: (m2)</Label>
                            <Input type="text" id="alapterulet" name="alapterulet" value={keresoObj.alapterulet} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                        </div>
                        <div className="col-md-4">
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
