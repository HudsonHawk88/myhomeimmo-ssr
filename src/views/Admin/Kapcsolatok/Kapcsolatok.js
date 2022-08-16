import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import { useDropzone } from 'react-dropzone';
import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';

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
        Services.listKapcsolatok().then((res) => {
            if (!res.err) {
                setKapcsolatokJson(res);
            } else {
                addNotification('error', res.err);
            }
        });
    };

    useEffect(() => {
        listKapcsolatok();
    }, []);

    const getKapcsolat = (id) => {
        Services.getKapcsolat(id).then((res) => {
            if (!res.err) {
                setKapcsolatObj(res);
            } else {
                addNotification('error', res.err);
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

    const MyDropzone = () => {
        const imageStyle = {
            // maxHeight: '100%',
            maxWidth: '50%'
        };
        let kep = {};
        const onDrop = useCallback((acceptedFiles) => {
            acceptedFiles.forEach((file) => {
                let base64 = '';
                const reader = new FileReader();

                reader.onabort = () => console.log('file reading was aborted');
                reader.onerror = () => console.log('file reading has failed');
                reader.onload = (event) => {
                    // Do whatever you want with the file contents
                    base64 = event.target.result;
                    kep = {
                        src: base64,
                        title: file.name,
                        isCover: false
                    };

                    setKapcsolatObj({
                        ...kapcsolatObj,
                        kep: [...kapcsolatObj.kep, kep]
                    });
                };
                reader.readAsDataURL(file);
            });
        }, []);
        const { getRootProps, getInputProps } = useDropzone({ onDrop });
        return (
            <React.Fragment>
                <div hidden={kapcsolatObj.kep.length > 0} {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
                </div>
                <div className="row">
                    {kapcsolatObj.kep.map((kep, index) => {
                        return (
                            <Card key={index.toString()} className="col-md-12">
                                <CardTitle>{kep.nev}</CardTitle>
                                <CardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img style={imageStyle} src={kep.src} alt={kep.nev} />
                                </CardBody>
                                <CardFooter style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button onClick={() => deleteImage(kep.src)}>Törlés</Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </React.Fragment>
        );
    };

    const deleteImage = (src) => {
        let kepek = kapcsolatObj.kep;
        let filtered = kepek.filter((kep) => kep.src !== src);
        setKapcsolatObj({
            ...kapcsolatObj,
            kep: filtered
        });
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
        if (!currentId) {
            Services.addKapcsolat(kapcsolatObj).then((res) => {
                if (!res.err) {
                    listKapcsolatok();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
        } else {
            Services.editKapcsolat(kapcsolatObj, currentId).then((res) => {
                if (!res.err) {
                    listKapcsolatok();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
        }
    };

    const onDelete = () => {
        Services.deleteKapcsolat(currentId).then((res) => {
            if (!res.err) {
                listKapcsolatok();
                toggleDeleteModal();
                addNotification('success', res.msg);
            } else {
                addNotification('error', res.err);
            }
        });
    };

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" backdrop="static">
                <ModalHeader>{!currentId ? 'Kapcsolati bejegyzés hozzáadása' : 'Kapcsolati bejegyzés módosítása'}</ModalHeader>
                <ModalBody>
                    <div className="col-md-12">
                        <Label>Azonosító:</Label>
                        <Input type="text" name="azonosito" id="azonosito" value={kapcsolatObj.azonosito} onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)} />
                    </div>
                    <div className="col-md-12">
                        <Label>Kép:</Label>
                        <MyDropzone />
                    </div>
                    <div className="col-md-12">
                        <Label>Név:</Label>
                        <Input type="text" name="nev" id="nev" value={kapcsolatObj.nev} onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)} />
                    </div>
                    <div className="col-md-12">
                        <Label>Cím:</Label>
                        <Input type="text" name="cim" id="cim" value={kapcsolatObj.cim} onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)} />
                    </div>
                    <div className="col-md-12">
                        <Label>E-mail:</Label>
                        <Input type="email" name="email" id="email" value={kapcsolatObj.email} onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)} />
                    </div>
                    <div className="col-md-12">
                        <Label>Telefon:</Label>
                        <Input type="text" name="telefon" id="telefon" value={kapcsolatObj.telefon} onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)} />
                    </div>
                    <div className="col-md-12">
                        <Label>Kapcsolat címsor:</Label>
                        <Input type="text" name="kapcsolatcim" id="kapcsolatcim" value={kapcsolatObj.kapcsolatcim} onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)} />
                    </div>
                    <div className="col-md-12">
                        <Label>Kapcsolati leiras:</Label>
                        <Input
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
                    <Button color="success" onClick={() => onSave()}>
                        Mentés
                    </Button>
                    <Button color="secondary" onClick={() => toggleModal()}>
                        Mégsem
                    </Button>
                </ModalFooter>
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
