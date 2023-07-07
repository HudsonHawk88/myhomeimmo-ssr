import React, { useState, useEffect, useCallback } from 'react';
import { Button, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { RVFormGroup, RVInput, RVInputGroup, RVFormFeedback, RVInputGroupText } from '@inftechsol/reactstrap-form-validation';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select/creatable';
import PropTypes from 'prop-types';

import Stepper from '../../../commons/Stepper';
import KepCard from '../../../commons/KepCard';
import Services from './Services';

const ProjektekForm = (props) => {
    const {
        addNotification,
        user,
        defaultProjekt,
        init,
        isRequired,
        currentId,
        getProjekt,
        handleInputChange,
        handleTelepulesChange,
        handleBeruhazoTelepulesChange,
        handleEpuletszintekChange,
        object,
        setObject,
        helyseg,
        orszagok,
        setHelyseg,
        beruhazo,
        setBeruhazo,
        beruhazoHelyseg,
        setBeruhazoHelyseg,
        telepulesObj,
        setTelepulesObj,
        beruhazoTelepulesObj,
        setBeruhazoTelepulesObj,
        formType,
        telepulesekOpts,
        setTelepulesekOpts,
        beruhazoTelepulesekOpts,
        setBeruhazoTelepulesekOpts,
        epuletszintekOpts,
        setEpuletSzintekOpts,
        setHirdeto,
        ertekesito,
        nevFormatter,
        telefonFormatter,
        renderEgyebOptions
    } = props;

    const [kepekModal, setKepekModal] = useState(false);
    const [step, setStep] = useState(1);
    const maxStep = 3;

    const toggleKepekModal = () => {
        setKepekModal(!kepekModal);
    };

    const MyDropzoneBorito = () => {
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

            setObject({
                ...object,
                borito: [...object.borito, ...kepek]
            });
        }, []);
        const { getRootProps, getInputProps } = useDropzone({ accept: 'image/*', onDrop });

        return (
            <React.Fragment>
                <div {...getRootProps({ className: 'dropzone' })} hidden={object.borito.length === 1}>
                    <input {...getInputProps()} />
                    <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
                </div>
                <KepCard services={Services} list={object} property="borito" setList={setObject} {...props} />
            </React.Fragment>
        );
    };

    const MyDropzoneProjekt = () => {
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

            setObject({
                ...object,
                projektlakaskepek: [...object.projektlakaskepek, ...kepek]
            });
        }, []);

        const { getRootProps, getInputProps } = useDropzone({ accept: 'image/*', onDrop });

        return (
            <React.Fragment>
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
                </div>
                <KepCard services={Services} list={object} property="projektlakaskepek" setList={setObject} {...props} />
            </React.Fragment>
        );
    };

    useEffect(() => {
        init();
        if (formType === 'FEL' && !currentId) {
            setObject(defaultProjekt);
            setHelyseg({
                ...helyseg,
                irszam: '',
                telepules: ''
            });
            setBeruhazoHelyseg({
                ...beruhazoHelyseg,
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
            getProjekt(currentId);
        }
    }, [currentId, formType]);

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

    const isIrszamTyped = () => {
        if (helyseg.irszam && helyseg.irszam.length === 4) {
            return true;
        } else {
            return false;
        }
    };

    const isBeruhazoIrszamTyped = () => {
        if (beruhazoHelyseg.irszam && beruhazoHelyseg.irszam.length === 4) {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        if (isIrszamTyped()) {
            getTelepulesByIrsz(helyseg.irszam);
        }
    }, [isIrszamTyped(), helyseg.irszam]);

    useEffect(() => {
        if (isBeruhazoIrszamTyped()) {
            getBeruhazoTelepulesByIrsz(beruhazoHelyseg.irszam);
        }
    }, [isBeruhazoIrszamTyped(), beruhazoHelyseg.irszam]);

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
                    if (helyseg.telepules.telepulesnev === '' || helyseg.telepules.telepulesnev === '') {
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

    const getBeruhazoTelepulesByIrsz = (irsz) => {
        Services.getTelepulesByIrsz(irsz, (err, res) => {
            if (!err) {
                if (res.length === 1) {
                    setBeruhazoTelepulesObj({
                        ...beruhazoTelepulesObj,
                        telepulesnev: res[0].telepulesnev,
                        irszam: res[0].irszam
                    });
                    getBeruhazoTelepulesekOpts(res);
                } else {
                    setBeruhazoTelepulesObj({
                        ...beruhazoTelepulesObj,
                        telepulesnev: beruhazoHelyseg.telepules.telepulesnev,
                        irszam: irsz
                    });
                    if (beruhazoHelyseg.telepules.telepulesnev === '') {
                        getBeruhazoTelepulesekOpts(res);
                    } else {
                        setBeruhazoTelepulesekOpts([
                            {
                                label: beruhazoHelyseg.telepules.telepulesnev,
                                value: beruhazoHelyseg.telepules.telepulesnev,
                                irszam: beruhazoHelyseg.telepules.irszam
                            }
                        ]);
                    }
                }
            }
        });
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

    const isActiveStep = (stepNumber) => {
        let result = true;

        if (stepNumber === step) {
            result = false;
        }

        return result;
    };

    const renderForm = () => {
        const stepsArray = [
            {
                content: 1,
                leiras: 'Beruházó adatok'
            },
            {
                content: 2,
                leiras: 'Projekt adatok 1'
            },
            {
                content: 3,
                leiras: 'Projekt adatok 2'
            },
            /*   {
                content: 4,
                leiras: 'Projekt adatok 3'
            }, */
            {
                content: 4,
                leiras: 'Projekt képek'
            }
        ];
        return (
            <div className="row">
                <Stepper step={step} setStep={setStep} stepsArray={stepsArray} />
                <div hidden={step !== 1}>
                    <h4>Beruházó adatok:</h4>
                    <br />
                    <div className="row mb-2">
                        <div className="col-md-12">
                            <Label>Beruházó neve:</Label>
                            <RVInput type="text" name="nev" id="nev" onChange={(e) => handleInputChange(e, beruhazo, setBeruhazo)} value={beruhazo.nev} />
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-12">
                            <Label>Beruházó rövid bemutatkozása:</Label>
                            <RVInput type="text" name="bemutat" id="bemutat" onChange={(e) => handleInputChange(e, beruhazo, setBeruhazo)} value={beruhazo.bemutat} />
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-3">
                            <RVFormGroup>
                                <Label>{isRequired('Beruházó ország:', true)}</Label>
                                <RVInput type="select" name="orszag" id="orszag" value={beruhazoHelyseg.orszag.id} onChange={(e) => handleInputChange(e, beruhazoHelyseg, setBeruhazoHelyseg)}>
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
                                <Label>{isRequired('Beruházó irányítószám:', true)}</Label>
                                <RVInput name="irszam" id="irszam" pattern="[0-9]+" value={beruhazoHelyseg.irszam} onChange={(e) => handleInputChange(e, beruhazoHelyseg, setBeruhazoHelyseg)} />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-3">
                            <RVFormGroup>
                                <Label>{isRequired('Beruházó település:', true)}</Label>
                                <Select
                                    type="select"
                                    name="telepules"
                                    id="telepules"
                                    options={beruhazoTelepulesekOpts}
                                    value={beruhazoTelepulesekOpts.length === 1 ? beruhazoTelepulesekOpts[0] : ''}
                                    isClearable
                                    required
                                    placeholder="Válasszon települést..."
                                    isDisabled={beruhazoHelyseg.irszam === '' || beruhazoHelyseg.irszam.length < 4}
                                    onChange={(e) => {
                                        handleBeruhazoTelepulesChange(e);
                                        if (e) {
                                            setBeruhazoTelepulesObj({ ...beruhazoTelepulesObj, telepulesnev: e.value });
                                            setBeruhazoHelyseg({
                                                ...beruhazoHelyseg,
                                                telepules: {
                                                    irszam: beruhazoHelyseg.irszam,
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
                                <Label>{isRequired('Beruházó címadatai:', true)}</Label>
                                <RVInput
                                    name="cimadatok"
                                    id="cimadatok"
                                    value={beruhazoHelyseg.cimadatok}
                                    onChange={(e) => handleInputChange(e, beruhazoHelyseg, setBeruhazoHelyseg)}
                                    placeholder="Valamilyen utca 8."
                                />
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Beruházó telefonszáma:', true)}</Label>
                                <RVInput
                                    name="telefon"
                                    id="telefon"
                                    pattern="[0-9]+"
                                    value={beruhazo.telefon}
                                    onChange={(e) => handleInputChange(e, beruhazo, setBeruhazo)}
                                    placeholder="+36-30/123-4567"
                                />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Beruházó e-mail címe:', true)}</Label>
                                <RVInput name="email" id="email" value={beruhazo.email} onChange={(e) => handleInputChange(e, beruhazo, setBeruhazo)} placeholder="valaki@valami.hu" />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Beruházó weboldala:', true)}</Label>
                                <RVInput name="weboldal" id="weboldal" value={beruhazo.weboldal} onChange={(e) => handleInputChange(e, beruhazo, setBeruhazo)} placeholder="www.valami.hu" />
                            </RVFormGroup>
                        </div>
                    </div>
                </div>
                <div hidden={step !== 2}>
                    <h4>Projekt adatok:</h4>
                    <br />
                    <div className="row mb-2">
                        <div className="col-md-12">
                            <Label>Projekt neve:</Label>
                            <RVInput type="text" name="nev" id="nev" onChange={(e) => handleInputChange(e, object, setObject)} value={object.nev} required />
                            <RVFormFeedback />
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-12">
                            <Label>Projekt leírása:</Label>
                            <RVInput type="textarea" rows="7" name="leiras" id="leiras" onChange={(e) => handleInputChange(e, object, setObject)} value={object.leiras} required />
                            <RVFormFeedback />
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6">
                            <Label>Ütem:</Label>
                            <RVInput type="text" name="utem" id="utem" pattern="[0-9]+" onChange={(e) => handleInputChange(e, object, setObject)} value={object.utem} />
                        </div>
                        <div className="col-md-6">
                            <Label>Szlogen:</Label>
                            <RVInput type="text" name="szlogen" id="szlogen" onChange={(e) => handleInputChange(e, object, setObject)} value={object.szlogen} />
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6">
                            <Label>Felirat:</Label>
                            <RVInput type="text" name="felirat" id="felirat" onChange={(e) => handleInputChange(e, object, setObject)} value={object.felirat} />
                        </div>
                        <div className="col-md-6">
                            <Label>Bemutató videó URL:</Label>
                            <RVInput type="text" name="bemutatvideo" id="bemutatvideo" onChange={(e) => handleInputChange(e, object, setObject)} value={object.bemutatvideo} />
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-3">
                            <RVFormGroup>
                                <Label>{isRequired('Projekt ország:', true)}</Label>
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
                                <Label>{isRequired('Projekt irányítószám:', true)}</Label>
                                <RVInput name="irszam" id="irszam" pattern="[0-9]+" value={helyseg.irszam} onChange={(e) => handleInputChange(e, helyseg, setHelyseg)} />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-3">
                            <RVFormGroup>
                                <Label>{isRequired('Projekt település:', true)}</Label>
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
                        <div className="col-md-3">
                            <RVFormGroup>
                                <Label>{isRequired('Projekt címadatai:', true)}</Label>
                                <RVInput name="cimadatok" id="cimadatok" value={helyseg.cimadatok} onChange={(e) => handleInputChange(e, helyseg, setHelyseg)} placeholder="Valamilyen utca 8." />
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                    </div>
                </div>
                <div hidden={step !== 3}>
                    <div className="row mb-2">
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Átadás éve:', true)}</Label>
                                <RVInput name="atadasev" id="atadasev" value={object.atadasev} onChange={(e) => handleInputChange(e, object, setObject)} required />
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Átadás negyedéve:', true)}</Label>
                                <RVInput name="atadasnegyedev" id="atadasnegyedev" value={object.atadasnegyedev} onChange={(e) => handleInputChange(e, object, setObject)} required />
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Átadás hónapja:', true)}</Label>
                                <RVInput name="atadashonap" id="atadashonap" value={object.atadashonap} onChange={(e) => handleInputChange(e, object, setObject)} />
                            </RVFormGroup>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Lakások száma:', true)}</Label>
                                <RVInput name="osszlakasszam" id="osszlakasszam" value={object.osszlakasszam} onChange={(e) => handleInputChange(e, object, setObject)} required />
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Szabad lakások száma:', true)}</Label>
                                <RVInput name="szabadlakasszam" id="szabadlakasszam" value={object.szabadlakasszam} onChange={(e) => handleInputChange(e, object, setObject)} required />
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Ingatlan típusa:', true)}</Label>
                                <RVInput type="select" name="ingtipus" id="ingtipus" value={object.ingtipus} onChange={(e) => handleInputChange(e, object, setObject)} required>
                                    <option key="" value="">
                                        Kérjük válasszon típust...
                                    </option>
                                    {renderEgyebOptions('ingtipus')}
                                </RVInput>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Elsődleges fűtés típusa:', true)}</Label>
                                <RVInput type="select" name="elsodlegesfutes" id="elsodlegesfutes" value={object.elsodlegesfutes} onChange={(e) => handleInputChange(e, object, setObject)} required>
                                    <option key="" value="">
                                        Kérjük válasszon fűtéstípust...
                                    </option>
                                    {renderEgyebOptions('futestipus')}
                                </RVInput>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Másodlagos fűtés típusa:', true)}</Label>
                                <RVInput type="select" name="masodlagosfutes" id="masodlagosfutes" value={object.masodlagosfutes} onChange={(e) => handleInputChange(e, object, setObject)}>
                                    <option key="" value="">
                                        Kérjük válasszon fűtéstípust...
                                    </option>
                                    {renderEgyebOptions('futestipus')}
                                </RVInput>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Harmadlagos fűtés típusa:', true)}</Label>
                                <RVInput type="select" name="harmadlagosfutes" id="harmadlagosfutes" value={object.harmadlagosfutes} onChange={(e) => handleInputChange(e, object, setObject)}>
                                    <option key="" value="">
                                        Kérjük válasszon típust...
                                    </option>
                                    {renderEgyebOptions('futestipus')}
                                </RVInput>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Parkoló típusa:', true)}</Label>
                                <RVInput type="select" name="parkolotipus" id="parkolotipus" value={object.parkolotipus} onChange={(e) => handleInputChange(e, object, setObject)} required>
                                    <option key="" value="">
                                        Kérjük válasszon fűtéstípust...
                                    </option>
                                    {renderEgyebOptions('parkolotipus')}
                                </RVInput>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Parkoló használata:', true)}</Label>
                                <RVInput type="select" name="parkolohasznalat" id="parkolohasznalat" value={object.parkolohasznalat} onChange={(e) => handleInputChange(e, object, setObject)} required>
                                    <option key="" value="">
                                        Kérjük válasszon fűtéstípust...
                                    </option>
                                    {renderEgyebOptions('parkolohasznalat')}
                                </RVInput>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Parkolóhely ára:', true)}</Label>
                                <RVInput type="text" pattern="[0-9]+" name="parkoloarmill" id="parkoloarmill" value={object.parkoloarmill} onChange={(e) => handleInputChange(e, object, setObject)} />
                            </RVFormGroup>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Komfort:', true)}</Label>
                                <RVInput type="select" name="komfort" id="komfort" value={object.komfort} onChange={(e) => handleInputChange(e, object, setObject)} required>
                                    <option key="" value="">
                                        Kérjük válasszon komfortot...
                                    </option>
                                    {renderEgyebOptions('komfort')}
                                </RVInput>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Épület szintjei:', true)}</Label>
                                <Select
                                    type="select"
                                    name="epuletszintek"
                                    id="epuletszintek"
                                    options={epuletszintekOpts}
                                    value={epuletszintekOpts[0]}
                                    createOptionPosition="last"
                                    isClearable
                                    isSearchable
                                    isMulti
                                    required
                                    placeholder="Épületek szintjei..."
                                    /* isDisabled={helyseg.irszam === '' || helyseg.irszam.length < 4} */
                                    onChange={(e) => {
                                        handleEpuletszintekChange(e);
                                    }}
                                />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Energetikai besorolás:', true)}</Label>
                                <RVInput type="select" name="energetika" id="energetika" value={object.energetika} onChange={(e) => handleInputChange(e, object, setObject)} required>
                                    <option key="" value="">
                                        Kérjük válasszon E besorolást...
                                    </option>
                                    {renderEgyebOptions('ebesorolas')}
                                </RVInput>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                    </div>
                </div>
                <div>
                    <div hidden={step !== 4}>
                        <div className="row">
                            <div className="col-md-12">
                                <h5>Projekt borító</h5>
                            </div>
                            <hr />
                            <div className="col-md-12">
                                <RVFormGroup>
                                    <MyDropzoneBorito />
                                </RVFormGroup>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <h5>Projekt képek</h5>
                            </div>
                            <hr />
                            <div className="col-md-12">
                                <RVFormGroup>
                                    <MyDropzoneProjekt multiple />
                                </RVFormGroup>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderKepekModal = () => {
        return (
            <Modal isOpen={kepekModal} toggle={toggleKepekModal} size="xl" backdrop="static">
                <ModalHeader>{currentId ? 'Képek felvitele' : 'Képek módosítása'}</ModalHeader>
                <ModalBody>
                    <div>KÉPEK</div>
                </ModalBody>
                <ModalFooter>
                    <Button>OK</Button>
                </ModalFooter>
            </Modal>
        );
    };

    return (
        <React.Fragment>
            {renderForm()}
            {renderKepekModal()}
        </React.Fragment>
    );
};

ProjektekForm.propTypes = {};

export default ProjektekForm;
