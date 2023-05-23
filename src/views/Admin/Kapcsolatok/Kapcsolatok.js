import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import { useDropzone } from 'react-dropzone';
import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';
import { RVForm, RVInput } from '@inftechsol/reactstrap-form-validation';
import { makeFormData } from '../../../commons/Lib';

const Kapcsolatok = (props) => {
    const defaultKapcsolatObj = {
        azonosito: '',
        kep: [],
        nev: '',
        cim: '',
        email: '',
        telefon: '',
        kapcsolatcim: '',
        kapcsolatleiras: ''
    };

    const [kapcsolatokJson, setKapcsolatokJson] = useState([]);
    const [kapcsolatObj, setKapcsolatObj] = useState(defaultKapcsolatObj);
    const [currentId, setCurrentId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const { addNotification } = props;

    const listKapcsolatok = () => {
        Services.listKapcsolatok((err, res) => {
            if (!err) {
                setKapcsolatokJson(res);
            }
        });
    };

    useEffect(() => {
        listKapcsolatok();
    }, []);

    const getKapcsolat = (id) => {
        Services.getKapcsolat(id, (err, res) => {
            if (!err) {
                setKapcsolatObj(res);
            }
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
        setKapcsolatObj(defaultKapcsolatObj);
        toggleModal();
    };

    const handleEditClick = (id) => {
        setCurrentId(id);
        getKapcsolat(id);
        toggleModal();
    };

    const handleDeleteClick = (id) => {
        setCurrentId(id);
        toggleDeleteModal();
    };

    const deleteImage = (filename) => {
        let kepek = kapcsolatObj.kep;
        let filtered = kepek.filter((kep) => kep.filename !== filename);
        setKapcsolatObj({
            ...kapcsolatObj,
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

            setKapcsolatObj({
                ...kapcsolatObj,
                kep: [...kapcsolatObj.kep, ...kepek]
            });
        }, []);

        const { getRootProps, getInputProps } = useDropzone({ onDrop });

        return (
            <React.Fragment>
                <div hidden={kapcsolatObj && kapcsolatObj.kep && kapcsolatObj.kep.length > 0} {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
                </div>
                <div className="row">
                    {kapcsolatObj &&
                        kapcsolatObj.kep &&
                        kapcsolatObj.kep.map((kep, index) => {
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
                dataField: 'cim',
                text: 'Cím'
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

        return <DataTable bordered columns={columns} datas={kapcsolatokJson} paginationOptions={paginationOptions} />;
    };

    const onSave = () => {
        let datas = {};
        if (!currentId) {
            datas = makeFormData(kapcsolatObj, 'kep', false);
            Services.addKapcsolat(datas, (err, res) => {
                if (!err) {
                    listKapcsolatok();
                    toggleModal();
                    addNotification('success', res.msg);
                }
            });
        } else {
            datas = makeFormData(kapcsolatObj, 'kep', true);
            Services.editKapcsolat(datas, currentId, (err, res) => {
                if (!err) {
                    listKapcsolatok();
                    toggleModal();
                    addNotification('success', res.msg);
                }
            });
        }
    };

    const onDelete = () => {
        Services.deleteKapcsolat(currentId, (err, res) => {
            if (!err) {
                listKapcsolatok();
                toggleDeleteModal();
                addNotification('success', res.msg);
            }
        });
    };

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" backdrop="static">
                <RVForm onSubmit={onSave} encType="multipart/form-data" noValidate={true}>
                    <ModalHeader>{!currentId ? 'Kapcsolati bejegyzés hozzáadása' : 'Kapcsolati bejegyzés módosítása'}</ModalHeader>
                    <ModalBody>
                        <div className="col-md-12">
                            <Label>Azonosító:</Label>
                            <RVInput type="text" name="azonosito" id="azonosito" value={kapcsolatObj.azonosito} onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>Kép:</Label>
                            <MyDropzone />
                        </div>
                        <div className="col-md-12">
                            <Label>Név:</Label>
                            <RVInput type="text" name="nev" id="nev" value={kapcsolatObj.nev} onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>Cím:</Label>
                            <RVInput type="text" name="cim" id="cim" value={kapcsolatObj.cim} onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>E-mail:</Label>
                            <RVInput type="email" name="email" id="email" value={kapcsolatObj.email} onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>Telefon:</Label>
                            <RVInput type="text" name="telefon" id="telefon" value={kapcsolatObj.telefon} onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>Kapcsolat címsor:</Label>
                            <RVInput type="text" name="kapcsolatcim" id="kapcsolatcim" value={kapcsolatObj.kapcsolatcim} onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>Kapcsolati leiras:</Label>
                            <RVInput
                                type="textarea"
                                name="kapcsolatleiras"
                                id="kapcsolatleiras"
                                rows="7"
                                value={kapcsolatObj.kapcsolatleiras}
                                onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)}
                            />
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
                    + Kapcsolati bejegyzés hozzáadása
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

export default Kapcsolatok;
