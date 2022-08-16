import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import { useDropzone } from 'react-dropzone';
import Wysiwyg from '../../../commons/Wysiwyg';
import { serializeValue } from '../../../commons/Serializer';
import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';
const IngatlanSzolgaltatasok = (props) => {
    const { addNotification } = props;
    const defaultSzolgObj = {
        azonosito: '',
        kep: [],
        leiras: ''
    };

    const [ingatlanSzolgJson, setIngatlanSzolgJson] = useState([]);
    const [currentId, setCurrentId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [ingatlanSzolgObj, setIngatlanSzolgObj] = useState(defaultSzolgObj);

    const listIngatlanSzolgaltatasok = () => {
        Services.listIngatlanSzolgaltatasok().then((res) => {
            if (res && !res.err) {
                setIngatlanSzolgJson(res);
            } else {
                addNotification('error', res.err);
            }
        });
    };

    const setDefaultWysiwygValue = () => {
        serializeValue('def', defaultSzolgObj, setIngatlanSzolgObj, 'leiras');
    };

    const init = async () => {
        setDefaultWysiwygValue();
        listIngatlanSzolgaltatasok();
    };

    useEffect(() => {
        init();
    }, []);

    const getIngatlanSzolgaltatasok = (id) => {
        Services.getIngatlanSzolgaltatas(id).then((res) => {
            if (!res.err) {
                serializeValue(
                    'de',
                    {
                        azonosito: res.azonosito,
                        kep: res.kep,
                        leiras: res.leiras
                    },
                    setIngatlanSzolgObj,
                    'leiras'
                );
            } else {
                addNotification('error', res.err);
            }
        });
    };

    const onChangeEditor = ({ value }) => {
        setIngatlanSzolgObj({
            ...ingatlanSzolgObj,
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
        setDefaultWysiwygValue();
        toggleModal();
    };

    const handleEditClick = (id) => {
        setCurrentId(id);
        getIngatlanSzolgaltatasok(id);
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

                    setIngatlanSzolgObj({
                        ...ingatlanSzolgObj,
                        kep: [...ingatlanSzolgObj.kep, kep]
                    });
                };
                reader.readAsDataURL(file);
            });
        }, []);
        const { getRootProps, getInputProps } = useDropzone({ onDrop });
        return (
            <React.Fragment>
                <div hidden={ingatlanSzolgObj.kep && ingatlanSzolgObj.kep.length > 0} {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
                </div>
                <div className="row">
                    {ingatlanSzolgObj.kep &&
                        ingatlanSzolgObj.kep.map((kep, index) => {
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
        let kepek = ingatlanSzolgObj.kep;
        let filtered = kepek.filter((kep) => kep.src !== src);
        setIngatlanSzolgObj({
            ...ingatlanSzolgObj,
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

        return <DataTable bordered columns={columns} datas={ingatlanSzolgJson} paginationOptions={paginationOptions} />;
    };

    const setKuldObj = (callback) => {
        const newObj = {
            azonosito: ingatlanSzolgObj.azonosito,
            kep: ingatlanSzolgObj.kep,
            leiras: ingatlanSzolgObj.leiras
        };
        serializeValue('se', newObj, () => {}, 'leiras', callback);
    };

    const onSave = (kuldObj) => {
        if (!currentId) {
            Services.addIngatlanSzolgaltatas(kuldObj).then((res) => {
                if (!res.err) {
                    listIngatlanSzolgaltatasok();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
        } else {
            Services.editIngatlanSzolgaltatas(kuldObj, currentId).then((res) => {
                if (!res.err) {
                    listIngatlanSzolgaltatasok();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
        }
    };

    const onDelete = () => {
        Services.deleteIngatlanSzolgaltatas(currentId).then((res) => {
            if (!res.err) {
                listIngatlanSzolgaltatasok();
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
                <ModalHeader>{!currentId ? 'Ingatlan szolgáltatás hozzáadása' : 'Ingatlan szolgaltatas módosítása'}</ModalHeader>
                <ModalBody>
                    <div className="col-md-12">
                        <Label>Azonosító:</Label>
                        <Input type="text" name="azonosito" id="azonosito" value={ingatlanSzolgObj.azonosito} onChange={(e) => handleInputChange(e, ingatlanSzolgObj, setIngatlanSzolgObj)} />
                    </div>
                    <br />
                    <div className="col-md-12">
                        <Label>Kép:</Label>
                        <MyDropzone />
                    </div>
                    <br />
                    <div className="col-md-12">
                        <Label>Leiras:</Label>
                        <Wysiwyg fontId="ingszolg" onChange={onChangeEditor} value={ingatlanSzolgObj.leiras} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => setKuldObj(onSave)}>
                        Mentés
                    </Button>
                    <Button color="secondary" type="button" onClick={() => toggleModal()}>
                        Mégsem
                    </Button>
                </ModalFooter>
            </Modal>
        );
    };

    const renderDeleteModal = () => {
        return (
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalHeader>Ingatlan szolgáltatás törlése</ModalHeader>
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
                    + Ingatlan szolgáltatás hozzáadása
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

export default IngatlanSzolgaltatasok;
