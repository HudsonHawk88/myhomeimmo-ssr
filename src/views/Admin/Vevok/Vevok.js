import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import Select from 'react-select';
import { DataTable } from '@inftechsol/react-data-table';
import { RVForm, RVInput, RVFormGroup, RVInputGroup, RVInputGroupText } from '@inftechsol/reactstrap-form-validation';

import { handleInputChange } from '../../../commons/InputHandlers';
import { arFormatter } from '../../../commons/Lib.js';
import Services from './Services';

const Vevok = (props) => {
    const defaultTelepulesObj = {
        telepulesnev: 'Zalaegerszeg',
        km: '0'
    };

    const defaultNev = {
        titulus: '',
        vezeteknev: '',
        keresztnev: ''
    };

    const defaultCim = {
        orszag: '',
        irszam: '',
        telepules: '',
        kozterulet: '',
        hazszam: '',
        hrsz: '',
        postafiok: '',
        epulet: '',
        emelet: '',
        ajto: ''
    };

    const defaultTelefon = {
        orszaghivo: '',
        korzet: '',
        telszam: ''
    };

    const defaultAdminVevo = {
        email: '',
        erdeklodesek: []
    };

    const defaultKriteriumokObj = {
        tipus: '',
        altipus: '',
        rendeltetes: '',
        statusz: '',
        ar: '',
        penznem: 'Ft',
        alapterulet: '',
        szobaszam: '',
        telepules: defaultTelepulesObj,
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

    const [orszagok, setOrszagok] = useState([]);
    const [telepulesek, setTelepulesek] = useState([]);
    const [selectedTelepules, setSelectedTelepules] = useState([]);
    const [telepulesObj, setTelepulesObj] = useState(defaultTelepulesObj);
    const [telepulesekOpts, setTelepulesekOpts] = useState([]);
    const [adminVevokJson, setAdminVevokJson] = useState([]);
    const [adminVevo, setAdminVevo] = useState(defaultAdminVevo);
    const [nev, setNev] = useState(defaultNev);
    const [cim, setCim] = useState(defaultCim);
    const [telefon, setTelefon] = useState(defaultTelefon);
    const [currentId, setCurrentId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [kriteriumModal, setKriteriumModal] = useState(false);
    const [keresoObj, setKeresoObj] = useState(defaultKriteriumokObj);
    const [deleteModal, setDeleteModal] = useState(false);
    const [tipusOptions, setTipusOptions] = useState([]);
    const [statuszOptions, setStatuszOptions] = useState([]);
    const [futesOptions, setFutesOptions] = useState([]);
    const [epitesmodOptions, setEpitesmodOptions] = useState([]);
    const [allapotOptions, setAllapotOptions] = useState([]);
    const [altipusOptions, setAltipusOptions] = useState([]);
    const [rendeltesOptions, setRendeltetesOptions] = useState([]);
    const [penznemOptions, setPenznemOptions] = useState([]);
    const [emeletOptions, setEmeletOptions] = useState([]);

    const { addNotification } = props;

    const listAdminVevo = () => {
        Services.listAdminVevok((err, res) => {
            if (!err) {
                setAdminVevokJson(res);
            }
        });
    };

    const setDefault = (orszagokList) => {
        const lang = navigator.language;
        if (lang === 'hu-HU') {
            orszagokList.forEach((orsz) => {
                if (orsz.orszagkod === 'hun') {
                    setCim({
                        ...cim,
                        orszag: orsz
                    });
                }
            });
        }
    };

    const getOptions = useCallback(() => {
        Services.getIngatlanOptions((err, res) => {
            if (!err) {
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
                res.forEach((item) => {
                    telOpts.push({
                        label: item.telepulesnev,
                        value: item.telepulesnev
                    });
                });
                setTelepulesekOpts(telOpts);
                /*                 setSelectedTelepules({ label: 'Zalaegerszeg', value: 'Zalaegerszeg' });
                setKeresoObj({ ...keresoObj, telepules: { telepulesnev: 'Zalaegerszeg', km: '0' } }); */
            }
        });
    }, []);

    const getOrszagok = () => {
        Services.listOrszagok((err, res) => {
            if (!err) {
                setOrszagok(res);
                setDefault(res);
            }
        });
    };

    const getTelepulesek = () => {
        Services.listTelepulesek((err, res) => {
            if (!err) {
                setTelepulesek(res);
            }
        });
    };

    const getTelepulesByIrsz = (irsz) => {
        Services.getTelepulesByIrsz(irsz, (err, res) => {
            if (!err) {
                setCim({
                    ...cim,
                    telepules: res[0]
                });
            }
        });
    };

    const isIrszamTyped = () => {
        if (cim.irszam && cim.irszam.length === 4) {
            return true;
        } else {
            return false;
        }
    };

    const init = () => {
        getOrszagok();
        getTelepulesek();
        listAdminVevo();
        getOptions();
        getTelepulesekOpts();
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (isIrszamTyped()) {
            const irsz = cim.irszam;
            getTelepulesByIrsz(irsz);
        }
    }, [isIrszamTyped(), cim.irszam]);

    const renderOrszagokOptions = () => {
        if (orszagok.length !== 0) {
            return orszagok.map((orszag) => {
                return (
                    <option key={orszag.id} value={orszag.id}>
                        {orszag.orszagnev}
                    </option>
                );
            });
        }
    };

    const renderTelepulesekOptions = () => {
        if (telepulesek.length !== 0) {
            return telepulesek.map((telepules) => {
                return (
                    <option key={telepules.id} value={telepules.id}>
                        {telepules.telepulesnev}
                    </option>
                );
            });
        }
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const toggleKriteriumModal = () => {
        setKriteriumModal(!kriteriumModal);
    };

    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };

    const getAdminVevo = (id) => {
        Services.getAdminVevo(id, (err, res) => {
            if (!err) {
                setNev(res.nev);
                setCim(res.cim);
                setSelectedTelepules({ label: res.erdeklodes.telepules.telepulesnev, value: res.erdeklodes.telepules.telepulesnev });
                setTelepulesObj({ telepulesnev: res.erdeklodes.telepules.telepulesnev, km: res.erdeklodes.telepules.km });

                setTelefon(res.telefon);
                setAdminVevo({
                    email: res.email,
                    erdeklodesek: res.erdeklodes
                });
                setKeresoObj(res.erdeklodes);
            }
        });
    };

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

    const handleNewClick = () => {
        setCurrentId(null);
        setAdminVevo(defaultAdminVevo);
        setNev(defaultNev);
        setCim({
            ...cim,
            irszam: '',
            telepules: '',
            kozterulet: '',
            hazszam: '',
            hrsz: '',
            postafiok: '',
            epulet: '',
            emelet: '',
            ajto: ''
        });
        setTelefon(defaultTelefon);
        toggleModal();
    };

    const handleEditClick = (id) => {
        setCurrentId(id);
        getAdminVevo(id);
        toggleModal();
    };

    const onSave = (e) => {
        e.preventDefault();
        let user = adminVevo;
        user.nev = nev;
        user.cim = cim;

        user.telefon = telefon;
        user.erdeklodesek = keresoObj;
        user.erdeklodesek.telepules = telepulesObj;

        if (!currentId) {
            Services.addAdminVevo(user, (err, res) => {
                if (!err) {
                    toggleKriteriumModal();
                    toggleModal();
                    listAdminVevo();
                    addNotification('success', res.msg);
                }
            });
        } else {
            Services.editAdminVevo(user, currentId, (err, res) => {
                if (!err) {
                    toggleKriteriumModal();
                    toggleModal();
                    listAdminVevo();
                    addNotification('success', res.msg);
                }
            });
        }
    };

    const deleteAdminVevo = () => {
        Services.deleteAdminVevo(currentId, (err, res) => {
            if (!err) {
                addNotification('success', res.msg);
                listAdminVevo();
                toggleDeleteModal();
            }
        });
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

    const saveVevoErdekeltseg = (e) => {
        onSave(e);
    };

    const renderKriteriumokModal = () => {
        return (
            <Modal isOpen={kriteriumModal} toggle={toggleKriteriumModal} size="xl" backdrop="static">
                <RVForm onSubmit={saveVevoErdekeltseg} noValidate>
                    <ModalHeader>Kritériumok:</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="row">
                                <div className="col-md-4">
                                    <Label>Ingatlan státusza:</Label>
                                    <RVInput type="select" name="statusz" id="statusz" value={keresoObj.statusz} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
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
                                    </RVInput>
                                </div>
                                <div className="col-md-4">
                                    <Label>Ingatlan típusa:</Label>
                                    <RVInput type="select" name="tipus" id="tipus" value={keresoObj.tipus} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
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
                                    </RVInput>
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
                                    <RVInput
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
                                    </RVInput>
                                </div>
                            </div>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <Label>Max. ár: (Ft)</Label>
                                    <RVInput
                                        type="text"
                                        id="ar"
                                        name="ar"
                                        value={arFormatter(keresoObj.ar)}
                                        onChange={(e) => {
                                            setKeresoObj({
                                                ...keresoObj,
                                                ar: arFormatter(e.target.value)
                                            });
                                        }}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <RVFormGroup>
                                        <Label>{'Pénznem:'}</Label>
                                        <RVInput type="select" name="penznem" id="penznem" value={keresoObj.penznem} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
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
                                    <RVInput
                                        pattern="[0-9]+"
                                        name="szobaszam"
                                        id="szobaszam"
                                        invalid={false}
                                        value={keresoObj.szobaszam}
                                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                                    />
                                </div>
                            </div>
                            <div className="row g-3">
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
                                    <RVInput type="select" name="emelet" id="emelet" value={keresoObj.emelet} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
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
                                    </RVInput>
                                </div>
                                <div className="col-md-4" />
                            </div>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <Label>Építés módja: </Label>
                                    <RVInput type="select" name="epitesmod" id="epitesmod" value={keresoObj.epitesmod} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
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
                                    </RVInput>
                                </div>
                                <div className="col-md-4">
                                    <Label>Fűtés módja:</Label>
                                    <RVInput type="select" name="futes" id="futes" value={keresoObj.futes} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
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
                                    </RVInput>
                                </div>
                                <div className="col-md-4">
                                    <Label>Ingatlan állapota:</Label>
                                    <RVInput type="select" name="allapot" id="allapot" value={keresoObj.allapot} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
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
                                    </RVInput>
                                </div>
                            </div>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <Label>Erkély</Label>
                                    &nbsp;&nbsp;
                                    <RVInput type="checkbox" id="isErkely" name="isErkely" checked={keresoObj.isErkely} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                                </div>
                                <div className="col-md-3">
                                    <Label>Tetőtér</Label>
                                    &nbsp;&nbsp;
                                    <RVInput type="checkbox" id="isTetoter" name="isTetoter" checked={keresoObj.isTetoter} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                                </div>
                                <div className="col-md-3">
                                    <Label>Lift</Label>
                                    &nbsp;&nbsp;
                                    <RVInput type="checkbox" id="isLift" name="isLift" checked={keresoObj.isLift} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                                </div>
                                <div className="col-md-3">
                                    <Label>Új építés</Label>
                                    &nbsp;&nbsp;
                                    <RVInput type="checkbox" id="isUjEpitesu" name="isUjEpitesu" checked={keresoObj.isUjEpitesu} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" type="submit">
                            Mentés
                        </Button>
                        <Button color="secondary" type="button" onClick={toggleKriteriumModal}>
                            Mégsem
                        </Button>
                    </ModalFooter>
                </RVForm>
            </Modal>
        );
    };

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" backdrop="static">
                <RVForm onSubmit={onSave} noValidate={true}>
                    <ModalHeader>{!currentId ? 'Vevő hozzáadása' : 'Vevő módosítása'}</ModalHeader>
                    <ModalBody>
                        <h4>Alapadatok:</h4>
                        <br />
                        <div className="row">
                            <div className="col-md-2">
                                <Label>Titulus:</Label>
                                <RVInput name="titulus" type="text" onChange={(e) => handleInputChange(e, nev, setNev)} value={nev.titulus} />
                            </div>
                            <div className="col-md-5">
                                <Label>Vezetéknév: *</Label>
                                <RVInput name="vezeteknev" type="text" required onChange={(e) => handleInputChange(e, nev, setNev)} value={nev.vezeteknev} />
                            </div>
                            <div className="col-md-5">
                                <Label>Keresztnév: *</Label>
                                <RVInput name="keresztnev" type="text" required onChange={(e) => handleInputChange(e, nev, setNev)} value={nev.keresztnev} />
                            </div>
                            <div className="col-md-12" />
                            <br />
                            {/*    <div className="col-md-5">
                                <Label>Ország:</Label>
                                <RVInput type="select" id="orszag" name="orszag" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.orszag.id}>
                                    <option key="default" value="">
                                        {'Kérjük válasszon országot...'}
                                    </option>
                                    {renderOrszagokOptions()}
                                </RVInput>
                            </div>
                            <div className="col-md-2">
                                <Label>Irányítószám:</Label>
                                <RVInput name="irszam" id="irszam" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.irszam} />
                            </div>
                            <div className="col-md-5">
                                <Label>Település:</Label>
                                <RVInput
                                    type="select"
                                    name="telepules"
                                    id="telepules"
                                    disabled={!cim.irszam || (cim.irszam && cim.irszam.length !== 4)}
                                    onChange={(e) => handleInputChange(e, cim, setCim)}
                                    value={cim.telepules.id}
                                >
                                    <option key="default" value="">
                                        {'Kérjük válasszon települést...'}
                                    </option>
                                    {renderTelepulesekOptions()}
                                </RVInput>
                            </div>
                            <div className="col-md-12" />
                            <br />
                            <div className="col-md-6">
                                <Label>Közterület:</Label>
                                <RVInput name="kozterulet" id="kozterulet" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.kozterulet} />
                            </div>
                            <div className="col-md-2">
                                <Label>Házszám:</Label>
                                <RVInput name="hazszam" id="hazszam" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.hazszam} />
                            </div>
                            <div className="col-md-2">
                                <Label>Helyrajzi szám:</Label>
                                <RVInput name="hrsz" id="hrsz" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.hrsz} />
                            </div>
                            <div className="col-md-2">
                                <Label>Postafiók:</Label>
                                <RVInput name="postafiok" id="postafiok" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.postafiok} />
                            </div>
                            <div className="col-md-12" />
                            <br />
                            <div className="col-md-4">
                                <Label>Épület:</Label>
                                <RVInput name="epulet" id="epulet" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.epulet} />
                            </div>
                            <div className="col-md-4">
                                <Label>Emelet:</Label>
                                <RVInput name="emelet" id="emelet" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.emelet} />
                            </div>
                            <div className="col-md-4">
                                <Label>Ajtó:</Label>
                                <RVInput name="ajto" id="ajto" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.ajto} />
                            </div>
                            <div className="col-md-12" />
                            <br /> */}
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-3">
                                        <Label>Országhívó:</Label>
                                        <RVInput type="text" name="orszaghivo" id="orszaghivo" onChange={(e) => handleInputChange(e, telefon, setTelefon)} value={telefon.orszaghivo} />
                                    </div>
                                    <div className="col-md-3">
                                        <Label>Körzetszám:</Label>
                                        <RVInput type="text" name="korzet" id="korzet" onChange={(e) => handleInputChange(e, telefon, setTelefon)} value={telefon.korzet} />
                                    </div>
                                    <div className="col-md-6">
                                        <Label>Telefonszám:</Label>
                                        <RVInput type="text" name="telszam" id="telszam" onChange={(e) => handleInputChange(e, telefon, setTelefon)} value={telefon.telszam} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6" />
                        </div>
                        <hr />
                        <h4>Kapcsolattartási adatok:</h4>
                        <br />
                        <div className="row">
                            <div className="col-md-6">
                                <Label>Email: *</Label>
                                <RVInput name="email" id="email" type="email" required onChange={(e) => handleInputChange(e, adminVevo, setAdminVevo)} value={adminVevo.email} />
                            </div>
                            <div className="col-md-6" />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {/*                         <Button color="success" type="submit">
                            Mentés
                        </Button> */}
                        <Button type="button" color="warning" onClick={toggleKriteriumModal}>
                            Kritériumok megadása
                        </Button>
                        <Button color="secondary" type="button" onClick={() => toggleModal()}>
                            Mégsem
                        </Button>
                    </ModalFooter>
                </RVForm>
            </Modal>
        );
    };

    const renderDeleteModal = () => {
        return (
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalHeader>Vevő törlése</ModalHeader>
                <ModalBody>Valóban törölni kívánja a kiválasztott vevőt az adatbázisból?</ModalBody>
                <ModalFooter>
                    <Button type="button" color="danger" onClick={deleteAdminVevo}>
                        Igen
                    </Button>
                    <Button type="button" color="secondary" onClick={toggleDeleteModal}>
                        Nem
                    </Button>
                </ModalFooter>
            </Modal>
        );
    };

    const nevFormatter = (cell, row) => {
        const { nev } = row;
        return `${nev.titulus} ${nev.vezeteknev} ${nev.keresztnev}`;
    };

    const telefonFormatter = (cell, row) => {
        const { telefon } = row;

        return row.telefon.orszaghivo !== '' ? `${telefon.orszaghivo}-${telefon.korzet}/${telefon.telszam}` : 'Nincs';
    };

    const handleKiajanlasClick = (id) => {
        Services.kiajanl(id, (err, res) => {
            if (!err) {
                addNotification('success', res.msg);
            }
        });
    };

    const handleDeleteClick = (id) => {
        setCurrentId(id);
        toggleDeleteModal();
    };

    const tableIconFormatter = (cell, row) => {
        return (
            <React.Fragment>
                {/*  <Button
              key={row.id}
              color="link"
            //   onClick={() => handleViewClick(cell)}
            >
              <i className="fas fa-eye" />
            </Button> */}
                <Button key={row.id + 1} color="link" onClick={() => handleEditClick(row.id)}>
                    <i className="fas fa-pencil-alt" />
                </Button>
                <Button key={row.id + 2} color="link" onClick={() => handleDeleteClick(row.id)}>
                    <i className="fas fa-trash" />
                </Button>
                <Button key={row.id + 3} color="link" onClick={() => handleKiajanlasClick(row.id)}>
                    <i className="fas fa-external-link-alt" />
                </Button>
            </React.Fragment>
        );
    };

    const renderTable = () => {
        const columns = [
            {
                dataField: 'nev',
                text: 'Név',
                formatter: nevFormatter
            },
            {
                dataField: 'email',
                text: 'E-mail'
            },
            {
                dataField: 'telefon',
                text: 'Telefonszám',
                formatter: telefonFormatter
            },
            {
                dataField: 'id',
                text: 'Műveletek',
                formatter: tableIconFormatter
            }
        ];

        const paginationOptions = {
            count: 5,
            color: 'primary',
            rowPerPageOptions: [
                {
                    value: 5,
                    text: '5'
                },
                {
                    value: 10,
                    text: '10'
                },
                {
                    value: 25,
                    text: '25'
                },
                {
                    value: 50,
                    text: '50'
                }
            ]
        };

        return <DataTable bordered datas={adminVevokJson} columns={columns} paginationOptions={paginationOptions} />;
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <Button type="button" color="success" onClick={() => handleNewClick()}>
                    {' '}
                    + Vevő hozzáadása{' '}
                </Button>
                <br />
                <br />
                {renderModal()}
                {renderKriteriumokModal()}
                {renderDeleteModal()}
                {renderTable()}
            </div>
        </div>
    );
};

export default Vevok;
