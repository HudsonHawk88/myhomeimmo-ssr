import React, { useState, useEffect, useCallback } from 'react';
import { Button, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import { RVForm, RVFormGroup, RVInput, RVInputGroup, RVFormFeedback, RVInputGroupText } from '@inftechsol/reactstrap-form-validation';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import { handleInputChange } from '../../../commons/InputHandlers.js';
import { arFormatter, makeFormData } from '../../../commons/Lib.js';
import KepCard from '../../../commons/KepCard.js';
import Services from './Services.js';

const IngatlanForm = (props) => {
    const { user, listIngatlanok, currentId, formType, ertekesito, toggleModal, nevFormatter, telefonFormatter, addNotification } = props;

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
        /* gazfogyaszt: null,
        villanyfogyazt: null,
        etanusitvany: '', */
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
    const [hirdeto, setHirdeto] = useState(defaultFelado);
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
        Services.getIngatlan(id).then((res) => {
            if (!res.err) {
                res[0].tipus = res[0].tipus + '';
                setIngatlanObj(res[0]);
                setHirdeto(res[0].hirdeto);
                delete ingatlanObj.helyseg;
                delete ingatlanObj.hirdeto;
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

    useEffect(() => {
        if (user && formType === 'FEL') {
            getErtekesito();
        }
    }, [user, ertekesito, formType]);

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
                    <p>Kattintson vagy h??zza id a felt??ltend?? k??peket...</p>
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

    const onSubmit = (e) => {
        /*    e.preventDefault(); */
        let kuldObj = ingatlanObj;
        kuldObj.helyseg = helyseg;
        kuldObj.helyseg.telepules = telepulesObj;
        kuldObj.hirdeto = hirdeto;
        kuldObj.ar = arFormatter(kuldObj.ar);
        kuldObj.kaucio = kuldObj.kaucio !== '' ? arFormatter(kuldObj.kaucio) : '';
        /* console.log(telepulesObj, kuldObj, helyseg); */
        /* if (kuldObj.helyseg.telepules.id) {
            kuldObj.telepules = kuldObj.helyseg.telepules.telepulesnev;
        } else {
            telepulesek.map((telepules) => {
                if (telepules.id.toString() === helyseg.telepules) {
                    kuldObj.telepules = telepules.telepulesnev;
                    kuldObj.helyseg.telepules = telepules;
                }
            });
        } */

        /* kuldObj.feladoNev = felado.feladoNev;
        kuldObj.feladoEmail = felado.feladoEmail;
        kuldObj.feladoTelefon = felado.feladoTelefon;
        kuldObj.feladoAvatar = felado.feladoAvatar;
        kuldObj.isErtekesito = user.isErtekesito; */
        let datas = {};

        // datas.append('kepek', kuldObj.kepek);
        if (!currentId) {
            /*   for (var key in kuldObj) {
                if (key === 'kepek' || key === 'feladoAvatar' || key === 'helyseg' || key === 'hirdeto') {
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
            } */
            datas = makeFormData(kuldObj, 'kepek', false);
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
            /*  for (var key in kuldObj) {
                if (key === 'kepek' || key === 'feladoAvatar' || key === 'helyseg' || key === 'hirdeto') {
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
            } */

            datas = makeFormData(kuldObj, 'kepek', true);
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

    //TODO: Egy??b (nem publikus) dokumentumok felvitel??t megoldani!!!

    return (
        <RVForm onSubmit={onSubmit} encType="multipart/form-data" noValidate={true}>
            <ModalHeader>{!currentId ? 'Ingatlan hirdet??s felvitele' : 'Ingatlan hirdet??s m??dos??t??sa'}</ModalHeader>
            <ModalBody>
                <div className="row">
                    <div className="col-md-12">
                        <h5>Felad?? adatok</h5>
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
                                    K??rj??k v??lasszon t??pust...
                                </option>
                                {renderOptions('iroda')}
                            </RVInput>
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>{isRequired('Felad?? neve:', true)}</Label>
                            <RVInput required name="feladoNev" id="feladoNev" value={hirdeto.feladoNev} onChange={(e) => handleInputChange(e, hirdeto, setHirdeto)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>{isRequired('Felad?? e-mail c??me:', true)}</Label>
                            <RVInput required type="email" name="feladoEmail" id="feladoEmail" value={hirdeto.feladoEmail} onChange={(e) => handleInputChange(e, hirdeto, setHirdeto)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>{isRequired('Felad?? telefonsz??ma:', true)}</Label>
                            <RVInput required name="feladoTelefon" id="feladoTelefon" value={hirdeto.feladoTelefon} onChange={(e) => handleInputChange(e, hirdeto, setHirdeto)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h5>Ingatlan f??bb adatai</h5>
                    </div>
                    <hr />
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>{isRequired('T??pus:', true)}</Label>
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
                                    K??rj??k v??lasszon t??pust...
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
                                    K??rj??k v??lasszon alt??pust...
                                </option>
                                {renderAltipusOptions()}
                            </RVInput>
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>{isRequired('St??tusz:', true)}</Label>
                            <RVInput required type="select" name="statusz" id="statusz" value={ingatlanObj.statusz} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                <option key="defaultStatusz" value="">
                                    K??rj??k v??lasszon st??tuszt...
                                </option>
                                {renderOptions('statusz')}
                            </RVInput>
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4" hidden={IsAllapotFieldHidden()}>
                        <RVFormGroup>
                            <Label>{isRequired('??llapot:', !IsAllapotFieldHidden())}</Label>
                            <RVInput
                                required={!IsAllapotFieldHidden()}
                                type="select"
                                name="allapot"
                                id="allapot"
                                value={ingatlanObj.allapot}
                                onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                            >
                                <option key="defaultAllapot" value="">
                                    K??rj??k v??lasszon ??llapotot...
                                </option>
                                {renderOptions('allapot')}
                            </RVInput>
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4" hidden={isRendeltetesHidden()}>
                        <RVFormGroup>
                            <Label>{isRequired('Rendeltet??s:', !isRendeltetesHidden())}</Label>
                            <RVInput
                                required={!isRendeltetesHidden()}
                                type="select"
                                name="rendeltetes"
                                id="rendeltetes"
                                value={ingatlanObj.rendeltetes}
                                onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                            >
                                <option key="defaultRendeltetes" value="">
                                    K??rj??k v??lasszon rendeltet??st...
                                </option>
                                {renderOptions('rendeltetes')}
                            </RVInput>
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h5>Hirdet??s adatok</h5>
                    </div>
                    <hr />
                    <div className="col-md-12">
                        <RVFormGroup>
                            <Label>{isRequired('Ingatlan hirdet??s c??me:', true)}</Label>
                            <RVInput required name="cim" id="cim" min={12} max={70} value={ingatlanObj.cim} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-12">
                        <RVFormGroup>
                            <Label>{isRequired('Le??r??s:', true)}</Label>
                            <RVInput required type="textarea" rows="7" name="leiras" id="leiras" value={ingatlanObj.leiras} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>{isRequired('Orsz??g:', true)}</Label>
                            <RVInput required type="select" name="orszag" id="orszag" value={helyseg.orszag.id} onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}>
                                {!currentId && (
                                    <option key="defaultOrszag" value="">
                                        K??rj??k v??lasszon orsz??got...
                                    </option>
                                )}
                                {renderOrszagokOptions()}
                            </RVInput>
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>{isRequired('Ir??ny??t??sz??m:', true)}</Label>
                            <RVInput required name="irszam" id="irszam" pattern="[0-9]+" value={helyseg.irszam} onChange={(e) => handleInputChange(e, helyseg, setHelyseg)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>{isRequired('Telep??l??s:', true)}</Label>
                            <Select
                                type="select"
                                name="telepules"
                                id="telepules"
                                options={telepulesekOpts}
                                value={telepulesekOpts.length === 1 ? telepulesekOpts[0] : ''}
                                isClearable
                                required
                                placeholder="V??lasszon telep??l??st..."
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
                    <div className="col-md-3">
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
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>{isRequired('??r:', true)}</Label>
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
                    <div className="col-md-4" hidden={ingatlanObj.statusz !== 'Kiad??'}>
                        <RVFormGroup>
                            <Label>{isRequired('Kauci??:', ingatlanObj.statusz === 'Kiad??')}</Label>
                            <RVInput
                                required={ingatlanObj.statusz === 'Kiad??'}
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
                            <Label>{isRequired('P??nznem:', true)}</Label>
                            <RVInput required type="select" name="penznem" id="penznem" value={ingatlanObj.penznem} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                <option key="defaultPenznem" value="">
                                    K??rj??k v??lasszon p??nznemet...
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
                            <Label>Hirdethet??</Label>
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
                            <Label>Erk??ly</Label>
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
                            <Label>Tet??t??r</Label>
                            &nbsp;&nbsp;
                            <RVInput type="checkbox" name="isTetoter" id="isTetoter" checked={ingatlanObj.isTetoter} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>??j ??p??t??s</Label>
                            &nbsp;&nbsp;
                            <RVInput type="checkbox" name="isUjEpitesu" id="isUjEpitesu" checked={ingatlanObj.isUjEpitesu} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>Publikus</Label>
                            &nbsp;&nbsp;
                            <RVInput type="checkbox" name="isAktiv" id="isAktiv" checked={ingatlanObj.isAktiv} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                        </RVFormGroup>
                    </div>
                </div>
                <div className="row" hidden={isIngatlanAdatokHidden()}>
                    <div className="col-md-12">
                        <h5>Ingatlan tulajdons??gok</h5>
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
                                    K??rj??k v??lasszon emeletet...
                                </option>
                                {renderOptions('emelet')}
                            </RVInput>
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>{isRequired('Szobasz??m:', false)}</Label>
                            <RVInput pattern="[0-9]+" name="szobaszam" id="szobaszam" value={ingatlanObj.szobaszam} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>{isRequired('F??lszoba sz??ma:', false)}</Label>
                            <RVInput pattern="[0-9]+" name="felszobaszam" id="felszobaszam" value={ingatlanObj.felszobaszam} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>{isRequired('Alapter??let:', !isIngatlanAdatokHidden())}</Label>
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
                        <Label>{isRequired('??p??t??s m??dja:', !isIngatlanAdatokHidden())}</Label>
                        <RVInput
                            required={!isIngatlanAdatokHidden()}
                            type="select"
                            name="epitesmod"
                            id="epitesmod"
                            value={ingatlanObj.epitesmod}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key="defaultEpitesmod" value="">
                                K??rj??k v??lasszon ??p??t??si m??dot...
                            </option>
                            {renderOptions('epitesmod')}
                        </RVInput>
                    </div>
                    <div className="col-md-4">
                        <Label>{isRequired('F??t??s:', !isIngatlanAdatokHidden())}</Label>
                        <RVInput
                            required={!isIngatlanAdatokHidden()}
                            type="select"
                            name="futes"
                            id="futes"
                            value={ingatlanObj.futes}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key="defaultFutes" value="">
                                K??rj??k v??lasszon f??t??si m??dot...
                            </option>
                            {renderOptions('futesmod')}
                        </RVInput>
                    </div>
                    {/*   <div className="col-md-12" />
                    <div className="col-md-4 mt-2">
                        <RVFormGroup>
                            <Label>{isRequired('G??z fogyaszt??s:', !isEtanusitvanyHidden())}</Label>
                            <RVInputGroup>
                                <RVInput pattern="[0-9]+" name="gazfogyaszt" id="gazfogyaszt" value={ingatlanObj.gazfogyaszt} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)} />
                                <RVInputGroupText>
                                    m <sup>3</sup>
                                </RVInputGroupText>
                            </RVInputGroup>
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4 mt-2">
                        <RVFormGroup>
                            <Label>{isRequired('Villany fogyaszt??s:', !isEtanusitvanyHidden())}</Label>
                            <RVInputGroup>
                                <RVInput
                                    pattern="[0-9]+"
                                    name="villanyfogyaszt"
                                    id="villanyfogyaszt"
                                    value={ingatlanObj.villanyfogyaszt}
                                    onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                />
                                <RVInputGroupText>
                                    m <sup>3</sup>
                                </RVInputGroupText>
                            </RVInputGroup>
                            <RVFormFeedback />
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4 mt-2">
                        <Label>{'Energiatanus??tv??ny:'}</Label>
                        <RVInput disabled type="select" name="etanusitvany" id="etanusitvany" value={ingatlanObj.etanusitvany} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                            <option key="defaultEtanusitvany" value="">
                                K??rj??k irja be a fogyaszt??si adatokat...
                            </option>
                            {renderOptions('etanusitvany')}
                        </RVInput>
                    </div> */}
                </div>
                <div className="row" hidden={isTelekAdatokHidden()}>
                    <div className="col-md-12">
                        <h5>Telek tulajdons??gok</h5>
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
                                    K??rj??k v??lasszon telekt??pust...
                                </option>
                                {renderOptions('telektipus')}
                            </RVInput>
                        </RVFormGroup>
                    </div>
                    <div className="col-md-4">
                        <RVFormGroup>
                            <Label>{isRequired('Telek m??rete:', !isTelekAdatokHidden())}</Label>
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
                            <Label>{isRequired('Be??p??thet??s??g:', false)}</Label>
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
                            <Label>{isRequired('V??z:', false)}</Label>
                            <RVInput type="select" name="viz" id="viz" value={ingatlanObj.viz} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                <option key="defaultViz" value="">
                                    K??rj??k v??lasszon...
                                </option>
                                {renderOptions('viz')}
                            </RVInput>
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>{isRequired('G??z:', false)}</Label>
                            <RVInput type="select" name="gaz" id="gaz" value={ingatlanObj.gaz} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                <option key="defaultGaz" value="">
                                    K??rj??k v??lasszon...
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
                                    K??rj??k v??lasszon...
                                </option>
                                {renderOptions('villany')}
                            </RVInput>
                        </RVFormGroup>
                    </div>
                    <div className="col-md-3">
                        <RVFormGroup>
                            <Label>{isRequired('Szennyv??z:', false)}</Label>
                            <RVInput type="select" name="szennyviz" id="szennyviz" value={ingatlanObj.szennyviz} onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}>
                                <option key="defaultSzennyviz" value="">
                                    K??rj??k v??lasszon...
                                </option>
                                {renderOptions('szennyviz')}
                            </RVInput>
                        </RVFormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h5>K??pek</h5>
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
                    Ment??s
                </Button>
                <Button type="button" color="dark" onClick={toggleModal}>
                    M??gsem
                </Button>
            </ModalFooter>
        </RVForm>
    );
};

export default IngatlanForm;
