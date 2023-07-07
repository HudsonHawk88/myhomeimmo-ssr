import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import { RVForm } from '@inftechsol/reactstrap-form-validation';
import PropTypes from 'prop-types';

import ProjektForm from './ProjektekForm';
import Services from './Services';
import { handleInputChange } from '../../../commons/InputHandlers';
import { hasRole, makeFormData } from '../../../commons/Lib';

const Projektek = (props) => {
    const { addNotification, user } = props;

    const defaultTelepulesObj = {
        telepulesnev: '',
        irszam: ''
    };

    const defaultBeruhazoTelepulesObj = {
        telepulesnev: '',
        irszam: ''
    };

    const defaultBeruhazoCim = {
        orszag: {},
        telepules: {},
        cimadatok: ''
    };

    const defaultBeruhazoHelseg = {
        orszag: '',
        irszam: '',
        telepules: defaultBeruhazoTelepulesObj,
        cimadatok: ''
    };

    const defaultBeruhazo = {
        nev: '',
        bemutat: '',
        cim: defaultBeruhazoCim,
        telefon: '',
        email: '',
        weboldal: ''
    };

    const defaultCim = {
        orszag: {},
        telepules: {},
        cimadatok: ''
    };
    const defaultProjekt = {
        nev: '',
        leiras: '',
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
        epuletszintek: [],
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

    const defaultHelseg = {
        orszag: '',
        irszam: '',
        telepules: defaultTelepulesObj,
        cimadatok: ''
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
    const [epuletszintekOpts, setEpuletSzintekOpts] = useState([{ label: '1', value: 1 }]);
    const [beruhazoTelepulesObj, setBeruhazoTelepulesObj] = useState(defaultBeruhazoTelepulesObj);

    const [projektIngTipusOptions, setProjektIngTipusOptions] = useState([]);
    const [futesTipusOptions, setFutesTipusOptions] = useState([]);
    const [parkoloTipusOptions, setParkoloTipusOptions] = useState([]);
    const [parkoloHasznalatOptions, setParkoloHasznalatOptions] = useState([]);
    const [komfortOptions, setKomfortOptions] = useState([]);
    const [taroloHasznalatOptions, setTaroloHasznalatOptions] = useState([]);
    const [ebesorolasOptions, setEbersoloasOptions] = useState([]);

    const [helyseg, setHelyseg] = useState(defaultHelseg);
    const [beruhazoHelyseg, setBeruhazoHelyseg] = useState(defaultHelseg);
    const [formType, setFormType] = useState('FEL'); // ['FEL', 'MOD', 'DEL']
    const [projektekJson, setProjektekJson] = useState([]);
    const [currentId, setCurrentId] = useState(null);

    const [beruhazo, setBeruhazo] = useState(defaultBeruhazo);
    const [projektObject, setProjektObj] = useState(defaultProjekt);
    const [hirdeto, setHirdeto] = useState(defaultFelado);

    const [viewModal, setViewModal] = useState(false);
    const [projektModal, setProjektModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const setDefault = (orszagokList) => {
        const lang = navigator.language;

        if (lang === 'hu-HU') {
            orszagokList.forEach((orsz) => {
                if (orsz.orszagkod === 'hun') {
                    setHelyseg({
                        ...helyseg,
                        orszag: orsz
                    });
                    setBeruhazoHelyseg({
                        ...beruhazoHelyseg,
                        orszag: orsz
                    });
                }
            });
        }
    };

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

    const init = () => {
        listOrszagok();
        listTelepulesek();
        listProjektek();
        getOptions();
    };

    useEffect(() => {
        init();
    }, []);

    const toggleViewModal = () => {
        setViewModal(!viewModal);
    };

    const toggleProjektModal = () => {
        setProjektModal(!projektModal);
    };

    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };

    const handleNewClick = () => {
        toggleProjektModal();
    };

    const handleViewClick = (id) => {
        setCurrentId(id);
        toggleViewModal();
    };

    const handleEditClick = (id) => {
        setCurrentId(id);
        toggleProjektModal();
    };

    const handleDeleteClick = (id) => {
        setCurrentId(id);
        toggleDeleteModal();
    };

    const tableIconFormatter = (cell, row) => {
        return (
            <React.Fragment>
                {hasRole(user.roles, ['PROJEKT_LEK', 'SZUPER_ADMIN']) && (
                    <Button type="button" color="link" onClick={() => handleViewClick(row.id)}>
                        <i class="fas fa-eye" />
                    </Button>
                )}
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
            {
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
            },
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
        beruhazo.cim = beruhazoHelyseg;
        kuldObj.beruhazo = beruhazo;
        kuldObj.cim = helyseg;
        kuldObj.epuletszintek = epuletszintek;

        let datas = {};
        if (!currentId) {
            datas = makeFormData(kuldObj, ['borito', 'projektlakaskepek'], false);
            Services.addProjekt(datas, (err, res) => {
                if (!err) {
                    addNotification('success', res.msg);
                    listProjektek();
                    toggleProjektModal();
                }
            });
        } else {
            datas = makeFormData(kuldObj, ['borito', 'projektlakaskepek'], true);
            Services.editProjekt(datas, currentId, (err, res) => {
                if (!err) {
                    addNotification('success', res.msg);
                    listProjektek();
                    toggleProjektModal();
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
            getTelepulesekOpts(telepulesek);
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
                telepules: defaultBeruhazoHelseg,
                cimadat: ''
            });
            getBeruhazoTelepulesekOpts(epuletszintek);
        }
    };

    const handleEpuletszintekChange = (e) => {
        if (e) {
            setEpuletSzintekOpts([e]);
            setEpuletszintek(e);
            /* setProjektObj({
                ...projektObject,
                epuletszintek: e
            }); */
        } else {
            /* setProjektObj({
                ...projektObject,
                epuletszintek: []
            }); */
            setEpuletszintek([]);
            getEpuletszintekOpts(epuletszintek);
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
                <option key={item.id} value={item.value}>
                    {item.label}
                </option>
            );
        });
    };

    const renderProjektModal = () => {
        return (
            <Modal isOpen={projektModal} toggle={toggleProjektModal} backdrop="static" size="xl">
                <RVForm onSubmit={onSubmit} encType="multipart/form-data" noValidate>
                    <ModalHeader>{!currentId ? 'Projekt felvitele' : 'Projekt módosítása'}</ModalHeader>
                    <ModalBody>
                        <ProjektForm
                            init={init}
                            renderEgyebOptions={renderEgyebOptions}
                            currentId={currentId}
                            formType={formType}
                            getProjekt={getProjekt}
                            isRequired={isRequired}
                            handleTelepulesChange={handleTelepulesChange}
                            handleBeruhazoTelepulesChange={handleBeruhazoTelepulesChange}
                            handleEpuletszintekChange={handleEpuletszintekChange}
                            handleInputChange={handleInputChange}
                            orszagok={orszagok}
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
                    <ModalFooter>
                        <Button color="success" type="submit">
                            Mentés
                        </Button>
                        <Button type="button" onClick={toggleProjektModal}>
                            Mégsem
                        </Button>
                    </ModalFooter>
                </RVForm>
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
            </div>
        </div>
    );
};

Projektek.propTypes = {};

export default Projektek;
