import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import { Wysiwyg, Editor, setEditorValue } from '@inftechsol/react-slate-wysiwyg';
import { serializeValue, initialValue } from '../../../commons/Serializer';
import { useDropzone } from 'react-dropzone';
import KepCard from '../../../commons/KepCard.js';

import { handleInputChange } from '../../../commons/InputHandlers.js';
import Services from './Services.js';
import { makeFormData } from '../../../commons/Lib';
import { RVForm, RVInput } from '@inftechsol/reactstrap-form-validation';

const MyArtGaleriak = (props) => {
    const defaultMyArtGaleriakObj = {
        azonosito: '',
        nev: '',
        muveszNev: '',
        muveszTelefon: '',
        muveszEmail: '',
        muveszUrl: '',
        kepek: [],
        leiras: initialValue,
        isActive: false
    };

    const [myArtGaleriakJson, setMyArtGaleriakJson] = useState([]);
    const [myArtGaleriakObj, setMyArtGaleriakObj] = useState(defaultMyArtGaleriakObj);
    const [currentId, setCurrentId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const { addNotification } = props;

    const listGaleriak = () => {
        Services.listGaleriak((err, res) => {
            if (!err) {
                setMyArtGaleriakJson(res);
            }
        });
    };

    useEffect(() => {
        listGaleriak();
    }, []);

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

            setMyArtGaleriakObj({
                ...myArtGaleriakObj,
                kepek: [...myArtGaleriakObj.kepek, ...kepek]
            });
        }, []);
        const { getRootProps, getInputProps } = useDropzone({ onDrop });
        return (
            <React.Fragment>
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
                </div>
                <KepCard services={Services} list={myArtGaleriakObj} property="kepek" setList={setMyArtGaleriakObj} {...props} />
            </React.Fragment>
        );
    };

    const getGaleria = (id) => {
        Services.getGaleria(id, (err, res) => {
            if (!err && Editor && Editor.current) {
                const leiras = serializeValue('de', res.leiras);
                setEditorValue(leiras, Editor);
                setMyArtGaleriakObj({
                    azonosito: res.azonosito,
                    nev: res.nev,
                    muveszNev: res.muveszNev,
                    muveszTelefon: res.muveszTelefon,
                    muveszEmail: res.muveszEmail,
                    muveszUrl: res.muveszUrl,
                    kepek: res.kepek,
                    leiras: leiras,
                    isActive: res.isActive
                });
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
        setMyArtGaleriakObj(defaultMyArtGaleriakObj);
        toggleModal();
    };

    const handleEditClick = (id) => {
        setCurrentId(id);
        getGaleria(id);
        toggleModal();
    };

    const handleDeleteClick = (id) => {
        setCurrentId(id);
        toggleDeleteModal();
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
                dataField: 'muveszNev',
                text: 'Művész neve'
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

        return <DataTable bordered columns={columns} datas={myArtGaleriakJson} paginationOptions={paginationOptions} />;
    };

    const onSave = () => {
        let obj = {};
        Object.assign(obj, myArtGaleriakObj);
        obj.leiras = serializeValue('se', myArtGaleriakObj.leiras);
        let datas = {};
        if (!currentId) {
            datas = makeFormData(obj, ['kepek'], false);
            Services.addGaleria(datas, (err, res) => {
                if (!err) {
                    listGaleriak();
                    toggleModal();
                    addNotification('success', res.msg);
                }
            });
        } else {
            datas = makeFormData(obj, ['kepek'], true);
            Services.editGaleria(datas, currentId, (err, res) => {
                if (!err) {
                    listGaleriak();
                    toggleModal();
                    addNotification('success', res.msg);
                }
            });
        }
    };

    const onDelete = () => {
        Services.deleteGaleria(currentId, (err, res) => {
            if (!err) {
                listGaleriak();
                toggleDeleteModal();
                addNotification('success', res.msg);
            }
        });
    };

    const onChangeEditor = (value) => {
        setMyArtGaleriakObj({
            ...myArtGaleriakObj,
            leiras: value
        });
    };

    const renderWysiwyg = () => {
        return <Wysiwyg onChange={onChangeEditor} value={myArtGaleriakObj.leiras} />;
    };

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" backdrop="static">
                <RVForm onSubmit={onSave} encType="multipart/form-data" noValidate={true}>
                    <ModalHeader>{!currentId ? 'MyArt galéria hozzáadása' : 'MyArt galéria módosítása'}</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-md-4">
                                <Label>Azonosító:</Label>
                                <RVInput type="text" name="azonosito" id="azonosito" value={myArtGaleriakObj.azonosito} onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)} />
                            </div>
                            <div className="col-md-4">
                                <Label>Név:</Label>
                                <RVInput type="text" name="nev" id="nev" value={myArtGaleriakObj.nev} onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)} />
                            </div>
                            <div className="col-md-4">
                                <Label>Művész neve:</Label>
                                <RVInput type="text" name="muveszNev" id="muveszNev" value={myArtGaleriakObj.muveszNev} onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)} />
                            </div>
                            <div className="col-md-12" />
                            <br />
                            <div className="col-md-4">
                                <Label>Művész telefonszáma:</Label>
                                <RVInput
                                    type="text"
                                    name="muveszTelefon"
                                    id="muveszTelefon"
                                    value={myArtGaleriakObj.muveszTelefon}
                                    onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label>Művész e-mail címe:</Label>
                                <RVInput
                                    type="email"
                                    name="muveszEmail"
                                    id="muveszEmail"
                                    value={myArtGaleriakObj.muveszEmail}
                                    onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label>Művész weblapja:</Label>
                                <RVInput type="text" name="muveszUrl" id="muveszUrl" value={myArtGaleriakObj.muveszUrl} onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)} />
                            </div>
                            <div className="col-md-12" />
                            <br />
                            <div className="col-md-12">
                                <Label>Képek: *</Label>
                                <MyDropzone multiple />
                            </div>
                            <div className="col-md-12" />
                            <br />
                            <div className="col-md-4">
                                <Label>Publikus:</Label>
                                <RVInput
                                    type="checkbox"
                                    name="isActive"
                                    id="isActive"
                                    checked={myArtGaleriakObj.isActive}
                                    onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)}
                                />
                            </div>
                            <div className="col-md-12" />
                            <br />
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
                <ModalHeader>MyArt általános bejegyzés törlése</ModalHeader>
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
                    + MyArt galéria hozzáadása
                </Button>
                <br />
                <br />
                {myArtGaleriakJson && myArtGaleriakJson.length !== 0 && renderTable()}
                {renderModal()}
                {renderDeleteModal()}
            </div>
        </div>
    );
};

export default MyArtGaleriak;
