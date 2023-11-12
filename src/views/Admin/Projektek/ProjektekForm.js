import React, { useState, useEffect, useCallback } from 'react';
import { Button, Label, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup } from 'reactstrap';
import { RVFormGroup, RVInput, RVInputGroup, RVFormFeedback, RVInputGroupText } from '@inftechsol/reactstrap-form-validation';
import { useDropzone } from 'react-dropzone';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import Moment from 'moment';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

import Stepper from '../../../commons/Stepper';
import KepCard from '../../../commons/KepCard';
import Services from './Services';
import moment from 'moment';

const ProjektekForm = ({
    addNotification,
    user,
    defaultProjekt,
    init,
    isRequired,
    currentId,
    getProjekt,
    telepulesek,
    handleInputChange,
    handleTelepulesChange,
    handleBeruhazoTelepulesChange,
    handleEpuletszintekChange,
    object,
    setObject,
    listTelepulesek,
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
    setDefaultValues,
    telepulesekOpts,
    setTelepulesekOpts,
    beruhazoTelepulesekOpts,
    setBeruhazoTelepulesekOpts,
    epuletszintekOpts,
    setHirdeto,
    ertekesito,
    nevFormatter,
    telefonFormatter,
    renderEgyebOptions,
    projektingatlanokOpts,
    handleProjektIngatlanokChange,
    step,
    setStep,
    setCurrentId,
    ...props
}) => {
    const [kepekModal, setKepekModal] = useState(false);
    const [ingatlanOptions, setIngatlanOptions] = useState([]);

    useEffect(() => {
        if (formType === 'FEL' && !currentId) {
            setDefaultValues();
        }
    }, []);

    const getOptions = () => {
        Services.getIngatlanOptions((err, res) => {
            if (!err) {
                setIngatlanOptions(res);
            }
        });
    };

    const getDate = (date) => {
        let result = '';

        if (date && date !== '') {
            result = moment(date).format('YYYY-MM-DD');
        }

        return result;
    };

    const toggleKepekModal = () => {
        setKepekModal(!kepekModal);
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
                const filtered = object.nempubcsatolmanyok.filter((n) => n.filename !== filename);
                setObject({
                    ...object,
                    nempubcsatolmanyok: filtered
                });
            }
        });
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

            setObject({
                ...object,
                nempubcsatolmanyok: [...object.nempubcsatolmanyok, ...csatolmanyok]
            });
        }, []);
        const { getRootProps, getInputProps } = useDropzone({ onDrop });

        const csatolmanyokDivStyle = {
            display: 'grid',
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
                    {object &&
                        object.nempubcsatolmanyok &&
                        object.nempubcsatolmanyok.length > 0 &&
                        object.nempubcsatolmanyok.map((csatolmany) => {
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
        } else {
            listTelepulesek();
        }
    }, [isIrszamTyped(), helyseg.irszam]);

    useEffect(() => {
        if (isBeruhazoIrszamTyped()) {
            getBeruhazoTelepulesByIrsz(beruhazoHelyseg.irszam);
        }
    }, [isBeruhazoIrszamTyped(), beruhazoHelyseg.irszam]);

    useEffect(() => {
        getOptions();
    }, []);

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

    const renderOrszagokOptions = (name) => {
        if (orszagok.length !== 0) {
            return orszagok.map((orszag) => {
                return (
                    <option key={orszag.id + name + '_orszag'} value={orszag.id}>
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
                <Stepper className={'projekt_stepper'} step={step} setStep={setStep} stepsArray={stepsArray} />
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
                                        <option key="defaultBeruhazoOrszag" value="">
                                            Kérjük válasszon országot...
                                        </option>
                                    )}
                                    {renderOrszagokOptions('beruhazo')}
                                </RVInput>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-3">
                            <RVFormGroup>
                                <Label>{isRequired('Beruházó irányítószám:', true)}</Label>
                                <RVInput
                                    required
                                    name="irszam"
                                    id="irszam"
                                    pattern="[0-9]+"
                                    value={beruhazoHelyseg.irszam}
                                    onChange={(e) => handleInputChange(e, beruhazoHelyseg, setBeruhazoHelyseg)}
                                />
                                <RVFormFeedback />
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
                                                    telepulesnev: e.value
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
                                    required
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
                                <RVInputGroup>
                                    <RVInputGroupText>+</RVInputGroupText>
                                    <RVInput
                                        required
                                        name="telefon"
                                        id="telefon"
                                        pattern="[0-9 ]+"
                                        value={beruhazo.telefon}
                                        onChange={(e) => handleInputChange(e, beruhazo, setBeruhazo)}
                                        placeholder="36 30 123 4567"
                                    />
                                </RVInputGroup>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Beruházó e-mail címe:', true)}</Label>
                                <RVInput required name="email" id="email" value={beruhazo.email} onChange={(e) => handleInputChange(e, beruhazo, setBeruhazo)} placeholder="valaki@valami.hu" />
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Beruházó weboldala:', true)}</Label>
                                <RVInput
                                    required
                                    name="weboldal"
                                    id="weboldal"
                                    value={beruhazo.weboldal}
                                    onChange={(e) => handleInputChange(e, beruhazo, setBeruhazo)}
                                    placeholder="http(s)://www.valami.hu"
                                />
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label style={{ marginRight: '10px' }}>{isRequired('Beruházó látható?:', true)}</Label>
                                <RVInput type="checkbox" name="beruhazoLathato" id="beruhazoLathato" checked={beruhazo.beruhazoLathato} onChange={(e) => handleInputChange(e, beruhazo, setBeruhazo)} />
                            </RVFormGroup>
                        </div>
                    </div>
                </div>
                <div hidden={step !== 2}>
                    <h4>Projekt adatok:</h4>
                    <br />
                    <div className="row mb-2">
                        <div className="col-md-12">
                            <Label>Projekt neve: *</Label>
                            <RVInput type="text" name="nev" id="nev" onChange={(e) => handleInputChange(e, object, setObject)} value={object.nev} required />
                            <RVFormFeedback />
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-12">
                            <Label>Projekt leírása: *</Label>
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
                                <RVInput required type="select" name="orszag" id="orszag" value={helyseg.orszag.id} onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}>
                                    {!currentId && (
                                        <option key="defaultProjektOrszag" value="">
                                            Kérjük válasszon országot...
                                        </option>
                                    )}
                                    {renderOrszagokOptions('projekt')}
                                </RVInput>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-3">
                            <RVFormGroup>
                                <Label>{isRequired('Projekt irányítószám:', true)}</Label>
                                <RVInput required name="irszam" id="irszam" pattern="[0-9]+" value={helyseg.irszam} onChange={(e) => handleInputChange(e, helyseg, setHelyseg)} />
                                <RVFormFeedback />
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
                                                    telepulesnev: e.value
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
                                <RVInput
                                    required
                                    name="cimadatok"
                                    id="cimadatok"
                                    value={helyseg.cimadatok}
                                    onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
                                    placeholder="Valamilyen utca 8."
                                />
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
                                <Label>{isRequired('Átadás negyedéve:')}</Label>
                                <RVInput name="atadasnegyedev" id="atadasnegyedev" value={object.atadasnegyedev} onChange={(e) => handleInputChange(e, object, setObject)} />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Átadás hónapja:')}</Label>
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
                        {/* <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Szabad lakások száma:', true)}</Label>
                                <RVInput name="szabadlakasszam" id="szabadlakasszam" value={object.szabadlakasszam} onChange={(e) => handleInputChange(e, object, setObject)} required />
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div> */}
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Ingatlan típusa:', true)}</Label>
                                <RVInput type="select" name="ingtipus" id="ingtipus" value={object.ingtipus} onChange={(e) => handleInputChange(e, object, setObject)} required>
                                    <option key="defaultPrpjektIngtipus" value="">
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
                                    <option key="defaultElsodlegesFutes" value="">
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
                                    <option key="defaultMasodlagosFutes" value="">
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
                                    <option key="defaultharmadlagosFutes" value="">
                                        Kérjük válasszon fűtéstípust...
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
                                    <option key="defaultParkoloTipus" value="">
                                        Kérjük válasszon parkolótipust...
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
                                    <option key="defaultParkoloHasznalat" value="">
                                        Kérjük válasszon parkolóhasználatot...
                                    </option>
                                    {renderEgyebOptions('parkolohasznalat')}
                                </RVInput>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4" hidden={object.parkolohasznalat === 'Benne van az árban'}>
                            <RVFormGroup>
                                <Label>{isRequired('Parkolóhely ára:', true)}</Label>
                                <RVInput
                                    required={object.parkolohasznalat !== 'Benne van az árban'}
                                    type="text"
                                    pattern="[0-9]+"
                                    name="parkoloarmill"
                                    id="parkoloarmill"
                                    value={object.parkoloarmill}
                                    onChange={(e) => handleInputChange(e, object, setObject)}
                                />
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Komfort:', true)}</Label>
                                <RVInput type="select" name="komfort" id="komfort" value={object.komfort} onChange={(e) => handleInputChange(e, object, setObject)} required>
                                    <option key="defaultKomfort" value="">
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
                                <CreatableSelect
                                    type="select"
                                    name="epuletszintek"
                                    id="epuletszintek"
                                    options={epuletszintekOpts}
                                    value={object.epuletszintek}
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
                                    <option key="defaultEBesorolas" value="">
                                        Kérjük válasszon E besorolást...
                                    </option>
                                    {renderEgyebOptions('ebesorolas')}
                                </RVInput>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Projekt ingatlanok:', false)}</Label>
                                <Select
                                    type="select"
                                    name="projektingatlanok"
                                    id="projektingatlanok"
                                    options={projektingatlanokOpts}
                                    value={object.projektingatlanok}
                                    isMulti
                                    isClearable
                                    isSearchable
                                    placeholder="Projekt ingatlanok..."
                                    /* isDisabled={helyseg.irszam === '' || helyseg.irszam.length < 4} */
                                    onChange={(e) => {
                                        handleProjektIngatlanokChange(e);
                                    }}
                                />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Ingatlanok pénzneme:', true)}</Label>
                                <RVInput required type="select" name="penznem" id="penznem" value={object.penznem} onChange={(e) => handleInputChange(e, object, setObject)}>
                                    <option key="defaultPenznem" value="">
                                        Kérjük válasszon pénznemet...
                                    </option>
                                    {renderOptions('penznem')}
                                </RVInput>
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4" />
                    </div>
                    <div className="row mb-2">
                        <h5>Nem publikus adatok:</h5>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Jutalék:', false)}</Label>
                                <RVInputGroup>
                                    <RVInput type="text" name="jutalek" id="jutalek" value={object.jutalek} onChange={(e) => handleInputChange(e, object, setObject)} />
                                    <RVInputGroupText>%</RVInputGroupText>
                                </RVInputGroup>
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Megbízás kelte:', false)}</Label>
                                <RVInput type="date" name="megbizaskelte" id="megbizaskelte" value={getDate(object.megbizaskelte)} onChange={(e) => handleInputChange(e, object, setObject)} />
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                        <div className="col-md-4">
                            <RVFormGroup>
                                <Label>{isRequired('Megbízás vége:', false)}</Label>
                                <RVInput type="date" name="megbizasvege" id="megbizasvege" value={getDate(object.megbizasvege)} onChange={(e) => handleInputChange(e, object, setObject)} />
                                <RVFormFeedback />
                            </RVFormGroup>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-12">
                            <RVFormGroup>
                                <Label>{isRequired('Megjegyzés:', false)}</Label>
                                <RVInput
                                    type="textarea"
                                    rows={5}
                                    name="nempubmegjegyzes"
                                    id="nempubmegjegyzes"
                                    value={object.nempubmegjegyzes}
                                    onChange={(e) => handleInputChange(e, object, setObject)}
                                />
                            </RVFormGroup>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-12">
                            <RVFormGroup>
                                <Label>{isRequired('Csatolmányok:', false)}</Label>
                                <MyDropzoneCsatolmanyok multiple />
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
