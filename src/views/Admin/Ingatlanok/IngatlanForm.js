import React, { useState, useEffect, useCallback } from 'react';
import { Button, ModalHeader, ModalBody, ModalFooter, Label, Modal } from 'reactstrap';
import { RVForm, RVFormGroup, RVInput, RVInputGroup, RVFormFeedback, RVInputGroupText } from '@inftechsol/reactstrap-form-validation';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { handleInputChange } from '../../../commons/InputHandlers.js';
import { arFormatter, makeFormData } from '../../../commons/Lib.js';
import KepCard from '../../../commons/KepCard.js';
import Stepper from '../../../commons/Stepper';
import Services from './Services.js';

const IngatlanForm = (props) => {
    const { step, setStep, maxStep, hasRole, user, listIngatlanok, currentId, formType, ertekesito, toggleModal, nevFormatter, telefonFormatter, addNotification } = props;

    const defaultTelepulesObj = {
        telepulesnev: '',
        irszam: ''
    };

    const defaultObj = {
        office_id: '',
        cim: '',
        leiras: '',
        kepek: [],
        ar: '',
        kaucio: '',
        penznem: '',
        statusz: '',
        tipus: '',
        altipus: '',
        rendeltetes: '',
        allapot: '',
        emelet: '',
        alapterulet: '',
        telek: '',
        telektipus: '',
        beepithetoseg: '',
        viz: '',
        gaz: '',
        villany: '',
        szennyviz: '',
        gazfogy: null,
        villanyfogy: null,
        etanusitvany: '',
        szobaszam: '',
        felszobaszam: '',
        epitesmod: '',
        futes: '',
        isHirdetheto: false,
        isKiemelt: false,
        isErkely: false,
        isTetoter: false,
        isLift: false,
        isAktiv: false,
        isUjEpitesu: false,
        jutalek: '',
        megbizaskelte: '',
        megbizasvege: '',
        nempubmegjegyzes: '',
        nempubcsatolmanyok: []
    };

    const defaultHelyseg = {
        orszag: '',
        irszam: '',
        telepules: defaultTelepulesObj,
        utca: '',
        hazszam: '',
        hrsz: ''
    };

    const defaultFelado = {
        feladoNev: '',
        feladoTelefon: '',
        feladoEmail: '',
        feladoAvatar: []
    };

    const [ingatlanObj, setIngatlanObj] = useState(defaultObj);
    const [regiIngatlan, setRegiIngatlnan] = useState(defaultObj);
    const [helyseg, setHelyseg] = useState(defaultHelyseg);
    const [hirdeto, setHirdeto] = useState(defaultFelado);
    const [orszagok, setOrszagok] = useState([]);
    const [telepulesek, setTelepulesek] = useState([]);
    const [telepulesekOpts, setTelepulesekOpts] = useState([]);
    const [telepulesObj, setTelepulesObj] = useState(defaultTelepulesObj);
    const [ingatlanOptions, setIngatlanOptions] = useState([]);
    const [altipusOptions, setAltipusOptions] = useState([]);
    const [kepekModal, setKepekModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleKepekModal = () => {
        setKepekModal(!kepekModal);
    };

    const isIrszamTyped = () => {
        if (helyseg.irszam && helyseg.irszam.length === 4) {
            return true;
        } else {
            return false;
        }
    };

    const setDefault = (orszagokList) => {
        const lang = navigator.language;

        if (lang === 'hu-HU') {
            orszagokList.forEach((orsz) => {
                if (orsz.orszagkod === 'hun') {
                    setHelyseg({
                        ...helyseg,
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

    const getTelepulesByIrsz = (irsz) => {
        Services.getTelepulesByIrsz(irsz, (err, res) => {
            if (!err) {
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
                        telepulesnev: helyseg.telepules.telepulesnev,
                        irszam: irsz
                    });
                    if (helyseg.telepules.telepulesnev === '') {
                        getTelepulesekOpts(res);
                    } else {
                        setTelepulesekOpts([
                            {
                                label: helyseg.telepules.telepulesnev,
                                value: helyseg.telepules.telepulesnev,
                                irszam: helyseg.telepules.irszam
                            }
                        ]);
                    }
                }
            }
        });
    };

    const getIngatlan = (id) => {
        Services.getIngatlan(id, (err, res) => {
            if (!err) {
                res[0].tipus = res[0].tipus + '';
                res[0].nempubcsatolmanyok = res[0].nempubcsatolmanyok || [];
                setIngatlanObj(res[0]);
                setHirdeto(res[0].hirdeto);
                delete ingatlanObj.helyseg;
                delete ingatlanObj.hirdeto;
                setHelyseg(res[0].helyseg);
                setRegiIngatlnan(res[0]);
            }
        });
    };

    const getOptions = () => {
        Services.getIngatlanOptions((err, res) => {
            if (!err) {
                setIngatlanOptions(res);
            }
        });
        Services.getAltipusOptions((err, res) => {
            if (!err) {
                setAltipusOptions(res);
            }
        });
    };

    const init = () => {
        listOrszagok();
        listTelepulesek();
        getOptions();
    };

    useEffect(() => {
        init();
        if (formType === 'FEL' && !currentId) {
            setIngatlanObj(defaultObj);
            setHelyseg({
                ...helyseg,
                irszam: '',
                telepules: ''
            });
            if (user.isErtekesito) {
                setHirdeto({
                    feladoNev: nevFormatter(user.nev),
                    feladoTelefon: telefonFormatter(user.telefon),
                    feladoEmail: user.email,
                    feladoAvatar: user.avatar
                });
            } else {
                setHirdeto({
                    feladoNev: nevFormatter(ertekesito.nev),
                    feladoTelefon: telefonFormatter(ertekesito.telefon),
                    feladoEmail: ertekesito.email,
                    feladoAvatar: ertekesito.avatar
                });
            }
        } else {
            getIngatlan(currentId);
        }
    }, [currentId, formType]);

    useEffect(() => {
        const altipus = altipusOptions.find((altyp) => altyp.tipus_id === parseInt(ingatlanObj.tipus, 10) || altyp.tipus_id === ingatlanObj.tipus);
        if (!altipus) {
            setIngatlanObj({
                ...ingatlanObj,
                altipus: ''
            });
        }
    }, [ingatlanObj.tipus]);

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

    /* useEffect(() => {
        if (user && formType === 'FEL') {
            getErtekesito();
        }
    }, [user, ertekesito, formType]); */

    const getImageId = (acceptedFiles) => {
        let firstId = 1;
    };

    const MyDropzone = () => {
        const onDrop = useCallback((acceptedFiles) => {
            const kepek = acceptedFiles.map((file, index) => {
                // Do whatever you want with the file contents
                let obj = {
                    id: index,
                    filename: file.name,
                    title: file.name,
                    isCover: false,
                    preview: URL.createObjectURL(file),
                    src: URL.createObjectURL(file),
                    file: file
                };

                return obj;
            });

            setIngatlanObj({
                ...ingatlanObj,
                kepek: [...ingatlanObj.kepek, ...kepek]
            });
        }, []);

        const { getRootProps, getInputProps } = useDropzone({ accept: 'image/*', onDrop });

        return (
            <React.Fragment>
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
                </div>
                <KepCard services={Services} list={ingatlanObj} property="kepek" setList={setIngatlanObj} {...props} />
            </React.Fragment>
        );
    };

    useEffect(() => {
        if (isIrszamTyped()) {
            getTelepulesByIrsz(helyseg.irszam);
        }
    }, [isIrszamTyped(), helyseg.irszam]);

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
                utca: '',
                hazszam: '',
                hrsz: ''
            });
            getTelepulesekOpts(telepulesek);
        }
    };

    const renderOrszagokOptions = () => {
        if (orszagok.length !== 0) {
            return orszagok.map((orszag) => {
                return (
                    <option key={orszag.id + 'orszag'} value={orszag.id}>
                        {orszag.orszagnev}
                    </option>
                );
            });
        }
    };

    const renderOptions = (type) => {
        const optionObj = ingatlanOptions.find((opt) => opt.nev === type);

        const opts = optionObj && optionObj.options ? optionObj.options : [];
        return opts.map((opt) => {
            return (
                <option key={opt.id} value={opt.value}>
                    {opt.nev ? opt.nev : opt.label}
                </option>
            );
        });
    };

    const renderAltipusOptions = () => {
        const altipus = altipusOptions.find((altyp) => altyp.tipus_id === parseInt(ingatlanObj.tipus, 10) || altyp.tipus_id === ingatlanObj.tipus);
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

    const IsAllapotFieldHidden = () => {
        let isHidden = true;
        if (ingatlanObj.tipus === '1' || ingatlanObj.tipus === '2' || ingatlanObj.tipus === '4' || ingatlanObj.tipus === '5' || ingatlanObj.tipus === '9' || ingatlanObj.tipus === '12') {
            isHidden = false;
        }

        return isHidden;
    };

    const isEmeletHidden = () => {
        let isHidden = true;
        if (
            (ingatlanObj.tipus === '1' && !ingatlanObj.isTetoter) ||
            (ingatlanObj.tipus === '4' && !ingatlanObj.isTetoter) ||
            (ingatlanObj.tipus === '12' && !ingatlanObj.isTetoter) ||
            (ingatlanObj.tipus === '5' && !ingatlanObj.isTetoter)
        ) {
            isHidden = false;
        }

        return isHidden;
    };

    const isTelekAdatokHidden = () => {
        let isHidden = true;
        if (ingatlanObj.tipus === '2' || ingatlanObj.tipus === '3' || ingatlanObj.tipus === '6' || ingatlanObj.tipus === '13' || ingatlanObj.tipus === '10') {
            isHidden = false;
        }

        return isHidden;
    };

    const isIngatlanAdatokHidden = () => {
        let isHidden = false;
        if (ingatlanObj.tipus === '3' || ingatlanObj.tipus === '6' || ingatlanObj.tipus === '13' || ingatlanObj.tipus === '10') {
            isHidden = true;
        }

        return isHidden;
    };

    const isRequired = (label, isRequired) => {
        if (isRequired) {
            return label + ' *';
        } else {
            return label;
        }
    };

    const isRendeltetesHidden = () => {
        let isHidden = true;
        if (ingatlanObj.tipus === '1' || ingatlanObj.tipus === '2' || ingatlanObj.tipus === '3') {
            isHidden = false;
        }

        return isHidden;
    };

    const isAltipusHidden = () => {
        let isHidden = true;
        if (
            ingatlanObj.tipus === '2' ||
            ingatlanObj.tipus === '5' ||
            ingatlanObj.tipus === '8' ||
            ingatlanObj.tipus === '9' ||
            ingatlanObj.tipus === '10' ||
            ingatlanObj.tipus === '11' ||
            ingatlanObj.tipus === '12' ||
            ingatlanObj.tipus === '13'
        ) {
            isHidden = false;
        }

        return isHidden;
    };

    const isEtanusitvanyHidden = () => {
        let isHidden = true;
        if (
            ingatlanObj.tipus === '1' ||
            ingatlanObj.tipus === '2' ||
            ingatlanObj.tipus === '4' ||
            ingatlanObj.tipus === '5' ||
            ingatlanObj.tipus === '9' ||
            ingatlanObj.tipus === '11' ||
            ingatlanObj.tipus === '12'
        ) {
            isHidden = false;
        }

        return isHidden;
    };

    const sendMail = (ingatlanId, publikusChange, isNew) => {
        if (!hasRole(user.roles, ['SZUPER_ADMIN'])) {
            /* const { ingatlanok } = props; */
            let kuldObj = ingatlanObj;
            kuldObj.helyseg = helyseg;
            kuldObj.helyseg.telepules = telepulesObj;
            kuldObj.hirdeto = hirdeto;
            kuldObj.ar = arFormatter(kuldObj.ar);
            kuldObj.kaucio = kuldObj.kaucio !== '' ? arFormatter(kuldObj.kaucio) : '';
            /* const id = ingatlanId ? ingatlanId : Math.max(ingatlanok.map((i) => i.id)) + 1;
            console.log(id); */
            Services.jovahagyasraKuldes(ingatlanId, kuldObj.isAktiv, publikusChange, isNew, regiIngatlan, kuldObj, (err, res) => {
                if (!err) {
                    addNotification('success', res.msg);
                } else {
                    addNotification(
                        'error',
                        'Valami hiba történt a jóváhagyásra küldéskor! Kérjük Próbál meg újra a jóváhagyásr küldést a "Jóvágyásra küldés gombbal! Ha ez sem működik, kérlek érteítsd a rendszergazdát!" '
                    );
                }
            });
        }
    };

    const onSubmit = (e, isKuld) => {
        setLoading(true);
        let kuldObj = ingatlanObj;
        kuldObj.helyseg = helyseg;
        kuldObj.helyseg.telepules = telepulesObj;
        kuldObj.hirdeto = hirdeto;
        kuldObj.ar = arFormatter(kuldObj.ar);
        kuldObj.kaucio = kuldObj.kaucio !== '' ? arFormatter(kuldObj.kaucio) : '';

        let datas = {};

        if (!currentId) {
            datas = makeFormData(kuldObj, ['kepek', 'nempubcsatolmanyok'], false);
            Services.addIngatlan(datas, (err, res) => {
                if (!err) {
                    setLoading(false);
                    toggleModal();
                    listIngatlanok();
                    addNotification('success', res.msg);
                    /* if (isKuld) {
                        sendMail(res.ingatlanId, kuldObj.isAktiv, false, true, kuldObj);
                    } */
                } else {
                    setLoading(false);
                }
            });
        } else {
            datas = makeFormData(kuldObj, ['kepek', 'nempubcsatolmanyok'], true);
            Services.editIngatlan(datas, currentId, (err, res) => {
                if (!err) {
                    toggleModal();
                    listIngatlanok();
                    addNotification('success', res.msg);
                    setLoading(false);
                    if (isKuld) {
                        sendMail(currentId, false, false);
                    }
                } else {
                    setLoading(false);
                }
            });
        }
    };

    const renderKepekModal = () => {
        return (
            <Modal isOpen={kepekModal} toggle={toggleKepekModal} size="xl" className="fullscreen">
                <ModalHeader>{`Képek ${currentId ? ' módosítása' : 'felvitele'}`}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">
                            <h5>Képek</h5>
                        </div>
                        <hr />
                        <div className="col-md-12">
                            <RVFormGroup>
                                <MyDropzone multiple />
                            </RVFormGroup>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" onClick={toggleKepekModal}>
                        Ok
                    </Button>
                </ModalFooter>
            </Modal>
        );
    };

    const stepsArray = [
        {
            content: 1,
            leiras: 'Feladó adatok'
        },
        {
            content: 2,
            leiras: 'Hirdetés adatok'
        },
        {
            content: 3,
            leiras: 'Ingatlan adatok'
        }
    ];

    const getDate = (date) => {
        let result = '';

        if (date && date !== '') {
            result = moment(date).format('YYYY-MM-DD');
        }

        return result;
    };

    const MyDropzoneCsatolmanyok = () => {
        const onDrop = useCallback((acceptedFiles) => {
            const csatolmanyok = acceptedFiles.map((file, index) => {
                // Do whatever you want with the file contents
                let obj = {
                    id: index,
                    type: file.type,
                    filename: file.name,
                    title: file.name,
                    size: file.size,
                    src: URL.createObjectURL(file),
                    file: file
                };

                return obj;
            });

            setIngatlanObj({
                ...ingatlanObj,
                nempubcsatolmanyok: [...ingatlanObj.nempubcsatolmanyok, ...csatolmanyok]
            });
        }, []);
        const { getRootProps, getInputProps } = useDropzone({ onDrop });

        const csatolmanyokDivStyle = {
            display: 'grid',
            maxWidth: '100%',
            gridTemplateColumns: 'repeat(6, minmax(170px, 1fr))',
            rowGap: '30px'
        };

        return (
            <React.Fragment>
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Kattintson vagy húzza id a feltöltendő csatolmány(oka)t...</p>
                </div>

                <div style={csatolmanyokDivStyle}>
                    {ingatlanObj &&
                        ingatlanObj.nempubcsatolmanyok &&
                        ingatlanObj.nempubcsatolmanyok.length > 0 &&
                        ingatlanObj.nempubcsatolmanyok.map((csatolmany) => {
                            const filename = csatolmany.filename + '';
                            const ext = filename !== '' ? filename.slice(filename.lastIndexOf('.') + 1, filename.length) : undefined;
                            return (
                                ext && (
                                    <div key={csatolmany.filename} style={{ height: '170px', padding: '10px' }}>
                                        {csatolmany.type.includes('image') ? (
                                            <div style={{ height: '150px', position: 'relative' }}>
                                                <img className="upload_preview" src={csatolmany.src} alt={csatolmany.filename} />
                                                <div className="upload_data">
                                                    <span style={{ overflowWrap: 'break-word', textAlign: 'center' }}>{csatolmany.filename}</span>
                                                    <br />
                                                    <span style={{ textAlign: 'center' }}>{'Méret: ' + (csatolmany.size / 1024 / 1024).toFixed(2) + ' Mb'}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ height: '150px', position: 'relative' }}>
                                                <div className="upload_preview">{getCsatolmanyokIkon(csatolmany.filename, ext)}</div>
                                                <div className="upload_data">
                                                    <span style={{ overflowWrap: 'break-word', textAlign: 'center' }}>{csatolmany.filename}</span>
                                                    <br />
                                                    <span style={{ textAlign: 'center' }}>{'Méret: ' + (csatolmany.size / 1024 / 1024).toFixed(2) + ' Mb'}</span>
                                                </div>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            <div
                                                style={{
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    backgroundColor: '#22dd22',
                                                    color: 'white',
                                                    padding: '10px 0',
                                                    justifyContent: 'center',
                                                    minWidth: '50%',
                                                    maxWidth: '50%'
                                                    /* minHeight: '20px',
                                                maxHeight: '20px' */
                                                }}
                                                hidden={csatolmany.file}
                                                onClick={() => saveAs(csatolmany.src, csatolmany.filename)}
                                            >
                                                <i className="fa-solid fa-floppy-disk" />
                                            </div>
                                            <div
                                                style={{
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    backgroundColor: '#dd2222',
                                                    color: 'white',
                                                    padding: '10px 0',
                                                    justifyContent: 'center',
                                                    minWidth: csatolmany.file ? '100%' : '50%',
                                                    minWidth: csatolmany.file ? '100%' : '50%'
                                                    /* minHeight: '20px',
                                                maxHeight: '20px' */
                                                }}
                                                onClick={() => deleteFile(csatolmany.filename, 'nempubcsatolmanyok', currentId)}
                                            >
                                                <i className="fa-solid fa-trash-can" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            );
                        })}
                </div>
            </React.Fragment>
        );
    };
    //TODO: Egyéb (nem publikus) dokumentumok felvitelét megoldani!!!

    const getCsatolmanyokIkon = (filename, ext) => {
        if (ext === 'doc' || ext === 'docx' || ext === 'odt') {
            return <i key={filename + '_ext'} className="fas fa-file-word" style={{ color: '#0351d8' }} />;
        } else if (ext === 'pdf') {
            return <i key={filename + '_ext'} className="fa-solid fa-file-pdf" style={{ color: '#d82e03' }} />;
        } else if (ext === 'xls' || ext === 'xlsx' || ext === 'odf' || ext === 'ods') {
            return <i key={filename + '_ext'} className="fa-solid fa-file-excel" style={{ color: '#198104' }} />;
        } else if (ext === 'zip' || ext === 'rar') {
            return <i key={filename + '_ext'} className="fa-solid fa-file-zipper" />;
        } else {
            return '';
        }
    };

    const deleteFile = (filename, dir, id) => {
        Services.deleteFile(filename, dir, id, (err, res) => {
            if (!err) {
                addNotification('success', res.msg);
                const filtered = ingatlanObj.nempubcsatolmanyok.filter((n) => n.filename !== filename);
                setIngatlanObj({
                    ...ingatlanObj,
                    nempubcsatolmanyok: filtered
                });
            }
        });
    };

    return (
        <React.Fragment>
            <RVForm onSubmit={(e) => onSubmit(e, currentId ? true : false)} encType="multipart/form-data" noValidate={true}>
                <ModalHeader>{!currentId ? 'Ingatlan hirdetés felvitele' : 'Ingatlan hirdetés módosítása'}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-12">
                                    <Stepper className={'ingatlan_stepper'} step={step} setStep={setStep} stepsArray={stepsArray} />
                                </div>
                            </div>
                            <div className="row" hidden={step !== 1}>
                                <div className="col-md-12">
                                    <h5>Feladó adatok</h5>
                                </div>
                                <hr />
                                <div className="col-md-3">
                                    <RVFormGroup>
                                        <Label>{'Iroda: *'}</Label>
                                        <RVInput
                                            required
                                            disabled={formType === 'MOD'}
                                            type="select"
                                            name="office_id"
                                            id="office_id"
                                            value={ingatlanObj.office_id}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        >
                                            <option key="defaultOffice_id" value="">
                                                Kérjük válasszon típust...
                                            </option>
                                            {renderOptions('iroda')}
                                        </RVInput>
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-3">
                                    <RVFormGroup>
                                        <Label>{isRequired('Feladó neve:', true)}</Label>
                                        <RVInput required name="feladoNev" id="feladoNev" value={hirdeto.feladoNev} onChange={(e) => handleInputChange(e, hirdeto, setHirdeto)} />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-3">
                                    <RVFormGroup>
                                        <Label>{isRequired('Feladó e-mail címe:', true)}</Label>
                                        <RVInput required type="email" name="feladoEmail" id="feladoEmail" value={hirdeto.feladoEmail} onChange={(e) => handleInputChange(e, hirdeto, setHirdeto)} />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-3">
                                    <RVFormGroup>
                                        <Label>{isRequired('Feladó telefonszáma:', true)}</Label>
                                        <RVInput required name="feladoTelefon" id="feladoTelefon" value={hirdeto.feladoTelefon} onChange={(e) => handleInputChange(e, hirdeto, setHirdeto)} />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                            </div>
                            <div className="row" hidden={step !== 1}>
                                <div className="col-md-12">
                                    <h5>Ingatlan főbb adatai</h5>
                                </div>
                                <hr />
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Típus:', true)}</Label>
                                        <RVInput
                                            required
                                            disabled={formType === 'MOD'}
                                            type="select"
                                            name="tipus"
                                            id="tipus"
                                            value={ingatlanObj.tipus}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        >
                                            <option key="defaultTipus" value="">
                                                Kérjük válasszon típust...
                                            </option>
                                            {renderOptions('tipus')}
                                        </RVInput>
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4" hidden={isAltipusHidden()}>
                                    <RVFormGroup>
                                        <Label>{isRequired('Altipus:', !isAltipusHidden())}</Label>
                                        <RVInput
                                            required={!isAltipusHidden()}
                                            type="select"
                                            name="altipus"
                                            id="altipus"
                                            value={ingatlanObj.altipus}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        >
                                            <option key="defaultTipus" value="">
                                                Kérjük válasszon altípust...
                                            </option>
                                            {renderAltipusOptions()}
                                        </RVInput>
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Státusz:', true)}</Label>
                                        <RVInput required type="select" name="statusz" id="statusz" value={ingatlanObj.statusz} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                            <option key="defaultStatusz" value="">
                                                Kérjük válasszon státuszt...
                                            </option>
                                            {renderOptions('statusz')}
                                        </RVInput>
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4" hidden={IsAllapotFieldHidden()}>
                                    <RVFormGroup>
                                        <Label>{isRequired('Állapot:', !IsAllapotFieldHidden())}</Label>
                                        <RVInput
                                            required={!IsAllapotFieldHidden()}
                                            type="select"
                                            name="allapot"
                                            id="allapot"
                                            value={ingatlanObj.allapot}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        >
                                            <option key="defaultAllapot" value="">
                                                Kérjük válasszon állapotot...
                                            </option>
                                            {renderOptions('allapot')}
                                        </RVInput>
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4" hidden={isRendeltetesHidden()}>
                                    <RVFormGroup>
                                        <Label>{isRequired('Rendeltetés:', !isRendeltetesHidden())}</Label>
                                        <RVInput
                                            required={!isRendeltetesHidden()}
                                            type="select"
                                            name="rendeltetes"
                                            id="rendeltetes"
                                            value={ingatlanObj.rendeltetes}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        >
                                            <option key="defaultRendeltetes" value="">
                                                Kérjük válasszon rendeltetést...
                                            </option>
                                            {renderOptions('rendeltetes')}
                                        </RVInput>
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                            </div>
                            <div className="row" hidden={step !== 2}>
                                <div className="col-md-12">
                                    <h5>Hirdetés adatok</h5>
                                </div>
                                <hr />
                                <div className="col-md-12">
                                    <RVFormGroup>
                                        <Label>{isRequired('Ingatlan hirdetés címe:', true)}</Label>
                                        <RVInput required name="cim" id="cim" min={12} max={70} value={ingatlanObj.cim} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-12">
                                    <RVFormGroup>
                                        <Label>{isRequired('Leírás:', true)}</Label>
                                        <RVInput
                                            required
                                            // maxLength={1700}
                                            type="textarea"
                                            rows="7"
                                            name="leiras"
                                            id="leiras"
                                            value={ingatlanObj.leiras}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Ország:', true)}</Label>
                                        <RVInput required type="select" name="orszag" id="orszag" value={helyseg.orszag.id} onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}>
                                            {!currentId && (
                                                <option key="defaultOrszag" value="">
                                                    Kérjük válasszon országot...
                                                </option>
                                            )}
                                            {renderOrszagokOptions()}
                                        </RVInput>
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Irányítószám:', true)}</Label>
                                        <RVInput required name="irszam" id="irszam" pattern="[0-9]+" value={helyseg.irszam} onChange={(e) => handleInputChange(e, helyseg, setHelyseg)} />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Település:', true)}</Label>
                                        <Select
                                            type="select"
                                            name="telepules"
                                            id="telepules"
                                            options={telepulesekOpts}
                                            value={telepulesekOpts.length === 1 ? telepulesekOpts[0] : ''}
                                            isClearable
                                            required
                                            placeholder="Válasszon települést..."
                                            isDisabled={helyseg.irszam === '' || helyseg.irszam.length < 4}
                                            onChange={(e) => {
                                                handleTelepulesChange(e);
                                                if (e) {
                                                    setTelepulesObj({ ...telepulesObj, telepulesnev: e.value });
                                                    setHelyseg({
                                                        ...helyseg,
                                                        telepules: {
                                                            irszam: helyseg.irszam,
                                                            telepulesnev: e
                                                        }
                                                    });
                                                }
                                            }}
                                        />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>
                                            {isRequired(
                                                'Utca:',
                                                ingatlanObj.tipus === '1' ||
                                                    ingatlanObj.tipus === '2' ||
                                                    ingatlanObj.tipus === '4' ||
                                                    ingatlanObj.tipus === '5' ||
                                                    ingatlanObj.tipus === '7' ||
                                                    ingatlanObj.tipus === '8' ||
                                                    ingatlanObj.tipus === '9' ||
                                                    ingatlanObj.tipus === '11' ||
                                                    ingatlanObj.tipus === '12'
                                            )}
                                        </Label>
                                        <RVInput
                                            name="utca"
                                            id="utca"
                                            required={
                                                ingatlanObj.tipus === '1' ||
                                                ingatlanObj.tipus === '2' ||
                                                ingatlanObj.tipus === '4' ||
                                                ingatlanObj.tipus === '5' ||
                                                ingatlanObj.tipus === '7' ||
                                                ingatlanObj.tipus === '8' ||
                                                ingatlanObj.tipus === '9' ||
                                                ingatlanObj.tipus === '11' ||
                                                ingatlanObj.tipus === '12'
                                            }
                                            value={helyseg.utca}
                                            onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
                                        />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>
                                            {isRequired(
                                                'Házszám:',
                                                ingatlanObj.tipus === '1' ||
                                                    ingatlanObj.tipus === '2' ||
                                                    ingatlanObj.tipus === '4' ||
                                                    ingatlanObj.tipus === '5' ||
                                                    ingatlanObj.tipus === '7' ||
                                                    ingatlanObj.tipus === '8' ||
                                                    ingatlanObj.tipus === '9' ||
                                                    ingatlanObj.tipus === '11' ||
                                                    ingatlanObj.tipus === '12'
                                            )}
                                        </Label>
                                        <RVInput
                                            name="hazszam"
                                            id="hazszam"
                                            required={
                                                ingatlanObj.tipus === '1' ||
                                                ingatlanObj.tipus === '2' ||
                                                ingatlanObj.tipus === '4' ||
                                                ingatlanObj.tipus === '5' ||
                                                ingatlanObj.tipus === '7' ||
                                                ingatlanObj.tipus === '8' ||
                                                ingatlanObj.tipus === '9' ||
                                                ingatlanObj.tipus === '11' ||
                                                ingatlanObj.tipus === '12'
                                            }
                                            value={helyseg.hazszam}
                                            onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
                                        />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>HRSZ:</Label>
                                        <RVInput name="hrsz" id="hrsz" value={helyseg.hrsz} onChange={(e) => handleInputChange(e, helyseg, setHelyseg)} />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                            </div>
                            <div className="row" hidden={step !== 2}>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Ár:', true)}</Label>
                                        <RVInput
                                            required
                                            name="ar"
                                            id="ar"
                                            value={arFormatter(ingatlanObj.ar)}
                                            onChange={(e) => {
                                                setIngatlanObj({
                                                    ...ingatlanObj,
                                                    ar: arFormatter(e.target.value)
                                                });
                                            }}
                                        />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4" hidden={ingatlanObj.statusz !== 'Kiadó'}>
                                    <RVFormGroup>
                                        <Label>{isRequired('Kaució:', ingatlanObj.statusz === 'Kiadó')}</Label>
                                        <RVInput
                                            required={ingatlanObj.statusz === 'Kiadó'}
                                            /*  pattern="([0-9]*[.])?[0-9]+" */
                                            name="kaucio"
                                            id="kaucio"
                                            value={arFormatter(ingatlanObj.kaucio)}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Pénznem:', true)}</Label>
                                        <RVInput required type="select" name="penznem" id="penznem" value={ingatlanObj.penznem} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                            <option key="defaultPenznem" value="">
                                                Kérjük válasszon pénznemet...
                                            </option>
                                            {renderOptions('penznem')}
                                        </RVInput>
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                            </div>
                            <div className="row mb-2" hidden={step !== 2}>
                                <div className="col-md-12">
                                    <h5>Nem publikus adatok:</h5>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Jutalék:', false)}</Label>
                                        <RVInputGroup>
                                            <RVInput type="text" name="jutalek" id="jutalek" value={ingatlanObj.jutalek} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                                            <RVInputGroupText>%</RVInputGroupText>
                                        </RVInputGroup>
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Megbízás kelte:', false)}</Label>
                                        <RVInput
                                            type="date"
                                            name="megbizaskelte"
                                            id="megbizaskelte"
                                            value={getDate(ingatlanObj.megbizaskelte)}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Megbízás vége:', false)}</Label>
                                        <RVInput
                                            type="date"
                                            name="megbizasvege"
                                            id="megbizasvege"
                                            value={getDate(ingatlanObj.megbizasvege)}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                            </div>
                            <div className="row mb-2" hidden={step !== 2}>
                                <div className="col-md-12">
                                    <RVFormGroup>
                                        <Label>{isRequired('Megjegyzés:', false)}</Label>
                                        <RVInput
                                            type="textarea"
                                            rows={5}
                                            name="nempubmegjegyzes"
                                            id="nempubmegjegyzes"
                                            value={ingatlanObj.nempubmegjegyzes}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        />
                                    </RVFormGroup>
                                </div>
                            </div>
                            <div className="row" style={{ marginBottom: '30px' }} hidden={step !== 2}>
                                <div className="col-md-12">
                                    <RVFormGroup>
                                        <Label>{isRequired('Csatolmányok:', false)}</Label>
                                        <MyDropzoneCsatolmanyok multiple />
                                    </RVFormGroup>
                                </div>
                            </div>
                            <div className="row" hidden={step !== 2}>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>Hirdethető</Label>
                                        &nbsp;&nbsp;
                                        <RVInput
                                            type="checkbox"
                                            name="isHirdetheto"
                                            id="isHirdetheto"
                                            checked={ingatlanObj.isHirdetheto}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>Kiemelt</Label>
                                        &nbsp;&nbsp;
                                        <RVInput type="checkbox" name="isKiemelt" id="isKiemelt" checked={ingatlanObj.isKiemelt} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>Erkély</Label>
                                        &nbsp;&nbsp;
                                        <RVInput type="checkbox" name="isErkely" id="isErkely" checked={ingatlanObj.isErkely} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-3">
                                    <RVFormGroup>
                                        <Label>Lift</Label>
                                        &nbsp;&nbsp;
                                        <RVInput type="checkbox" name="isLift" id="isLift" checked={ingatlanObj.isLift} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-3">
                                    <RVFormGroup>
                                        <Label>Tetőtér</Label>
                                        &nbsp;&nbsp;
                                        <RVInput type="checkbox" name="isTetoter" id="isTetoter" checked={ingatlanObj.isTetoter} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-3">
                                    <RVFormGroup>
                                        <Label>Új építés</Label>
                                        &nbsp;&nbsp;
                                        <RVInput
                                            type="checkbox"
                                            name="isUjEpitesu"
                                            id="isUjEpitesu"
                                            checked={ingatlanObj.isUjEpitesu}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        />
                                    </RVFormGroup>
                                </div>
                                {/* TODO: Email küldés nem megy localhost tls miatt VISSZATENNI A COMMENTELT RÉSZT!!!! (MYHOME-17) */}
                                <div className="col-md-3" hidden={!hasRole(user.roles, ['SZUPER_ADMIN'])}>
                                    {/*     <div className="col-md-3"> */}
                                    <RVFormGroup>
                                        <Label>Publikus</Label>
                                        &nbsp;&nbsp;
                                        <RVInput type="checkbox" name="isAktiv" id="isAktiv" checked={ingatlanObj.isAktiv} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                                    </RVFormGroup>
                                </div>
                            </div>
                            <div className="row" hidden={step !== 3}>
                                <div className="col-md-12">
                                    <h5>Ingatlan adatok</h5>
                                </div>
                                <hr />
                                <div className="col-md-4" hidden={isEmeletHidden()}>
                                    <RVFormGroup>
                                        <Label>{isRequired('Emelet:', !isEmeletHidden())}</Label>
                                        <RVInput
                                            required={!isEmeletHidden()}
                                            type="select"
                                            name="emelet"
                                            id="emelet"
                                            value={ingatlanObj.emelet}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        >
                                            <option key="defaultEmelet" value="">
                                                Kérjük válasszon emeletet...
                                            </option>
                                            {renderOptions('emelet')}
                                        </RVInput>
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Szobaszám:', false)}</Label>
                                        <RVInput pattern="[0-9]+" name="szobaszam" id="szobaszam" value={ingatlanObj.szobaszam} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Félszoba száma:', false)}</Label>
                                        <RVInput
                                            pattern="[0-9]+"
                                            name="felszobaszam"
                                            id="felszobaszam"
                                            value={ingatlanObj.felszobaszam}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        />
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Alapterület:', !isIngatlanAdatokHidden())}</Label>
                                        <RVInputGroup>
                                            <RVInput
                                                required={!isIngatlanAdatokHidden()}
                                                pattern="[0-9]+"
                                                name="alapterulet"
                                                id="alapterulet"
                                                value={ingatlanObj.alapterulet}
                                                onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                            />
                                            <RVInputGroupText>
                                                m <sup>2</sup>
                                            </RVInputGroupText>
                                        </RVInputGroup>
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <Label>{isRequired('Építés módja:', !isIngatlanAdatokHidden())}</Label>
                                    <RVInput
                                        required={!isIngatlanAdatokHidden()}
                                        type="select"
                                        name="epitesmod"
                                        id="epitesmod"
                                        value={ingatlanObj.epitesmod}
                                        onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                    >
                                        <option key="defaultEpitesmod" value="">
                                            Kérjük válasszon építési módot...
                                        </option>
                                        {renderOptions('epitesmod')}
                                    </RVInput>
                                </div>
                                <div className="col-md-4">
                                    <Label>{isRequired('Fűtés:', !isIngatlanAdatokHidden())}</Label>
                                    <RVInput
                                        required={!isIngatlanAdatokHidden()}
                                        type="select"
                                        name="futes"
                                        id="futes"
                                        value={ingatlanObj.futes}
                                        onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                    >
                                        <option key="defaultFutes" value="">
                                            Kérjük válasszon fűtési módot...
                                        </option>
                                        {renderOptions('futesmod')}
                                    </RVInput>
                                </div>
                                <div className="col-md-12" />
                                <div className="col-md-4 mt-2">
                                    <RVFormGroup>
                                        <Label>{isRequired('Gáz fogyasztás: (éves)', !isEtanusitvanyHidden())}</Label>
                                        <RVInputGroup>
                                            <RVInput pattern="[0-9]+" name="gazfogy" id="gazfogy" value={ingatlanObj.gazfogy} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                                            <RVInputGroupText>
                                                m <sup>3</sup>
                                            </RVInputGroupText>
                                        </RVInputGroup>
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4 mt-2">
                                    <RVFormGroup>
                                        <Label>{isRequired('Villany fogyasztás: (éves)', !isEtanusitvanyHidden())}</Label>
                                        <RVInputGroup>
                                            <RVInput
                                                pattern="[0-9]+"
                                                name="villanyfogy"
                                                id="villanyfogy"
                                                value={ingatlanObj.villanyfogy}
                                                onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                            />
                                            <RVInputGroupText>
                                                m <sup>3</sup>
                                            </RVInputGroupText>
                                        </RVInputGroup>
                                        <RVFormFeedback />
                                    </RVFormGroup>
                                </div>
                            </div>
                            <div className="row" hidden={isTelekAdatokHidden() || step !== 3}>
                                <div className="col-md-12">
                                    <h5>Telek tulajdonságok</h5>
                                </div>
                                <hr />
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Telek tipus:', !isTelekAdatokHidden())}</Label>
                                        <RVInput
                                            required={!isTelekAdatokHidden()}
                                            type="select"
                                            name="telektipus"
                                            id="telektipus"
                                            value={ingatlanObj.telektipus}
                                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                        >
                                            <option key="defaultTelektipus" value="">
                                                Kérjük válasszon telektípust...
                                            </option>
                                            {renderOptions('telektipus')}
                                        </RVInput>
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Telek mérete:', !isTelekAdatokHidden())}</Label>
                                        <RVInputGroup>
                                            <RVInput
                                                required={!isTelekAdatokHidden()}
                                                pattern="[0-9]+"
                                                name="telek"
                                                id="telek"
                                                value={ingatlanObj.telek}
                                                onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                            />
                                            <RVInputGroupText>
                                                m <sup>2</sup>
                                            </RVInputGroupText>
                                        </RVInputGroup>
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-4">
                                    <RVFormGroup>
                                        <Label>{isRequired('Beépíthetőség:', false)}</Label>
                                        <RVInputGroup>
                                            <RVInput
                                                pattern="[0-9]+"
                                                name="beepithetoseg"
                                                id="beepithetoseg"
                                                value={ingatlanObj.beepithetoseg}
                                                onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                            />
                                            <RVInputGroupText>%</RVInputGroupText>
                                        </RVInputGroup>
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-3">
                                    <RVFormGroup>
                                        <Label>{isRequired('Víz:', false)}</Label>
                                        <RVInput type="select" name="viz" id="viz" value={ingatlanObj.viz} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                            <option key="defaultViz" value="">
                                                Kérjük válasszon...
                                            </option>
                                            {renderOptions('viz')}
                                        </RVInput>
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-3">
                                    <RVFormGroup>
                                        <Label>{isRequired('Gáz:', false)}</Label>
                                        <RVInput type="select" name="gaz" id="gaz" value={ingatlanObj.gaz} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                            <option key="defaultGaz" value="">
                                                Kérjük válasszon...
                                            </option>
                                            {renderOptions('gaz')}
                                        </RVInput>
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-3">
                                    <RVFormGroup>
                                        <Label>{isRequired('Villany:', false)}</Label>
                                        <RVInput type="select" name="villany" id="villany" value={ingatlanObj.villany} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                            <option key="defaultVillany" value="">
                                                Kérjük válasszon...
                                            </option>
                                            {renderOptions('villany')}
                                        </RVInput>
                                    </RVFormGroup>
                                </div>
                                <div className="col-md-3">
                                    <RVFormGroup>
                                        <Label>{isRequired('Szennyvíz:', false)}</Label>
                                        <RVInput type="select" name="szennyviz" id="szennyviz" value={ingatlanObj.szennyviz} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                            <option key="defaultSzennyviz" value="">
                                                Kérjük válasszon...
                                            </option>
                                            {renderOptions('szennyviz')}
                                        </RVInput>
                                    </RVFormGroup>
                                </div>
                                {renderKepekModal()}
                            </div>
                        </div>
                    </div>
                </ModalBody>
                {step === maxStep && (
                    <ModalFooter>
                        <Button type="button" color="success" onClick={toggleKepekModal}>{`Képek ${!currentId ? ' felvitele' : ' módosítása'}`}</Button>
                        <Button type="submit" color="primary" disabled={loading}>
                            {'Mentés'}
                        </Button>
                        {!hasRole(user.roles, ['SZUPER_ADMIN']) && (
                            <React.Fragment>
                                {currentId && (
                                    <Button type="button" color="primary" onClick={() => sendMail(currentId, true, false)} disabled={loading || ingatlanObj.kepek.length === 0}>
                                        Engedélyeztetés
                                    </Button>
                                )}
                            </React.Fragment>
                        )}
                        <Button type="button" color="dark" onClick={toggleModal}>
                            Mégsem
                        </Button>
                    </ModalFooter>
                )}
            </RVForm>
            <ModalFooter hidden={step === maxStep}>
                <Button hidden={step === 1} color={'primary'} onClick={() => setStep(step - 1)} type={'button'}>
                    {'Vissza'}
                </Button>
                <Button color={'primary'} onClick={() => setStep(step + 1)} type={'button'}>
                    {'Tovább'}
                </Button>
                <Button type="button" onClick={toggleModal}>
                    Mégsem
                </Button>
            </ModalFooter>
        </React.Fragment>
    );
};

export default IngatlanForm;
