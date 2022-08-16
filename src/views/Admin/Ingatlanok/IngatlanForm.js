import React, { useState, useEffect, useCallback } from 'react';
import { Button, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import { RVForm, RVFormGroup, RVInput, RVInputGroup, RVFormFeedback, RVInputGroupText } from '@inftechsol/reactstrap-form-validation';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import { handleInputChange } from '../../../commons/InputHandlers';
import KepCard from './KepCard';
import Services from './Services';

const IngatlanForm = (props) => {
    const { user, listIngatlanok, currentId, formType, ertekesito, toggleModal, nevFormatter, telefonFormatter, addNotification } = props;

    const penznemek = [
        {
            penznemid: '0',
            penznem: 'HUF',
            penznemText: 'Ft'
        },
        {
            penznemid: '1',
            penznem: 'EUR',
            penznemText: 'Euro'
        }
    ];

    const defaultTelepulesObj = {
        telepulesnev: '',
        irszam: ''
    };

    const defaultObj = {
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
        szobaszam: '',
        felszobaszam: '',
        epitesmod: '',
        futes: '',
        isHirdetheto: false,
        isKiemelt: false,
        isErkely: false,
        isLift: false,
        isAktiv: false,
        isUjEpitesu: false
    };

    const defaultHelyseg = {
        orszag: '',
        irszam: '',
        telepules: defaultTelepulesObj,
        utca: ''
    };

    const defaultFelado = {
        feladoNev: '',
        feladoTelefon: '',
        feladoEmail: '',
        feladoAvatar: []
    };

    const [ingatlanObj, setIngatlanObj] = useState(defaultObj);
    const [helyseg, setHelyseg] = useState(defaultHelyseg);
    const [felado, setFelado] = useState(defaultFelado);
    const [orszagok, setOrszagok] = useState([]);
    const [telepulesek, setTelepulesek] = useState([]);
    const [telepulesekOpts, setTelepulesekOpts] = useState([]);
    const [telepulesObj, setTelepulesObj] = useState(defaultTelepulesObj);
    const [ingatlanOptions, setIngatlanOptions] = useState([]);
    const [altipusOptions, setAltipusOptions] = useState([]);

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
        Services.listOrszagok().then((res) => {
            if (!res.err) {
                setOrszagok(res);
                setDefault(res);
            }
        });
    };

    const listTelepulesek = () => {
        Services.listTelepulesek().then((res) => {
            if (!res.err) {
                setTelepulesek(res);
            }
        });
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
                        telepulesnev: helyseg.telepules.telepulesnev,
                        irszam: irsz
                    });
                    if (helyseg.telepules.telepulesnev === '') {
                        getTelepulesekOpts(res);
                    } else {
                        setTelepulesekOpts([{ label: helyseg.telepules.telepulesnev, value: helyseg.telepules.telepulesnev, irszam: helyseg.telepules.irszam }]);
                    }
                }
            }
        });
    };

    const getIngatlan = (id) => {
        Services.getIngatlan(id).then((res) => {
            if (!res.err) {
                setIngatlanObj(res[0]);
                delete ingatlanObj.helyseg;
                setHelyseg(res[0].helyseg);
            }
        });
    };

    const getOptions = () => {
        Services.getIngatlanOptions().then((res) => {
            if (!res.err) {
                setIngatlanOptions(res);
            }
        });
        Services.getAltipusOptions().then((res) => {
            if (!res.err) {
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
                setFelado({
                    feladoNev: nevFormatter(user.nev),
                    feladoTelefon: telefonFormatter(user.telefon),
                    feladoEmail: user.email,
                    feladoAvatar: user.avatar
                });
            } else {
                setFelado({
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
            setFelado({
                feladoNev: nevFormatter(user.nev),
                feladoTelefon: telefonFormatter(user.telefon),
                feladoEmail: user.email,
                feladoAvatar: user.avatar
            });
        } else {
            if (ertekesito) {
                setFelado({
                    feladoNev: nevFormatter(ertekesito.nev),
                    feladoTelefon: telefonFormatter(ertekesito.telefon),
                    feladoEmail: ertekesito.email,
                    feladoAvatar: ertekesito.avatar
                });
            }
        }
    };

    useEffect(() => {
        if (user) {
            getErtekesito();
        }
    }, [user, ertekesito]);

    const MyDropzone = () => {
        const onDrop = useCallback((acceptedFiles) => {
            const kepek = acceptedFiles.map((file) => {
                // Do whatever you want with the file contents
                let obj = {
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

        const { getRootProps, getInputProps } = useDropzone({ onDrop });

        return (
            <React.Fragment>
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
                </div>
                <KepCard list={ingatlanObj} property="kepek" setList={setIngatlanObj} {...props} />
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
                utca: ''
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

    const renderPenznemOptions = () => {
        if (penznemek && penznemek.length !== 0) {
            return penznemek.map((penznem) => {
                return (
                    <option key={penznem.penznemid + 'penznem'} value={penznem.penznemText}>
                        {penznem.penznemText}
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
                    {opt.nev}
                </option>
            );
        });
    };

    const renderAltipusOptions = () => {
        const altipus = altipusOptions.find((altyp) => altyp.tipus_id === parseInt(ingatlanObj.tipus, 10) || altyp.tipus_id === ingatlanObj.tipus);
        console.log(altipus);
        return (
            altipus &&
            altipus.options &&
            altipus.options.map((item) => {
                return (
                    <option key={item.id} value={item.value}>
                        {item.value}
                    </option>
                );
            })
        );
    };

    const IsAllapotFieldHidden = () => {
        let isHidden = true;
        if (ingatlanObj) {
            if (ingatlanObj.tipus !== '' && ingatlanObj.tipus !== '3' && ingatlanObj.tipus !== '10' && ingatlanObj.tipus !== '13') {
                isHidden = false;
            }
        }
        return isHidden;
    };

    const isEmeletHidden = () => {
        let isHidden = true;
        if (ingatlanObj) {
            if (ingatlanObj.tipus === '1' || ingatlanObj.tipus === '4' || ingatlanObj.tipus === '12' || ingatlanObj.tipus === '5') {
                isHidden = false;
            }
        }

        return isHidden;
    };

    const isTelekAdatokHidden = () => {
        let isHidden = true;
        if (ingatlanObj) {
            console.log(typeof ingatlanObj.tipus);
            if (ingatlanObj.tipus === '2' || ingatlanObj.tipus === '3' || ingatlanObj.tipus === '6' || ingatlanObj.tipus === '13' || ingatlanObj.tipus === '10') {
                isHidden = false;
            }
        }

        return isHidden;
    };

    const isIngatlanAdatokHidden = () => {
        let isHidden = false;
        if (ingatlanObj) {
            if (ingatlanObj.tipus === '3' || ingatlanObj.tipus === '6' || ingatlanObj.tipus === '13' || ingatlanObj.tipus === '10') {
                isHidden = true;
            }
        }

        return isHidden;
    };

    const onSubmit = (e) => {
        console.log(ingatlanObj, helyseg);
        /*    e.preventDefault(); */
        console.log(kuldObj);
        let kuldObj = ingatlanObj;
        kuldObj.helyseg = helyseg;
        if (kuldObj.helyseg.telepules.id) {
            kuldObj.telepules = kuldObj.helyseg.telepules.telepulesnev;
        } else {
            telepulesek.map((telepules) => {
                if (telepules.id.toString() === helyseg.telepules) {
                    kuldObj.telepules = telepules.telepulesnev;
                    kuldObj.helyseg.telepules = telepules;
                }
            });
        }

        kuldObj.feladoNev = felado.feladoNev;
        kuldObj.feladoEmail = felado.feladoEmail;
        kuldObj.feladoTelefon = felado.feladoTelefon;
        kuldObj.feladoAvatar = felado.feladoAvatar;
        kuldObj.isErtekesito = user.isErtekesito;
        let datas = new FormData();

        // datas.append('kepek', kuldObj.kepek);
        if (!currentId) {
            for (var key in kuldObj) {
                if (key === 'kepek' || key === 'feladoAvatar' || key === 'helyseg') {
                    if (key === 'kepek') {
                        kuldObj.kepek.forEach((kep) => {
                            if (kep.file) {
                                datas.append('kepek', kep.file);
                            }
                        });
                    } else {
                        datas.append(key, JSON.stringify(kuldObj[key]));
                    }
                } else {
                    datas.append(key, kuldObj[key]);
                }
            }
            Services.addEIngatlan(datas).then((res) => {
                if (!res.err) {
                    toggleModal();
                    listIngatlanok();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
        } else {
            for (var key in kuldObj) {
                if (key === 'kepek' || key === 'feladoAvatar' || key === 'helyseg') {
                    if (key === 'kepek') {
                        kuldObj.kepek.forEach((kep) => {
                            if (kep.file) {
                                datas.append('uj_kepek', kep.file);
                            } else {
                                datas.append('kepek', JSON.stringify(kep));
                            }
                        });
                    } else {
                        datas.append(key, JSON.stringify(kuldObj[key]));
                    }
                } else {
                    datas.append(key, kuldObj[key]);
                }
            }
            Services.editIngatlan(datas, currentId).then((res) => {
                if (!res.err) {
                    toggleModal();
                    listIngatlanok();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
        }
    };

    return (
        <RVForm onSubmit={onSubmit} encType="multipart/form-data" noValidate={true}>
            <ModalHeader>{!currentId ? 'Ingatlan hirdetés felvitele' : 'Ingatlan hirdetés módosítása'}</ModalHeader>
            <ModalBody>
                <div className="row" hidden>
                    <div className="col-md-12">
                        <h5>Feladó adatok</h5>
                    </div>
                    <hr />
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Feladó neve: *</Label>
                            <RVInput name="feladoNev" id="feladoNev" value={felado.feladoNev} onChange={(e) => handleInputChange(e, felado, setFelado)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Feladó e-mail címe: *</Label>
                            <RVInput type="email" name="feladoEmail" id="feladoEmail" value={felado.feladoEmail} onChange={(e) => handleInputChange(e, felado, setFelado)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Feladó telefonszáma: *</Label>
                            <RVInput name="feladoTelefon" id="feladoTelefon" value={felado.feladoTelefon} onChange={(e) => handleInputChange(e, felado, setFelado)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h5>Ingatlan főbb adatai</h5>
                    </div>
                    <hr />
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Típus: *</Label>
                            <RVInput required type="select" name="tipus" id="tipus" value={ingatlanObj.tipus} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                <option key="defaultTipus" value="">
                                    Kérjük válasszon típust...
                                </option>
                                {renderOptions('tipus')}
                            </RVInput>
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4" hidden={ingatlanObj.tipus === '1' || ingatlanObj.tipus === '3' || ingatlanObj.tipus === '4' || ingatlanObj.tipus === ''}>
                        <RVFormGroup>
                            <Label>Altipus: *</Label>
                            <RVInput
                                required={ingatlanObj.tipus !== '1' && ingatlanObj.tipus !== '3' && ingatlanObj.tipus !== '4'}
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
                            <Label>Státusz: *</Label>
                            <RVInput required type="select" name="statusz" id="statusz" value={ingatlanObj.statusz} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                <option key="defaultStatusz" value="">
                                    Kérjük válasszon státuszt...
                                </option>
                                {renderOptions('statusz')}
                            </RVInput>
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-6" hidden={IsAllapotFieldHidden()}>
                        <RVFormGroup>
                            <Label>Állapot: *</Label>
                            <RVInput
                                required={ingatlanObj.tipus !== '3' && ingatlanObj.tipus !== '10' && ingatlanObj.tipus !== '13'}
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
                    <div className="col-md-6" hidden={ingatlanObj.tipus !== '2' && ingatlanObj.tipus !== '3'}>
                        <RVFormGroup>
                            <Label>Rendeltetés: *</Label>
                            {console.log(ingatlanObj.tipus === '2' || ingatlanObj.tipus === '3')}
                            <RVInput
                                /* required={ingatlanObj.tipus === '2' || ingatlanObj.tipus === '3'} */
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
                <div className="row">
                    <div className="col-md-12">
                        <h5>Hirdetés adatok</h5>
                    </div>
                    <hr />
                    <div className="col-md-12">
                        <RVFormGroup>
                            <Label>Ingatlan hirdetés címe: *</Label>
                            <RVInput name="cim" id="cim" value={ingatlanObj.cim} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-12">
                        <RVFormGroup>
                            <Label>Leírás: *</Label>
                            <RVInput type="textarea" rows="7" name="leiras" id="leiras" value={ingatlanObj.leiras} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>Ország: *</Label>
                            <RVInput type="select" name="orszag" id="orszag" value={helyseg.orszag.id} onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}>
                                {!currentId && (
                                    <option key="defaultOrszag" value="">
                                        Kérjük válasszon országot...
                                    </option>
                                )}
                                {renderOrszagokOptions()}
                            </RVInput>
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>Irányítószám: *</Label>
                            <RVInput name="irszam" id="irszam" pattern="[0-9]" value={helyseg.irszam} onChange={(e) => handleInputChange(e, helyseg, setHelyseg)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>Település: *</Label>
                            <Select
                                type="select"
                                name="telepules"
                                id="telepules"
                                options={telepulesekOpts}
                                value={telepulesekOpts.length === 1 ? telepulesekOpts[0] : ''}
                                isClearable
                                /* required */
                                placeholder="Válasszon települést..."
                                isDisabled={helyseg.irszam === '' || helyseg.irszam.length < 4}
                                onChange={(e) => {
                                    handleTelepulesChange(e);
                                    if (e) {
                                        setTelepulesObj({ ...telepulesObj, telepulesnev: e.value });
                                    }
                                }}
                            />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>Utca: *</Label>
                            <RVInput name="utca" id="utca" value={helyseg.utca} onChange={(e) => handleInputChange(e, helyseg, setHelyseg)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Ár: *</Label>
                            <RVInput pattern="[0-9]" name="ar" id="ar" value={ingatlanObj.ar} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4" hidden={ingatlanObj.statusz !== 'Kiadó'}>
                        <RVFormGroup>
                            <Label>Kaució: *</Label>
                            <RVInput
                                /*    required={ingatlanObj.statusz === 'Kiadó'} */
                                pattern="[0-9]"
                                name="kaucio"
                                id="kaucio"
                                value={ingatlanObj.kaucio}
                                onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                            />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Pénznem: *</Label>
                            <RVInput type="select" name="penznem" id="penznem" value={ingatlanObj.penznem} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                <option key="defaultPenznem" value="">
                                    Kérjük válasszon pénznemet...
                                </option>
                                {renderOptions('penznem')}
                            </RVInput>
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Hirdethető</Label>
                            &nbsp;&nbsp;
                            <RVInput type="checkbox" name="isHirdetheto" id="isHirdetheto" checked={ingatlanObj.isHirdetheto} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
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
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Lift</Label>
                            &nbsp;&nbsp;
                            <RVInput type="checkbox" name="isLift" id="isLift" checked={ingatlanObj.isLift} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Új építés</Label>
                            &nbsp;&nbsp;
                            <RVInput type="checkbox" name="isUjEpitesu" id="isUjEpitesu" checked={ingatlanObj.isUjEpitesu} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Publikus</Label>
                            &nbsp;&nbsp;
                            <RVInput type="checkbox" name="isAktiv" id="isAktiv" checked={ingatlanObj.isAktiv} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                        </RVFormGroup>
                    </div>
                </div>
                <div className="row" hidden={isIngatlanAdatokHidden()}>
                    <div className="col-md-12">
                        <h5>Ingatlan tulajdonságok</h5>
                    </div>
                    <hr />
                    <div className="col-md-4" hidden={isEmeletHidden()}>
                        <RVFormGroup>
                            <Label>Emelet: *</Label>
                            <RVInput name="emelet" id="emelet" value={ingatlanObj.emelet} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Szobaszám: *</Label>
                            <RVInput pattern="[0-9]" name="szobaszam" id="szobaszam" value={ingatlanObj.szobaszam} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Félszoba száma: *</Label>
                            <RVInput pattern="[0-9]" name="felszobaszam" id="felszobaszam" value={ingatlanObj.felszobaszam} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Alapterület: *</Label>
                            <RVInputGroup>
                                <RVInput
                                    /*    required={!isIngatlanAdatokHidden()} */
                                    pattern="[0-9]"
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
                        <Label>Építés módja: *</Label>
                        <RVInput
                            /*        required={!isIngatlanAdatokHidden()} */
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
                        <Label>Fűtés: *</Label>
                        <RVInput
                            /*  required={!isIngatlanAdatokHidden()} */
                            type="select"
                            name="futes"
                            id="futes"
                            value={ingatlanObj.futes}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key="defaultFutes" value="">
                                Kérjük válasszon építési fűtési módot...
                            </option>
                            {renderOptions('futesmod')}
                        </RVInput>
                    </div>
                </div>
                <div className="row" hidden={isTelekAdatokHidden()}>
                    <div className="col-md-12">
                        <h5>Telek tulajdonságok</h5>
                    </div>
                    <hr />
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Telek tipus: *</Label>
                            <RVInput
                                /*   required={!isTelekAdatokHidden()} */
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
                            <Label>Telek mérete: *</Label>
                            <RVInputGroup>
                                <RVInput
                                    /*   required={!isTelekAdatokHidden()} */
                                    pattern="[0-9]"
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
                            <Label>Beépíthetőség: (m2) *</Label>
                            <RVInput pattern="[0-9]" name="beepithetoseg" id="beepithetoseg" value={ingatlanObj.beepithetoseg} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Víz: *</Label>
                            <RVInput type="select" name="viz" id="viz" value={ingatlanObj.viz} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                <option key="defaultViz" value="">
                                    Kérjük válasszon...
                                </option>
                                {renderOptions('viz')}
                            </RVInput>
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Gáz: *</Label>
                            <RVInput type="select" name="gaz" id="gaz" value={ingatlanObj.gaz} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                <option key="defaultGaz" value="">
                                    Kérjük válasszon...
                                </option>
                                {renderOptions('gaz')}
                            </RVInput>
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>Villany: *</Label>
                            <RVInput type="select" name="villany" id="villany" value={ingatlanObj.villany} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                <option key="defaultVillany" value="">
                                    Kérjük válasszon...
                                </option>
                                {renderOptions('villany')}
                            </RVInput>
                        </RVFormGroup>
                    </div>
                </div>
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
                <Button type="submit" color="primary">
                    Mentés
                </Button>
                <Button type="button" color="dark" onClick={toggleModal}>
                    Mégsem
                </Button>
            </ModalFooter>
        </RVForm>
    );
};

export default IngatlanForm;
