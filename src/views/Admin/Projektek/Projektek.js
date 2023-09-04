import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import { RVForm } from '@inftechsol/reactstrap-form-validation';

import ProjektForm from './ProjektekForm';
import Services from './Services';
import { handleInputChange } from '../../../commons/InputHandlers';
import { hasRole, makeFormData } from '../../../commons/Lib';

const Projektek = (props) => {
    const { addNotification, user } = props;

    const defaultBeruhazo = {
        nev: '',
        bemutat: '',
        cim: defaultBeruhazoCim,
        telefon: '',
        email: '',
        weboldal: ''
    };

    const defaultBeruhazoTelepulesObj = {
        telepulesnev: '',
        irszam: ''
    };

    const defaultBeruhazoCim = {
        orszag: '',
        telepules: defaultBeruhazoTelepulesObj,
        cimadatok: ''
    };

    const defaultBeruhazoHelseg = {
        orszag: '',
        irszam: '',
        telepules: defaultBeruhazoTelepulesObj,
        cimadatok: ''
    };

    const defaultTelepulesObj = {
        telepulesnev: '',
        irszam: ''
    };

    const defaultCim = {
        orszag: '',
        telepules: defaultTelepulesObj,
        cimadatok: ''
    };

    const defaultHelseg = {
        orszag: '',
        irszam: '',
        telepules: defaultTelepulesObj,
        cimadatok: ''
    };

    const defaultProjekt = {
        nev: '',
        leiras: '',
        penznem: '',
        borito: [],
        projektlakaskepek: [],
        utem: '',
        szlogen: '',
        felirat: '',
        bemutatvideo: '',
        cim: defaultCim,
        atadasev: '',
        atadasnegyedev: '',
        atadashonap: '',
        osszlakasszam: '',
        szabadlakasszam: '',
        ingtipus: '',
        elsodlegesfutes: '',
        masodlagosfutes: '',
        harmadlagosfutes: '',
        parkolotipus: '',
        parkolohasznalat: '',
        parkoloarmill: '',
        isTobbEpuletes: false,
        komfort: '',
        jutalek: '',
        megbizaskelte: '',
        megbizasvege: '',
        nempubmegjegyzes: '',
        nempubcsatolmanyok: [],
        epuletszintek: [],
        projektingatlanok: [],
        projektingatlanokOpts: [],
        isLift: false,
        tarolohasznalat: '',
        isAkadalymentes: false,
        isLegkondicionalt: false,
        isZoldOtthon: false,
        energetika: '',
        isNapelemes: false,
        isSzigetelt: false,
        szigetelesmeret: ''
    };

    const defaultFelado = {
        feladoNev: '',
        feladoTelefon: '',
        feladoEmail: '',
        feladoAvatar: []
    };

    const [orszagok, setOrszagok] = useState([]);
    const [telepulesek, setTelepulesek] = useState([]);
    const [telepulesekOpts, setTelepulesekOpts] = useState([]);
    const [telepulesObj, setTelepulesObj] = useState(defaultTelepulesObj);

    const [beruhazoTelepulesekOpts, setBeruhazoTelepulesekOpts] = useState([]);
    const [epuletszintek, setEpuletszintek] = useState([]);
    const [epuletszintekOpts, setEpuletSzintekOpts] = useState([]);
    const [projektingatlanokOpts, setProjektingatlanokOpts] = useState([]);
    const [beruhazoTelepulesObj, setBeruhazoTelepulesObj] = useState(defaultBeruhazoTelepulesObj);

    const [projektIngTipusOptions, setProjektIngTipusOptions] = useState([]);
    const [futesTipusOptions, setFutesTipusOptions] = useState([]);
    const [parkoloTipusOptions, setParkoloTipusOptions] = useState([]);
    const [parkoloHasznalatOptions, setParkoloHasznalatOptions] = useState([]);
    const [komfortOptions, setKomfortOptions] = useState([]);
    const [taroloHasznalatOptions, setTaroloHasznalatOptions] = useState([]);
    const [ebesorolasOptions, setEbersoloasOptions] = useState([]);

    const [helyseg, setHelyseg] = useState(defaultHelseg);
    const [beruhazoHelyseg, setBeruhazoHelyseg] = useState(defaultBeruhazoHelseg);
    const [formType, setFormType] = useState('FEL'); // ['FEL', 'MOD', 'DEL', '']
    const [projektekJson, setProjektekJson] = useState([]);
    const [currentId, setCurrentId] = useState(null);

    const [beruhazo, setBeruhazo] = useState(defaultBeruhazo);
    const [projektObject, setProjektObj] = useState(defaultProjekt);
    const [hirdeto, setHirdeto] = useState(defaultFelado);

    const [viewModal, setViewModal] = useState(false);
    const [projektModal, setProjektModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const [step, setStep] = useState(1);
    const maxStep = 4;

    const setDefault = (orszagokList) => {
        const lang = navigator.language;

        if (lang === 'hu-HU') {
            orszagokList.forEach((orsz) => {
                if (orsz.orszagkod === 'hun') {
                    setHelyseg({
                        orszag: orsz,
                        irszam: '',
                        telepules: defaultTelepulesObj,
                        cimadatok: ''
                    });
                    setBeruhazoHelyseg({
                        orszag: orsz,
                        irszam: '',
                        telepules: defaultBeruhazoTelepulesObj,
                        cimadatok: ''
                    });
                }
            });
        }
    };

    const init = () => {
        listOrszagok();
        listTelepulesek();
        listProjektek();
        getOptions();
        getProjektIngatlanokOpts();
    };

    const setDefaultValues = () => {
        listOrszagok();
        /* listTelepulesek(); */
        setProjektObj(defaultProjekt);
        setBeruhazo(defaultBeruhazo);
    };

    useEffect(() => {
        init();
    }, []);

    const listOrszagok = () => {
        Services.listOrszagok((err, res) => {
            if (!err) {
                setOrszagok(res);
                setDefault(res);
            }
        });
    };

    const listTelepulesek = () => {
        Services.listTelepulesek((err, res) => {
            if (!err) {
                setTelepulesek(res);
                getTelepulesekOpts(res);
                getBeruhazoTelepulesekOpts(res);
            }
        });
    };

    const getOptions = () => {
        Services.getOptions((err, res) => {
            if (!err) {
                res.forEach((option) => {
                    if (option.nev === 'projekt_ingtipus') {
                        const opts = [];
                        option.options.forEach((opt) => {
                            let newObj = {};
                            newObj.label = opt.label;
                            newObj.id = opt.id;
                            newObj.value = opt.value;
                            opts.push(newObj);
                        });
                        setProjektIngTipusOptions(opts);
                    }
                    if (option.nev === 'futesmod') {
                        const opts = [];
                        option.options.forEach((opt) => {
                            let newObj = {};
                            newObj.label = opt.nev;
                            newObj.id = opt.id;
                            newObj.value = opt.value;
                            opts.push(newObj);
                        });
                        setFutesTipusOptions(opts);
                    }
                    if (option.nev === 'parkolotipus') {
                        const opts = [];
                        option.options.forEach((opt) => {
                            let newObj = {};
                            newObj.label = opt.label;
                            newObj.id = opt.id;
                            newObj.value = opt.value;
                            opts.push(newObj);
                        });
                        setParkoloTipusOptions(opts);
                    }
                    if (option.nev === 'parkolohasznalat') {
                        const opts = [];
                        option.options.forEach((opt) => {
                            let newObj = {};
                            newObj.label = opt.label;
                            newObj.id = opt.id;
                            newObj.value = opt.value;
                            opts.push(newObj);
                        });
                        setParkoloHasznalatOptions(opts);
                    }
                    if (option.nev === 'komfort') {
                        const opts = [];
                        option.options.forEach((opt) => {
                            let newObj = {};
                            newObj.label = opt.label;
                            newObj.id = opt.id;
                            newObj.value = opt.value;
                            opts.push(newObj);
                        });
                        setKomfortOptions(opts);
                    }
                    if (option.nev === 'tarolohasznalat') {
                        const opts = [];
                        option.options.forEach((opt) => {
                            let newObj = {};
                            newObj.label = opt.label;
                            newObj.id = opt.id;
                            newObj.value = opt.value;
                            opts.push(newObj);
                        });
                        setTaroloHasznalatOptions(opts);
                    }
                    if (option.nev === 'ebesorolas') {
                        const opts = [];
                        option.options.forEach((opt) => {
                            let newObj = {};
                            newObj.label = opt.label;
                            newObj.id = opt.id;
                            newObj.value = opt.value;
                            opts.push(newObj);
                        });
                        setEbersoloasOptions(opts);
                    }
                });
            }
        });
    };

    const listProjektek = () => {
        Services.listProjektek((err, res) => {
            if (!err) {
                setProjektekJson(res);
            }
        });
    };

    const getProjekt = (id) => {
        Services.getProjekt(id, (err, res) => {
            if (!err) {
                setProjektObj(res);
                setHelyseg(res.cim);
                setBeruhazoHelyseg(res.beruhazo.cim);
                setEpuletSzintekOpts(res.epuletszintek);
                setEpuletszintek(res.epuletszintek);
                setBeruhazo(res.beruhazo);
            }
        });
    };

    const getProjektIngatlanokOpts = () => {
        Services.getProjektIngatlanokOpts((err, res) => {
            if (!err) {
                /* if () */
                res.forEach((ing) => {
                    (ing.ar = ing.ar), (ing.alapterulet = ing.alapterulet), (ing.szobaszam = ing.szobaszam), (ing.label = ing.id);
                    ing.value = ing.id;
                    ing.key = ing.id;
                });
                setProjektingatlanokOpts(res);
            }
        });
    };

    const toggleViewModal = () => {
        setViewModal(!viewModal);
    };

    const toggleProjektModal = () => {
        setStep(1);
        setProjektModal(!projektModal);
    };

    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };

    const handleNewClick = () => {
        /* setDefaultValues(); */
        setCurrentId(null);
        setFormType('FEL');
        toggleProjektModal();
    };

    const handleViewClick = (id) => {
        setCurrentId(id);
        getProjekt(id);
        toggleViewModal();
    };

    const handleEditClick = (id) => {
        setFormType('MOD');
        setStep(1);
        setCurrentId(id);
        getProjekt(id);
        toggleProjektModal();
    };

    const handleDeleteClick = (id) => {
        setCurrentId(id);
        toggleDeleteModal();
    };

    const tableIconFormatter = (cell, row) => {
        return (
            <React.Fragment>
                {/* {hasRole(user.roles, ['PROJEKT_LEK', 'SZUPER_ADMIN']) && (
                    <Button type="button" color="link" onClick={() => handleViewClick(row.id)}>
                        <i className="fas fa-eye" />
                    </Button>
                )} */}
                {hasRole(user.roles, ['SZUPER_ADMIN', 'PROJEKT_ADMIN']) && (
                    <React.Fragment>
                        <Button type="button" key={row.id + 2} color="link" onClick={() => handleEditClick(row.id)}>
                            <i className="fas fa-pencil-alt" />
                        </Button>
                        <Button type="button" key={row.id + 3} color="link" onClick={() => handleDeleteClick(row.id)}>
                            <i className="fas fa-trash" />
                        </Button>
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    };

    const renderTable = () => {
        const columns = [
            {
                dataField: 'nev',
                text: 'Név',
                filter: true,
                filterType: 'textFilter',
                filterDefaultValue: 'Keresés...'
            },
            /* {
                dataField: 'cim',
                text: 'Cím',
                filter: true,
                filterType: 'textFilter',
                filterDefaultValue: 'Keresés...'
            }, */
            {
                dataField: 'atadasev',
                text: 'Átadás éve',
                filter: true,
                filterType: 'textFilter',
                filterDefaultValue: 'Keresés...'
            },
            {
                dataField: 'osszlakasszam',
                text: 'Lakásszám'
            },
            {
                dataField: 'ingtipus',
                text: 'Ingatlan típusa'
            },
            {
                dataField: 'energetika',
                text: 'Energetika',
                filter: true,
                filterType: 'textFilter',
                filterDefaultValue: 'Keresés...'
            },
            /* {
                dataField: 'isZoldOtthon',
                text: 'Zöld Otthon?'
            },
            {
                dataField: 'isNapelemes',
                text: 'Napelemes?'
            },
            {
                dataField: 'isSzigetelt',
                text: 'Szigetelt?'
            }, */
            {
                dataField: 'id',
                formatter: tableIconFormatter,
                text: 'Műveletek'
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

        return <DataTable bordered columns={columns} datas={projektekJson} paginationOptions={paginationOptions} />;
    };

    const onSubmit = () => {
        let kuldObj = projektObject;
        kuldObj.beruhazo = beruhazo;
        kuldObj.beruhazo.cim = beruhazoHelyseg;
        kuldObj.beruhazo.cim.telepules = beruhazoTelepulesObj;
        kuldObj.cim = helyseg;
        kuldObj.cim.telepules = telepulesObj;

        kuldObj.epuletszintek = projektObject.epuletszintek.map((esz) => {
            return { label: esz.label, value: parseInt(esz.value, 10) };
        });
        /* kuldObj.epuletszintek = epuletszintek; */
        kuldObj.isTobbEpuletes = kuldObj.epuletszintek && kuldObj.epuletszintek.length > 1 ? true : false;
        /* kuldObj.borito = kuldObj.borito.filter((f) => {
            console.log(f.src && f.src.includes('blob'));
            return f.file === null || f.file === undefined;
        }); */
        /* kuldObj.projektlakaskepek = kuldObj.projektlakaskepek.filter((f) => f.file !== null || f.file !== undefined);
        kuldObj.nempubcsatolmanyok = kuldObj.nempubcsatolmanyok.filter((f) => f.file); */

        let datas = {};
        if (!currentId) {
            datas = makeFormData(kuldObj, ['borito', 'projektlakaskepek', 'nempubcsatolmanyok'], false);
            Services.addProjekt(datas, (err, res) => {
                if (!err) {
                    addNotification('success', res.msg);
                    listProjektek();
                    toggleProjektModal();
                    setStep(1);
                }
            });
        } else {
            datas = makeFormData(kuldObj, ['borito', 'projektlakaskepek', 'nempubcsatolmanyok'], true);
            Services.editProjekt(datas, currentId, (err, res) => {
                if (!err) {
                    addNotification('success', res.msg);
                    listProjektek();
                    toggleProjektModal();
                    setStep(1);
                }
            });
        }
    };

    const getErtekesito = () => {
        if (user.isErtekesito) {
            setHirdeto({
                feladoNev: nevFormatter(user.nev),
                feladoTelefon: telefonFormatter(user.telefon),
                feladoEmail: user.email,
                feladoAvatar: user.avatar
            });
        } else {
            if (ertekesito) {
                setHirdeto({
                    feladoNev: nevFormatter(ertekesito.nev),
                    feladoTelefon: telefonFormatter(ertekesito.telefon),
                    feladoEmail: ertekesito.email,
                    feladoAvatar: ertekesito.avatar
                });
            }
        }
    };

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

    const getEpuletszintekOpts = (items) => {
        let szintekOpts = [];
        items.forEach((item) => {
            szintekOpts.push({
                label: item.label,
                value: item.value
            });
        });
        setEpuletSzintekOpts(szintekOpts);
        if (szintekOpts.length === 1) {
            setProjektObj({
                ...projektObject,
                epuletszintek: {
                    label: szintekOpts[0].label,
                    value: szintekOpts[0].value
                }
            });
        }
    };

    const getBeruhazoTelepulesekOpts = (items) => {
        let telOpts = [];
        items.forEach((item) => {
            telOpts.push({
                label: item.telepulesnev,
                value: item.telepulesnev,
                irszam: item.irszam
            });
        });
        setBeruhazoTelepulesekOpts(telOpts);
        if (telOpts.length === 1) {
            setBeruhazoTelepulesObj({
                ...beruhazoTelepulesObj,
                telepulesnev: telOpts[0].value,
                irszam: telOpts[0].irszam
            });
        }
    };

    const nevFormatter = (nev) => {
        if (nev) {
            return `${nev.titulus} ${nev.vezeteknev} ${nev.keresztnev}`;
        }
    };

    const telefonFormatter = (telefon) => {
        if (telefon) {
            return `${telefon.orszaghivo} ${telefon.korzet} ${telefon.telszam}`;
        }
    };

    const isRequired = (label, isRequired) => {
        if (isRequired) {
            return label + ' *';
        } else {
            return label;
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
        } else {
            setTelepulesObj({
                ...telepulesObj,
                telepulesnev: '',
                irszam: ''
            });
            setHelyseg({
                ...helyseg,
                irszam: '',
                telepules: defaultTelepulesObj,
                cimadat: ''
            });
        }
    };

    const handleBeruhazoTelepulesChange = (e) => {
        if (e) {
            setBeruhazoTelepulesekOpts([e]);
            setBeruhazoTelepulesObj({
                ...beruhazoTelepulesObj,
                telepulesnev: e.label,
                irszam: e.irszam
            });
        } else {
            setBeruhazoTelepulesObj({
                ...beruhazoTelepulesObj,
                telepulesnev: '',
                irszam: ''
            });
            setBeruhazoHelyseg({
                ...beruhazoHelyseg,
                irszam: '',
                telepules: defaultBeruhazoTelepulesObj,
                cimadat: ''
            });
            getBeruhazoTelepulesekOpts(telepulesek);
        }
    };

    const handleEpuletszintekChange = (e) => {
        if (e) {
            setProjektObj({
                ...projektObject,
                epuletszintek: e
            });
        } else {
            setProjektObj({
                ...projektObject,
                epuletszintek: []
            });
        }
    };

    const handleProjektIngatlanokChange = (e) => {
        if (e) {
            setProjektObj({
                ...projektObject,
                projektingatlanok: e
            });
        } else {
            setProjektObj({
                ...projektObject,
                projektingatlanok: []
            });
        }
    };

    const renderEgyebOptions = (nev) => {
        let array = [];

        switch (nev) {
            case 'ingtipus': {
                array = projektIngTipusOptions;
                break;
            }
            case 'futestipus': {
                array = futesTipusOptions;
                break;
            }
            case 'parkolotipus': {
                array = parkoloTipusOptions;
                break;
            }
            case 'parkolohasznalat': {
                array = parkoloHasznalatOptions;
                break;
            }
            case 'komfort': {
                array = komfortOptions;
                break;
            }
            case 'tarolohasznalat': {
                array = taroloHasznalatOptions;
                break;
            }
            case 'ebesorolas': {
                array = ebesorolasOptions;
                break;
            }
            default: {
                break;
            }
        }

        return array.map((item) => {
            return (
                <option key={item.value + '_' + nev} value={item.value}>
                    {item.label}
                </option>
            );
        });
    };

    const renderProjektModal = () => {
        return (
            <Modal isOpen={projektModal} toggle={toggleProjektModal} backdrop="static" size="xl">
                <RVForm id="form" onSubmit={onSubmit} encType="multipart/form-data" noValidate>
                    <ModalHeader>{!formType === 'FEL' ? 'Projekt felvitele' : 'Projekt módosítása'}</ModalHeader>
                    <ModalBody>
                        <ProjektForm
                            init={init}
                            setDefaultValues={setDefaultValues}
                            step={step}
                            setStep={setStep}
                            renderEgyebOptions={renderEgyebOptions}
                            currentId={currentId}
                            setCurrentId={setCurrentId}
                            formType={formType}
                            getProjekt={getProjekt}
                            isRequired={isRequired}
                            handleTelepulesChange={handleTelepulesChange}
                            handleBeruhazoTelepulesChange={handleBeruhazoTelepulesChange}
                            handleEpuletszintekChange={handleEpuletszintekChange}
                            handleInputChange={handleInputChange}
                            listTelepulesek={listTelepulesek}
                            orszagok={orszagok}
                            telepulesek={telepulesek}
                            object={projektObject}
                            defaultProjekt={defaultProjekt}
                            setObject={setProjektObj}
                            helyseg={helyseg}
                            setHelyseg={setHelyseg}
                            beruhazo={beruhazo}
                            setBeruhazo={setBeruhazo}
                            beruhazoHelyseg={beruhazoHelyseg}
                            setBeruhazoHelyseg={setBeruhazoHelyseg}
                            telepulesObj={telepulesObj}
                            setTelepulesObj={setTelepulesObj}
                            beruhazoTelepulesObj={beruhazoTelepulesObj}
                            setBeruhazoTelepulesObj={setBeruhazoTelepulesObj}
                            telepulesekOpts={telepulesekOpts}
                            setTelepulesekOpts={setTelepulesekOpts}
                            epuletszintekOpts={epuletszintekOpts}
                            projektingatlanokOpts={projektingatlanokOpts}
                            handleProjektIngatlanokChange={handleProjektIngatlanokChange}
                            setEpuletSzintekOpts={setEpuletSzintekOpts}
                            beruhazoTelepulesekOpts={beruhazoTelepulesekOpts}
                            setBeruhazoTelepulesekOpts={setBeruhazoTelepulesekOpts}
                            onSubmit={onSubmit}
                            hirdeto={hirdeto}
                            setHirdeto={setHirdeto}
                            nevFormatter={nevFormatter}
                            telefonFormatter={telefonFormatter}
                            {...props}
                        />
                    </ModalBody>
                    {step === maxStep && (
                        <ModalFooter>
                            <Button color={step === maxStep ? 'success' : 'primary'} onClick={step === maxStep ? () => {} : () => setStep(step + 1)} type={step === maxStep ? 'submit' : 'button'}>
                                {step === maxStep ? 'Mentés' : 'Tovább'}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    toggleProjektModal();
                                }}
                            >
                                Mégsem
                            </Button>
                        </ModalFooter>
                    )}
                </RVForm>
                <ModalFooter hidden={step === maxStep}>
                    <Button color={'primary'} onClick={() => setStep(step + 1)} type={'button'}>
                        {'Tovább'}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            toggleProjektModal();
                        }}
                    >
                        Mégsem
                    </Button>
                </ModalFooter>
            </Modal>
        );
    };

    const deleteProjekt = () => {
        Services.deleteProjekt(currentId, (err, res) => {
            if (!err) {
                addNotification('success', res.msg);
                listProjektek();
                toggleDeleteModal();
            }
        });
    };

    const renderDeleteModal = () => {
        return (
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal} size="md" backdrop="static">
                <ModalHeader>Projekt törlése</ModalHeader>
                <ModalBody>Valóban törölni kívánja az adott projektet?</ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={deleteProjekt}>
                        Igen
                    </Button>
                    <Button onClick={toggleDeleteModal}>Mégsem</Button>
                </ModalFooter>
            </Modal>
        );
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <Button type="button" color="success" onClick={handleNewClick}>
                    Projekt hozzáadása
                </Button>
                &nbsp;&nbsp;
                <br />
                <br />
                {projektekJson.length > 0 && renderTable()}
                {renderProjektModal()}
                {renderDeleteModal()}
            </div>
        </div>
    );
};

Projektek.propTypes = {};

export default Projektek;
