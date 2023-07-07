import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import { useDropzone } from 'react-dropzone';
import { RVForm, RVInput } from '@inftechsol/reactstrap-form-validation';
import { Wysiwyg, Editor, setEditorValue } from '@inftechsol/react-slate-wysiwyg';
import { serializeValue, initialValue } from '../../../commons/Serializer';
import { handleInputChange } from '../../../commons/InputHandlers';
import { makeFormData } from '../../../commons/Lib';
import Services from './Services';

const IngatlanSzolgaltatasok = (props) => {
    const { addNotification } = props;
    const defaultSzolgObj = {
        azonosito: '',
        kep: [],
        leiras: initialValue
    };

    const [ingatlanSzolgJson, setIngatlanSzolgJson] = useState([]);
    const [currentId, setCurrentId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [ingatlanSzolgObj, setIngatlanSzolgObj] = useState(defaultSzolgObj);

    const init = () => {
        listIngatlanSzolgaltatasok();
    };

    useEffect(() => {
        init();
    }, []);

    const listIngatlanSzolgaltatasok = () => {
        Services.listIngatlanSzolgaltatasok((err, res) => {
            if (!err) {
                setIngatlanSzolgJson(res);
            }
        });
    };

    const getIngatlanSzolgaltatasok = (id) => {
        Services.getIngatlanSzolgaltatas(id, (err, res) => {
            if (!err && Editor && Editor.current) {
                const leiras = serializeValue('de', res.leiras);
                setEditorValue(leiras, Editor);
                setIngatlanSzolgObj({ ...ingatlanSzolgObj, azonosito: res.azonosito, kep: res.kep, leiras: leiras });
            }
        });
    };

    const onChangeEditor = (value) => {
        setIngatlanSzolgObj({ ...ingatlanSzolgObj, leiras: value });
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };

    const handleNewClick = () => {
        setCurrentId(null);
        setIngatlanSzolgObj(defaultSzolgObj);
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

    const deleteImage = (filename) => {
        let kepek = ingatlanSzolgObj.kep;
        let filtered = kepek.filter((kep) => kep.filename !== filename);
        setIngatlanSzolgObj({
            ...ingatlanSzolgObj,
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

            setIngatlanSzolgObj({
                ...ingatlanSzolgObj,
                kep: [...ingatlanSzolgObj.kep, ...kepek]
            });
        }, []);

        const { getRootProps, getInputProps } = useDropzone({ onDrop });

        return (
            <React.Fragment>
                <div hidden={ingatlanSzolgObj && ingatlanSzolgObj.kep && ingatlanSzolgObj.kep.length > 0} {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
                </div>
                <div className="row">
                    {ingatlanSzolgObj &&
                        ingatlanSzolgObj.kep &&
                        ingatlanSzolgObj.kep.map((kep, index) => {
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

    const onSave = () => {
        let obj = {};
        Object.assign(obj, ingatlanSzolgObj);
        obj.leiras = serializeValue('se', ingatlanSzolgObj.leiras);
        let datas = {};
        if (!currentId) {
            datas = makeFormData(obj, ['kep'], false);
            Services.addIngatlanSzolgaltatas(datas, (err, res) => {
                if (!err) {
                    listIngatlanSzolgaltatasok();
                    toggleModal();
                    addNotification('success', res.msg);
                }
            });
        } else {
            datas = makeFormData(obj, ['kep'], true);
            Services.editIngatlanSzolgaltatas(datas, currentId, (err, res) => {
                if (!err) {
                    listIngatlanSzolgaltatasok();
                    toggleModal();
                    addNotification('success', res.msg);
                }
            });
        }
    };

    const onDelete = () => {
        Services.deleteIngatlanSzolgaltatas(currentId, (err, res) => {
            if (!err) {
                listIngatlanSzolgaltatasok();
                toggleDeleteModal();
                addNotification('success', res.msg);
            }
        });
    };

    const renderWysiwyg = () => {
        return <Wysiwyg onChange={onChangeEditor} value={ingatlanSzolgObj.leiras} />;
    };

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size="xl" backdrop="static">
                <RVForm onSubmit={onSave} encType="multipart/form-data" noValidate={true}>
                    <ModalHeader>{!currentId ? 'Ingatlan szolgáltatás hozzáadása' : 'Ingatlan szolgaltatas módosítása'}</ModalHeader>
                    <ModalBody>
                        <div className="col-md-12">
                            <Label>Azonosító:</Label>
                            <RVInput type="text" name="azonosito" id="azonosito" value={ingatlanSzolgObj.azonosito} onChange={(e) => handleInputChange(e, ingatlanSzolgObj, setIngatlanSzolgObj)} />
                        </div>
                        <br />
                        <div className="col-md-12">
                            <Label>Kép:</Label>
                            <MyDropzone />
                        </div>
                        <br />
                        <div className="col-md-12">
                            <Label>Leiras:</Label>
                            {renderWysiwyg()}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" type="submit">
                            Mentés
                        </Button>
                        <Button
                            color="secondary"
                            type="button"
                            onClick={() => {
                                toggleModal();
                            }}
                        >
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
