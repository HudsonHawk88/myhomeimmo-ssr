import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Card, CardTitle, CardBody, CardFooter, Form } from 'reactstrap';
import Select from 'react-select';
import { DataTable } from '@inftechsol/react-data-table';
import { useDropzone } from 'react-dropzone';

import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';
import { makeFormData } from '../../../commons/Lib';
import { RVForm, RVInput } from '@inftechsol/reactstrap-form-validation';

const AdminUsers = (props) => {
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
        postsfiok: '',
        epulet: '',
        emelet: '',
        ajto: ''
    };

    const defaultTelefon = {
        orszaghivo: '',
        korzet: '',
        telszam: ''
    };

    const defaultAdminUser = {
        email: '',
        username: '',
        password: '',
        avatar: [],
        roles: [],
        isErtekesito: false
    };

    const [orszagok, setOrszagok] = useState([]);
    const [telepulesek, setTelepulesek] = useState([]);
    const [adminusersJson, setAdminUsersJson] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [adminUser, setAdminUser] = useState(defaultAdminUser);
    const [nev, setNev] = useState(defaultNev);
    const [cim, setCim] = useState(defaultCim);
    const [telefon, setTelefon] = useState(defaultTelefon);
    const [currentId, setCurrentId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const { addNotification } = props;

    const listAdminUsers = () => {
        Services.listAdminUsers().then((res) => {
            if (!res.err) {
                setAdminUsersJson(res);
            } else {
                addNotification(res.err);
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

    const getOrszagok = () => {
        Services.listOrszagok().then((res) => {
            if (!res.err) {
                setOrszagok(res);
                setDefault(res);
            }
        });
    };

    const getTelepulesek = () => {
        Services.listTelepulesek().then((res) => {
            if (!res.err) {
                setTelepulesek(res);
            }
        });
    };

    const getTelepulesByIrsz = (irsz) => {
        Services.getTelepulesByIrsz(irsz).then((res) => {
            if (!res.err) {
                setCim({
                    ...cim,
                    telepules: res[0]
                });
            } else {
                addNotification('error', res.msg);
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

    const getRoles = () => {
        Services.getRoles().then((res) => {
            if (!res.err) {
                setRoleOptions(res);
            }
        });
    };

    const init = () => {
        getOrszagok();
        getTelepulesek();
        listAdminUsers();
        getRoles();
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

    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };

    const getAdminUser = (id) => {
        Services.getAdminUser(id).then((res) => {
            if (!res.err) {
                setNev(res.nev);
                setCim(res.cim);
                setTelefon(res.telefon);
                setAdminUser({
                    email: res.email,
                    username: res.username,
                    password: '',
                    roles: res.roles,
                    avatar: res.avatar !== 'undefined' ? res.avatar : [],
                    isErtekesito: res.isErtekesito
                });
            } else {
                addNotification(res.err);
            }
        });
    };

    const handleNewClick = () => {
        setCurrentId(null);
        setAdminUser(defaultAdminUser);
        setNev(defaultNev);
        setCim({
            ...cim,
            irszam: '',
            telepules: '',
            kozterulet: '',
            hazszam: '',
            hrsz: '',
            postsfiok: '',
            epulet: '',
            emelet: '',
            ajto: ''
        });
        setTelefon(defaultTelefon);
        toggleModal();
    };

    const handleEditClick = (id) => {
        setCurrentId(id);
        getAdminUser(id);
        toggleModal();
    };

    const onSave = (e) => {
        e.preventDefault();
        let user = adminUser;
        user.nev = nev;
        user.cim = cim;
        user.telefon = telefon;

        let datas = new FormData();

        if (!currentId) {
            datas = makeFormData(user, 'avatar', false);
            Services.addAdminUser(datas).then((res) => {
                if (!res.err) {
                    toggleModal();
                    listAdminUsers();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
            /*  for (var key in user) {
                if (key === 'avatar' || key === 'telefon' || key === 'cim' || key === 'nev' || key === 'roles' || key === 'password') {
                    if (key === 'avatar') {
                        // console.log(user.avatar);
                        user.avatar.forEach((kep) => {
                            if (kep.file) {
                                datas.append('avatar', kep.file);
                                // console.log(kep);
                            }
                        });
                    } else if (key === 'password') {
                        if (user[key] !== '') {
                            datas.append(key, user[key]);
                        }
                    } else {
                        datas.append(key, JSON.stringify(user[key]));
                    }
                } else {
                    datas.append(key, user[key]);
                }
            } */
        } else {
            datas = makeFormData(user, 'avatar', true);
            Services.editAdminUser(datas, currentId).then((res) => {
                if (!res.err) {
                    toggleModal();
                    listAdminUsers();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
            /*   for (var key in user) {
                if (key === 'avatar' || key === 'telefon' || key === 'cim' || key === 'nev' || key === 'roles' || key === 'password') {
                    if (key === 'avatar') {
                        // console.log(user.avatar);
                        user.avatar.forEach((kep) => {
                            if (kep.file) {
                                datas.append('uj_avatar', kep.file);
                                // console.log(kep);
                            } else {
                                datas.append('avatar', JSON.stringify(kep));
                            }
                        });
                    } else if (key === 'password') {
                        if (user[key] !== '') {
                            datas.append(key, user[key]);
                        }
                    } else {
                        datas.append(key, JSON.stringify(user[key]));
                    }
                } else {
                    datas.append(key, user[key]);
                }
            } */
        }

        /*    if (!currentId) {
            Services.addAdminUser(datas).then((res) => {
                if (!res.err) {
                    toggleModal();
                    listAdminUsers();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
        } else {
            Services.editAdminUser(datas, currentId).then((res) => {
                if (!res.err) {
                    toggleModal();
                    listAdminUsers();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
        } */
    };

    /*     const deleteImage = (src) => {
        let kepek = adminUser.avatar;
        let filtered = kepek.filter((kep) => kep.src !== src);
        setAdminUser({
            ...adminUser,
            avatar: filtered
        });
    };
 */
    const deleteImage = (filename) => {
        let kepek = adminUser.avatar;
        let filtered = kepek.filter((kep) => kep.filename !== filename);
        setAdminUser({
            ...adminUser,
            avatar: filtered
        });
        Services.deleteImage(filename, adminUser.id).then((res) => {
            if (!res.err) {
                addNotification('success', res.msg);
            } else {
                addNotification('error', res.err);
            }
        });
    };

    const MyDropzone = () => {
        const imageStyle = {
            maxHeight: '100%',
            maxWidth: '100%'
        };

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
            setAdminUser({
                ...adminUser,
                avatar: [...adminUser.avatar, ...kepek]
            });
        }, []);

        const { getRootProps, getInputProps } = useDropzone({ onDrop });

        return (
            <React.Fragment>
                <div hidden={adminUser && adminUser.avatar && adminUser.avatar.length > 0} {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
                </div>
                <div className="row">
                    {adminUser &&
                        adminUser.avatar &&
                        adminUser.avatar.map((kep, index) => {
                            return (
                                <Card key={index.toString()} className="col-md-3">
                                    <CardTitle>{kep.nev}</CardTitle>
                                    <CardBody>
                                        <img style={imageStyle} src={kep.src || kep.preview} alt={kep.nev} />
                                    </CardBody>
                                    <CardFooter>
                                        <Button onClick={() => deleteImage(kep.filename)}>Törlés</Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                </div>
            </React.Fragment>
        );
    };

    const renderModal = () => {
        // console.log(adminUser);
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size="xl" backdrop="static">
                <RVForm autoComplete="off" onSubmit={onSave} encType="multipart/form-data" noValidate={true}>
                    <ModalHeader>{!currentId ? 'Admin felhasználó hozzáadása' : 'Admin felhasználó módosítása'}</ModalHeader>
                    <ModalBody>
                        <h4>Alapadatok:</h4>
                        <br />
                        <div className="row">
                            <div className="col-md-2">
                                <Label>Titulus:</Label>
                                <RVInput autoComplete="none" name="titulus" type="text" onChange={(e) => handleInputChange(e, nev, setNev)} value={nev.titulus} />
                            </div>
                            <div className="col-md-5">
                                <Label>Vezetéknév:</Label>
                                <RVInput autoComplete="none" name="vezeteknev" type="text" onChange={(e) => handleInputChange(e, nev, setNev)} value={nev.vezeteknev} />
                            </div>
                            <div className="col-md-5">
                                <Label>Keresztnév:</Label>
                                <RVInput autoComplete="none" name="keresztnev" type="text" onChange={(e) => handleInputChange(e, nev, setNev)} value={nev.keresztnev} />
                            </div>
                            <div className="col-md-12" />
                            <br />
                            <div className="col-md-5">
                                <Label>Ország:</Label>
                                <RVInput autoComplete="none" type="select" id="orszag" name="orszag" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.orszag.id}>
                                    <option key="default" value="">
                                        {'Kérjük válasszon országot...'}
                                    </option>
                                    {renderOrszagokOptions()}
                                </RVInput>
                            </div>
                            <div className="col-md-2">
                                <Label>Irányítószám:</Label>
                                <RVInput autoComplete="none" name="irszam" id="irszam" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.irszam} />
                            </div>
                            <div className="col-md-5">
                                <Label>Település:</Label>
                                <RVInput
                                    autoComplete="none"
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
                                <RVInput autoComplete="none" name="kozterulet" id="kozterulet" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.kozterulet} />
                            </div>
                            <div className="col-md-2">
                                <Label>Házszám:</Label>
                                <RVInput autoComplete="none" name="hazszam" id="hazszam" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.hazszam} />
                            </div>
                            <div className="col-md-2">
                                <Label>Helyrajzi szám:</Label>
                                <RVInput autoComplete="none" name="hrsz" id="hrsz" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.hrsz} />
                            </div>
                            <div className="col-md-2">
                                <Label>Postafiók:</Label>
                                <RVInput autoComplete="none" name="postafiok" id="postafiok" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.postafiok} />
                            </div>
                            <div className="col-md-12" />
                            <br />
                            <div className="col-md-4">
                                <Label>Épület:</Label>
                                <RVInput autoComplete="none" name="epulet" id="epulet" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.epulet} />
                            </div>
                            <div className="col-md-4">
                                <Label>Emelet:</Label>
                                <RVInput autoComplete="none" name="emelet" id="emelet" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.emelet} />
                            </div>
                            <div className="col-md-4">
                                <Label>Ajtó:</Label>
                                <RVInput autoComplete="none" name="ajto" id="ajto" type="text" onChange={(e) => handleInputChange(e, cim, setCim)} value={cim.ajto} />
                            </div>
                            <div className="col-md-12" />
                            <br />
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-3">
                                        <Label>Országhívó:</Label>
                                        <RVInput
                                            autoComplete="none"
                                            type="text"
                                            name="orszaghivo"
                                            id="orszaghivo"
                                            onChange={(e) => handleInputChange(e, telefon, setTelefon)}
                                            value={telefon.orszaghivo}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <Label>Körzetszám:</Label>
                                        <RVInput autoComplete="none" type="text" name="korzet" id="korzet" onChange={(e) => handleInputChange(e, telefon, setTelefon)} value={telefon.korzet} />
                                    </div>
                                    <div className="col-md-6">
                                        <Label>Telefonszám:</Label>
                                        <RVInput autoComplete="none" type="text" name="telszam" id="telszam" onChange={(e) => handleInputChange(e, telefon, setTelefon)} value={telefon.telszam} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <Label>Jogosultságok:</Label>
                                <Select name="roles" id="roles" options={roleOptions} isMulti onChange={(e) => setAdminUser({ ...adminUser, roles: e })} value={adminUser.roles} />
                            </div>
                            <div className="col-md-12" />
                            <br />
                            <div className="col-md-12">
                                <Label>Avatar: *</Label>
                                <MyDropzone multiple />
                            </div>
                        </div>
                        <hr />
                        <h4>Belépéshez szükséges adatok:</h4>
                        <br />
                        <div className="row">
                            <div className="col-md-3">
                                <Label>Email: *</Label>
                                <RVInput autoComplete="none" name="email" id="email" type="email" onChange={(e) => handleInputChange(e, adminUser, setAdminUser)} value={adminUser.email} />
                            </div>
                            <div className="col-md-3">
                                <Label>Felhasználónév: *</Label>
                                <RVInput
                                    autoComplete="new-password"
                                    name="username"
                                    id="username"
                                    type="text"
                                    onChange={(e) => handleInputChange(e, adminUser, setAdminUser)}
                                    value={adminUser.username}
                                />
                            </div>
                            <div className="col-md-3">
                                <Label>Jelszó: *</Label>
                                <RVInput autoComplete="none" name="password" id="password" type="password" onChange={(e) => handleInputChange(e, adminUser, setAdminUser)} value={adminUser.password} />
                            </div>
                            <div className="col-md-3">
                                <Label>Értékesítő: *</Label>
                                <RVInput
                                    autoComplete="none"
                                    name="isErtekesito"
                                    id="isErtekesito"
                                    type="checkbox"
                                    onChange={(e) => handleInputChange(e, adminUser, setAdminUser)}
                                    checked={adminUser.isErtekesito}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" type="submit">
                            Mentés
                        </Button>
                        <Button color="secondary" type="button" onClick={() => toggleModal()}>
                            Mégsem
                        </Button>
                    </ModalFooter>
                </RVForm>
            </Modal>
        );
    };

    const nevFormatter = (cell, row) => {
        const { nev } = row;
        return `${nev.titulus} ${nev.vezeteknev} ${nev.keresztnev}`;
    };

    const telefonFormatter = (cell, row) => {
        const { telefon } = row;
        return `${telefon.orszaghivo}-${telefon.korzet}/${telefon.telszam}`;
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
                <Button
                    key={row.id + 2}
                    color="link"
                    //   onClick={() => handleDeleteClick(cell)}
                >
                    <i className="fas fa-trash" />
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
                dataField: 'username',
                text: 'Felhasználónév'
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

        return <DataTable bordered datas={adminusersJson} columns={columns} paginationOptions={paginationOptions} />;
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <Button type="button" color="success" onClick={() => handleNewClick()}>
                    {' '}
                    + Admin hozzáadása{' '}
                </Button>
                <br />
                <br />
                {renderModal()}
                {renderTable()}
            </div>
        </div>
    );
};

export default AdminUsers;
