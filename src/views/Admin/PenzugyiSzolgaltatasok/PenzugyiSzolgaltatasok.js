import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import { useDropzone } from 'react-dropzone';
import { Wysiwyg, Editor, setEditorValue } from '@inftechsol/react-slate-wysiwyg';
import { serializeValue, initialValue } from '../../../commons/Serializer';
import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';
import { makeFormData } from '../../../commons/Lib';
import { RVForm, RVInput } from '@inftechsol/reactstrap-form-validation';

const PenzugyiSzolgaltatasok = (props) => {
    const { addNotification } = props;
    const defaultPenzugyiSzolgObj = {
        azonosito: '',
        kep: [],
        leiras: initialValue
    };

    const [penzugyiSzolgJson, setPenzugyiSzolgJson] = useState([]);
    const [penzugyiSzolgObj, setPenzugyiSzolgObj] = useState(defaultPenzugyiSzolgObj);
    const [currentId, setCurrentId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const listPenzugyiSzolgaltatasok = () => {
        Services.listPenzugyiSzolgaltatasok((err, res) => {
            if (!err) {
                setPenzugyiSzolgJson(res);
            }
        });
    };

    useEffect(() => {
        listPenzugyiSzolgaltatasok();
    }, []);

    const getPenzugyiSzolgaltatasok = (id) => {
        Services.getPenzugyiSzolgaltatas(id, (err, res) => {
            if (!err && Editor && Editor.current) {
                const leiras = serializeValue('de', res.leiras);
                setEditorValue(leiras, Editor);
                setPenzugyiSzolgObj({ ...penzugyiSzolgObj, azonosito: res.azonosito, kep: res.kep, leiras: leiras });
            }
        });
    };

    const onChangeEditor = (value) => {
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
        setPenzugyiSzolgObj(defaultPenzugyiSzolgObj);
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
                    <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
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

        return <DataTable bordered columns={columns} datas={penzugyiSzolgJson} paginationOptions={paginationOptions} />;
    };

    const onSave = (kuldObj) => {
        let obj = {};
        Object.assign(obj, penzugyiSzolgObj);
        obj.leiras = serializeValue('se', penzugyiSzolgObj.leiras);
        let datas = {};
        if (!currentId) {
            datas = makeFormData(obj, 'kep', false);
            Services.addPenzugyiSzolgaltatas(datas, (err, res) => {
                if (!err) {
                    listPenzugyiSzolgaltatasok();
                    toggleModal();
                    addNotification('success', res.msg);
                }
            });
        } else {
            datas = makeFormData(obj, 'kep', true);
            Services.editPenzugyiSzolgaltatas(datas, currentId, (err, res) => {
                if (!err) {
                    listPenzugyiSzolgaltatasok();
                    toggleModal();
                    addNotification('success', res.msg);
                }
            });
        }
    };

    const onDelete = () => {
        Services.deletePenzugyiSzolgaltatas(currentId, (err, res) => {
            if (!err) {
                listPenzugyiSzolgaltatasok();
                toggleDeleteModal();
                addNotification('success', res.msg);
            }
        });
    };

    const renderWysiwyg = () => {
        return <Wysiwyg onChange={onChangeEditor} value={penzugyiSzolgObj.leiras} />;
    };

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size="xl" backdrop="static">
                <RVForm onSubmit={onSave} encType="multipart/form-data" noValidate={true}>
                    <ModalHeader>{!currentId ? 'Pénzügyi szolgáltatás hozzáadása' : 'Pénzügyi szolgaltatas módosítása'}</ModalHeader>
                    <ModalBody>
                        <div className="col-md-12">
                            <Label>Azonosító:</Label>
                            <RVInput type="text" name="azonosito" id="azonosito" value={penzugyiSzolgObj.azonosito} onChange={(e) => handleInputChange(e, penzugyiSzolgObj, setPenzugyiSzolgObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>Kép:</Label>
                            <MyDropzone />
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-12">
                                <Label>Leiras:</Label>
                                {renderWysiwyg()}
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

    const renderDeleteModal = () => {
        return (
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalHeader>Pénzügyi szolgáltatás törlése</ModalHeader>
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
                    + Pénzügyi szolgáltatás hozzáadása
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
