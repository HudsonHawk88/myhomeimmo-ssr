import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import { useDropzone } from 'react-dropzone';
import { Editor, setEditorValue, initialValue } from '@inftechsol/react-slate-wysiwyg';
import { WysiwygEditor, serializeValue } from '../../../commons/WysiwygEditor';
import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';
import { makeFormData } from '../../../commons/Lib';
import { RVForm, RVInput } from '@inftechsol/reactstrap-form-validation';

const Rolunk = (props) => {
    const { addNotification } = props;
    const defaultRolunkObj = {
        azonosito: '',
        kep: [],
        nev: '',
        beosztas: '',
        email: '',
        telefon: '',
        leiras: initialValue
    };

    const [rolunkJson, setRolunkJson] = useState([]);
    const [rolunkObj, setRolunkObj] = useState(defaultRolunkObj);
    const [currentId, setCurrentId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const listRolunk = () => {
        Services.listRolunk((err, res) => {
            if (!err) {
                let newArr = [];
                const fonok = res.filter((r) => r.nev === 'Berki Mónika');
                const tobbiek = res.filter((r) => r.nev !== 'Berki Mónika');
                newArr = newArr.concat(fonok, tobbiek);
                setRolunkJson(newArr);
            }
        });
    };

    useEffect(() => {
        listRolunk();
    }, []);

    const getRolunk = (id) => {
        Services.getRolunk(id, (err, res) => {
            if (!err && Editor && Editor.current) {
                const leiras = serializeValue('de', res.leiras);
                setEditorValue(leiras, Editor);
                setRolunkObj({ azonosito: res.azonosito, kep: res.kep, nev: res.nev, beosztas: res.beosztas, email: res.email, telefon: res.telefon, leiras: leiras });
            }
        });
    };

    const onChangeEditor = (value) => {
        setRolunkObj({
            ...rolunkObj,
            leiras: value
        });
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };

    const handleNewClick = () => {
        setCurrentId(null);
        setRolunkObj(defaultRolunkObj);
        toggleModal();
    };

    const handleEditClick = (id) => {
        setCurrentId(id);
        getRolunk(id);
        toggleModal();
    };

    const handleDeleteClick = (id) => {
        setCurrentId(id);
        toggleDeleteModal();
    };

    const deleteImage = (filename) => {
        let kepek = rolunkObj.kep;
        let filtered = kepek.filter((kep) => kep.filename !== filename);
        setRolunkObj({
            ...rolunkObj,
            kep: filtered
        });
        Services.deleteImage(filename, currentId, (err, res) => {
            if (!err) {
                addNotification('success', res.msg);
            }
        });
    };

    const MyDropzone = () => {
        const imageStyle = {
            // maxHeight: '100%',
            maxWidth: '50%'
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

            setRolunkObj({
                ...rolunkObj,
                kep: [...rolunkObj.kep, ...kepek]
            });
        }, []);

        const { getRootProps, getInputProps } = useDropzone({ onDrop });
        return (
            <React.Fragment>
                <div hidden={rolunkObj.kep.length > 0} {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
                </div>
                <div className="row">
                    {rolunkObj.kep.map((kep, index) => {
                        return (
                            <Card key={index.toString()} className="col-md-12">
                                <CardTitle>{kep.nev}</CardTitle>
                                <CardBody
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <img style={imageStyle} src={kep.src} alt={kep.nev} />
                                </CardBody>
                                <CardFooter
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Button onClick={() => deleteImage(kep.filename)}>Törlés</Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </React.Fragment>
        );
    };

    const tableIconFormatter = (cell, row) => {
        return (
            <React.Fragment>
                {/* <Button
              key={rowIndex}
              color="link"
              onClick={() => handleViewClick(cell)}
            >
              <i key={rowIndex + 1} className="fas fa-eye" />
            </Button> */}
                <Button key={row.id + 1} color="link" onClick={() => handleEditClick(row.id)}>
                    <i className="fas fa-pencil-alt" />
                </Button>
                <Button key={row.id + 2} color="link" onClick={() => handleDeleteClick(row.id)}>
                    <i className="fas fa-trash" />
                </Button>
            </React.Fragment>
        );
    };

    const renderTable = () => {
        const columns = [
            {
                dataField: 'azonosito',
                text: 'Azonosító'
            },
            {
                dataField: 'nev',
                text: 'Név'
            },
            {
                dataField: 'beosztas',
                text: 'Beosztás'
            },
            {
                dataField: 'email',
                text: 'Email'
            },
            {
                dataField: 'telefon',
                text: 'Telefon'
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

        return <DataTable bordered columns={columns} datas={rolunkJson} paginationOptions={paginationOptions} />;
    };

    const onSave = () => {
        let obj = {};
        Object.assign(obj, rolunkObj);
        obj.leiras = serializeValue('se', rolunkObj.leiras);
        let datas = {};
        if (!currentId) {
            datas = makeFormData(obj, ['kep'], false);
            Services.addRolunk(datas, (err, res) => {
                if (!err) {
                    listRolunk();
                    toggleModal();
                    addNotification('success', res.msg);
                }
            });
        } else {
            datas = makeFormData(obj, ['kep'], true);
            Services.editRolunk(datas, currentId, (err, res) => {
                if (!err) {
                    listRolunk();
                    toggleModal();
                    addNotification('success', res.msg);
                }
            });
        }
    };

    const onDelete = () => {
        Services.deleteRolunk(currentId, (err, res) => {
            if (!err) {
                listRolunk();
                toggleDeleteModal();
                addNotification('success', res.msg);
            }
        });
    };

    const renderWysiwyg = () => {
        return <WysiwygEditor onChange={onChangeEditor} value={rolunkObj.leiras} />;
    };

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size="xl" backdrop="static">
                <RVForm onSubmit={onSave} encType="multipart/form-data" noValidate={true}>
                    <ModalHeader>{!currentId ? 'Rólunk bejegyzés hozzáadása' : 'Rólunk bejegyzés módosítása'}</ModalHeader>
                    <ModalBody>
                        <div className="col-md-12">
                            <Label>Azonosító:</Label>
                            <RVInput type="text" name="azonosito" id="azonosito" value={rolunkObj.azonosito} onChange={(e) => handleInputChange(e, rolunkObj, setRolunkObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>Kép:</Label>
                            <MyDropzone />
                        </div>
                        <div className="col-md-12">
                            <Label>Név:</Label>
                            <RVInput type="text" name="nev" id="nev" value={rolunkObj.nev} onChange={(e) => handleInputChange(e, rolunkObj, setRolunkObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>Beosztás:</Label>
                            <RVInput type="text" name="beosztas" id="beosztas" value={rolunkObj.beosztas} onChange={(e) => handleInputChange(e, rolunkObj, setRolunkObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>Email:</Label>
                            <RVInput type="email" name="email" id="email" value={rolunkObj.email} onChange={(e) => handleInputChange(e, rolunkObj, setRolunkObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>Telefon:</Label>
                            <RVInput type="text" name="telefon" id="telefon" value={rolunkObj.telefon} onChange={(e) => handleInputChange(e, rolunkObj, setRolunkObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>Leiras:</Label>
                            {renderWysiwyg()}
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

    const renderDeleteModal = () => {
        return (
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalHeader>Rólunk bejegyzés törlése</ModalHeader>
                <ModalBody>
                    <div className="col-md-12">{'Valóban törölni kívánja az adott tételt?'}</div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => onDelete()}>
                        Igen
                    </Button>
                    <Button color="secondary" onClick={() => toggleDeleteModal()}>
                        Mégsem
                    </Button>
                </ModalFooter>
            </Modal>
        );
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <Button color="success" onClick={() => handleNewClick()}>
                    + Rólunk bejegyzés hozzáadása
                </Button>
                <br />
                <br />
                {renderTable()}
                {renderModal()}
                {renderDeleteModal()}
            </div>
        </div>
    );
};

export default Rolunk;
