import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Label } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { RVForm, RVFormGroup, RVInput, RVInputGroup, RVFormFeedback, RVInputGroupText } from '@inftechsol/reactstrap-form-validation';

import { handleInputChange } from '../../../commons/InputHandlers';
import { arFormatter } from '../../../commons/Lib.js';
import Services from './Services';

const KeresoForm = (props) => {
    const navigate = useNavigate();

    const defaultTelepulesObj = {
        telepulesnev: '',
        km: '0'
    };

    const defaultKeresoObj = {
        tipus: '',
        statusz: '',
        referenciaSzam: '',
        ar: '',
        penznem: 'Ft',
        alapterulet: '',
        szobaszam: '',
        telepules: defaultTelepulesObj
    };

    const [keresoObj, setKeresoObj] = useState(defaultKeresoObj);
    const [selectedTelepules, setSelectedTelepules] = useState([]);
    const [telepulesekOpts, setTelepulesekOpts] = useState([]);
    const [tipusOptions, setTipusOptions] = useState([]);
    const [statuszOptions, setStatuszOptions] = useState([]);
    const [penznemOptions, setPenznemOptions] = useState([]);

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
                setSelectedTelepules({ label: 'Zalaegerszeg', value: 'Zalaegerszeg' });
                setKeresoObj({ ...keresoObj, telepules: { telepulesnev: 'Zalaegerszeg', km: '0' } });
            } else {
                props.notification('error', res.msg);
            }
        });
    }, []);

    const getOptions = useCallback(() => {
        Services.getIngatlanOptions().then((res) => {
            if (!res.err) {
                res.forEach((item) => {
                    if (item.nev === 'tipus' || item.nev === 'statusz' || item.nev === 'penznem') {
                        if (item.nev === 'tipus') {
                            setTipusOptions(item.options);
                        } else if (item.nev === 'statusz') {
                            setStatuszOptions(item.options);
                        } else if (item.nev === 'penznem') {
                            setPenznemOptions(item.options);
                        }
                    }
                });
            }
        });
    }, []);

    /*     const listTelepulesek = () => {
        Services.listTelepulesek().then((res) => {
            if (!res.err) {
                setTelepulesek(res);
                getTelepulesekOpts(res);
            }
        });
    }; */

    /*     const isIrszamTyped = () => {
        if (keresoObj.irszam && keresoObj.irszam.length === 4) {
            return true;
        } else {
            return false;
        }
    }; */

    // useEffect(() => {

    // }, []);

    const getTelepulesek = () => {};

    /*     useEffect(() => {
        if (isIrszamTyped()) {
            getTelepulesekByIrsz(keresoObj.irszam);
        } else {
            listTelepulesek();
            getTelepulesekOpts(telepulesek);
            setTelepulesObj(defaultTelepulesObj);
        }
    }, [isIrszamTyped()]); */

    useEffect(() => {
        getTelepulesekOpts();
        getOptions();
    }, [getTelepulesekOpts, getOptions]);

    // const getTelepulesekOpts = () => {
    //     if (telepulesekOpts.length !== 0) {
    //         return telepulesekOpts.map((telepules) => {
    //         return (
    //             <option key={telepules.id} value={telepules.telepulesnev}>
    //                 {telepules.telepulesnev}
    //             </option>
    //         );
    //         });
    //     }
    // };

    const getOnlyFiltered = () => {
        let newKereso = {};
        const keys = Object.keys(keresoObj);

        keys.forEach((filter) => {
            if (keresoObj[filter] !== '') {
                if (filter === 'ar') {
                    let ar = keresoObj[filter] + '';
                    ar = ar.replace(/ /g, '');
                    newKereso['ar'] = ar;
                } else {
                    newKereso[filter] = keresoObj[filter];
                    /*    newKereso.telepules = telepulesObj; */
                }
            }
        });

        return newKereso;
    };

    const keres = () => {
        let keres = getOnlyFiltered();
        keres.telepules = JSON.stringify(keres.telepules);

        const queryParams = Object.keys(keres)
            .map((key) => key + '=' + keres[key])
            .join('&');
        navigate(`/ingatlanok?${queryParams}`);
    };

    const handleTelepulesChange = (e) => {
        if (e) {
            setSelectedTelepules(e);
            setKeresoObj({
                ...keresoObj,
                telepules: {
                    telepulesnev: e.value,
                    km: '0'
                }
            });
        } else {
            setSelectedTelepules(null);
            setKeresoObj({
                ...keresoObj,
                telepules: {
                    telepulesnev: '',
                    km: '0'
                }
            });
        }
    };

    const nullToString = (value) => {
        let v = null;
        if (value) {
            v = value;
        }
        return v;
    };

    return (
        <div className="row" style={{ padding: '20px' }}>
            <h4>Gyorskeres??</h4>
            <div className="row g-2">
                <div className="col-lg-6 col-md-12">
                    <Label>Ingatlan st??tusza:</Label>
                    <Input type="select" name="statusz" id="statusz" value={keresoObj.statusz} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
                        <option key="" value="">
                            K??rj??k v??lasszon st??tuszt...
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
                <div className="col-lg-6 col-md-12">
                    <Label>Ingatlan t??pusa:</Label>
                    <Input type="select" name="tipus" id="tipus" value={keresoObj.tipus} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}>
                        <option key="" value="">
                            K??rj??k v??lasszon t??pust...
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
            <div className="row g-2">
                <div className="col-lg-6 col-md-12">
                    <Label>Telep??l??s:</Label>
                    <Select
                        type="select"
                        name="telepulesnev"
                        id="telepulesnev"
                        options={telepulesekOpts}
                        value={selectedTelepules}
                        isClearable
                        placeholder="K??rj??k v??lasszon telep??l??st..."
                        onChange={handleTelepulesChange}
                    />
                </div>
                <div className="col-lg-6 col-md-12">
                    <Label>Referenciasz??m:</Label>
                    <Input type="text" name="referenciaSzam" id="referenciaSzam" value={keresoObj.referenciaSzam} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                </div>
            </div>
            <div className="row g-2">
                <div className="col-lg-6 col-md-6">
                    <Label>??r:</Label>
                    <RVInput
                        pattern="[0-9 ]+"
                        invalid={false}
                        name="ar"
                        id="ar"
                        value={keresoObj.ar}
                        onChange={(e) => {
                            setKeresoObj({
                                ...keresoObj,
                                ar: arFormatter(e.target.value)
                            });
                            /* handleInputChange(e, keresoObj, setKeresoObj);
                            arFormatter(e.target.value); */
                        }}
                    />
                </div>
                <div className="col-lg-6 col-md-6">
                    <RVFormGroup>
                        <Label>{'P??nznem:'}</Label>
                        <RVInput
                            type="select"
                            name="penznem"
                            id="penznem"
                            value={keresoObj.penznem}
                            onChange={(e) => {
                                handleInputChange(e, keresoObj, setKeresoObj);
                            }}
                        >
                            {/*  <option key="defaultP??nznem" value="">
                                        {'K??rj??k v??lasszon p??nznemet...'}
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
                <div className="col-lg-6 col-md-6">
                    <RVFormGroup>
                        <Label>{'Min. alapter??let:'}</Label>
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
                <div className="col-lg-6 col-md-6">
                    <Label>{'Szobaszam:'}</Label>
                    <RVInput pattern="[0-9]+" name="szobaszam" id="szobaszam" invalid={false} value={keresoObj.szobaszam} onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)} />
                </div>
            </div>
            <div className="row g-2">
                <div className="col-md-12">
                    <Button color="success" onClick={() => keres()}>
                        <i className="fas fa-search"></i>&nbsp;&nbsp; Keres??s
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default KeresoForm;
