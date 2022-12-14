import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import { useDropzone } from 'react-dropzone';
import Wysiwyg from '../../../commons/Wysiwyg';
import { serializeValue } from '../../../commons/Serializer';
import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';
import { makeFormData } from '../../../commons/Lib';
import { RVForm, RVInput } from '@inftechsol/reactstrap-form-validation';

const PenzugyiSzolgaltatasok = (props) => {
    const { addNotification } = props;
    const defaultPenzugyiSzolgObj = {
        azonosito: '',
        kep: [],
        leiras: ''
    };

    const [penzugyiSzolgJson, setPenzugyiSzolgJson] = useState([]);
    const [penzugyiSzolgObj, setPenzugyiSzolgObj] = useState(defaultPenzugyiSzolgObj);
    const [currentId, setCurrentId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const listPenzugyiSzolgaltatasok = () => {
        Services.listPenzugyiSzolgaltatasok().then((res) => {
            if (!res.err) {
                setPenzugyiSzolgJson(res);
            } else {
                addNotification('error', res.err);
            }
        });
    };

    useEffect(() => {
        listPenzugyiSzolgaltatasok();
        serializeValue('def', defaultPenzugyiSzolgObj, setPenzugyiSzolgObj, 'leiras');
    }, []);

    const getPenzugyiSzolgaltatasok = (id) => {
        Services.getPenzugyiSzolgaltatas(id).then((res) => {
            if (!res.err) {
                serializeValue(
                    'de',
                    {
                        azonosito: res.azonosito,
                        kep: res.kep,
                        leiras: res.leiras
                    },
                    setPenzugyiSzolgObj,
                    'leiras'
                );
            } else {
                addNotification('error', res.err);
            }
        });
    };

    const onChangeEditor = ({ value }) => {
        setPenzugyiSzolgObj({
            ...penzugyiSzolgObj,
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
        serializeValue('def', defaultPenzugyiSzolgObj, setPenzugyiSzolgObj, 'leiras');
        toggleModal();
    };

    const handleEditClick = (id) => {
        setCurrentId(id);
        getPenzugyiSzolgaltatasok(id);
        toggleModal();
    };

    const handleDeleteClick = (id) => {
        setCurrentId(id);
        toggleDeleteModal();
    };

    const deleteImage = (filename) => {
        let kepek = penzugyiSzolgObj.kep;
        let filtered = kepek.filter((kep) => kep.filename !== filename);
        setPenzugyiSzolgObj({
            ...penzugyiSzolgObj,
            kep: filtered
        });
        Services.deleteImage(filename, currentId).then((res) => {
            if (!res.err) {
                addNotification('success', res.msg);
            } else {
                addNotification('error', res.err);
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

            setPenzugyiSzolgObj({
                ...penzugyiSzolgObj,
                kep: [...penzugyiSzolgObj.kep, ...kepek]
            });
        }, []);
        const { getRootProps, getInputProps } = useDropzone({ onDrop });
        return (
            <React.Fragment>
                <div hidden={penzugyiSzolgObj.kep.length > 0} {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Kattintson vagy h??zza id a felt??ltend?? k??peket...</p>
                </div>
                <div className="row">
                    {penzugyiSzolgObj.kep.map((kep, index) => {
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
                                    <Button onClick={() => deleteImage(kep.filename)}>T??rl??s</Button>
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
                text: 'Azonos??t??'
            },
            {
                dataField: 'id',
                formatter: tableIconFormatter,
                text: 'M??veletek'
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

        return <DataTable bordered columns={columns} datas={penzugyiSzolgJson} paginationOptions={paginationOptions} />;
    };

    const onSave = (kuldObj) => {
        let datas = {};
        if (!currentId) {
            datas = makeFormData(kuldObj, 'kep', false);
            Services.addPenzugyiSzolgaltatas(datas).then((res) => {
                if (!res.err) {
                    listPenzugyiSzolgaltatasok();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
        } else {
            datas = makeFormData(kuldObj, 'kep', true);
            Services.editPenzugyiSzolgaltatas(datas, currentId).then((res) => {
                if (!res.err) {
                    listPenzugyiSzolgaltatasok();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
        }
    };

    const onDelete = () => {
        Services.deletePenzugyiSzolgaltatas(currentId).then((res) => {
            if (!res.err) {
                listPenzugyiSzolgaltatasok();
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
                <RVForm onSubmit={() => serializeValue('se', penzugyiSzolgObj, () => {}, 'leiras', onSave)} encType="multipart/form-data" noValidate={true}>
                    <ModalHeader>{!currentId ? 'P??nz??gyi szolg??ltat??s hozz??ad??sa' : 'P??nz??gyi szolgaltatas m??dos??t??sa'}</ModalHeader>
                    <ModalBody>
                        <div className="col-md-12">
                            <Label>Azonos??t??:</Label>
                            <RVInput type="text" name="azonosito" id="azonosito" value={penzugyiSzolgObj.azonosito} onChange={(e) => handleInputChange(e, penzugyiSzolgObj, setPenzugyiSzolgObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>K??p:</Label>
                            <MyDropzone />
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-12">
                                <Label>Leiras:</Label>
                                <Wysiwyg fontId="penzugyszolg" onChange={onChangeEditor} value={penzugyiSzolgObj.leiras} />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" type="submit">
                            Ment??s
                        </Button>
                        <Button color="secondary" type="button" onClick={() => toggleModal()}>
                            M??gsem
                        </Button>
                    </ModalFooter>
                </RVForm>
            </Modal>
        );
    };

    const renderDeleteModal = () => {
        return (
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalHeader>P??nz??gyi szolg??ltat??s t??rl??se</ModalHeader>
                <ModalBody>
                    <div className="col-md-12">{'Val??ban t??r??lni k??v??nja az adott t??telt?'}</div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => onDelete()}>
                        Igen
                    </Button>
                    <Button color="secondary" onClick={() => toggleDeleteModal()}>
                        M??gsem
                    </Button>
                </ModalFooter>
            </Modal>
        );
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <Button color="success" onClick={() => handleNewClick()}>
                    + P??nz??gyi szolg??ltat??s hozz??ad??sa
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

export default PenzugyiSzolgaltatasok;
