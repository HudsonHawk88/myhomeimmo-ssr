import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import Wysiwyg from '../../../commons/Wysiwyg.js';
import { serializeValue } from '../../../commons/Serializer.js';
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
        leiras: '',
        isActive: false
    };

    const [myArtGaleriakJson, setMyArtGaleriakJson] = useState([]);
    const [myArtGaleriakObj, setMyArtGaleriakObj] = useState(defaultMyArtGaleriakObj);
    const [currentId, setCurrentId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const { addNotification } = props;

    const listGaleriak = () => {
        Services.listGaleriak().then((res) => {
            if (!res.err) {
                setMyArtGaleriakJson(res);
            } else {
                addNotification('error', res.err);
            }
        });
    };

    useEffect(() => {
        listGaleriak();
        serializeValue('def', defaultMyArtGaleriakObj, setMyArtGaleriakObj, 'leiras');
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
                    <p>Kattintson vagy h??zza id a felt??ltend?? k??peket...</p>
                </div>
                <KepCard services={Services} list={myArtGaleriakObj} property="kepek" setList={setMyArtGaleriakObj} {...props} />
            </React.Fragment>
        );
    };

    const getGaleria = (id) => {
        Services.getGaleria(id).then((res) => {
            if (!res.err) {
                serializeValue(
                    'de',
                    {
                        azonosito: res.azonosito,
                        nev: res.nev,
                        muveszNev: res.muveszNev,
                        muveszTelefon: res.muveszTelefon,
                        muveszEmail: res.muveszEmail,
                        muveszUrl: res.muveszUrl,
                        kepek: res.kepek,
                        leiras: res.leiras,
                        isActive: res.isActive
                    },
                    setMyArtGaleriakObj,
                    'leiras'
                );
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
        serializeValue('def', defaultMyArtGaleriakObj, setMyArtGaleriakObj, 'leiras');
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
                text: 'Azonos??t??'
            },
            {
                dataField: 'nev',
                text: 'N??v'
            },
            {
                dataField: 'muveszNev',
                text: 'M??v??sz neve'
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

        return <DataTable bordered columns={columns} datas={myArtGaleriakJson} paginationOptions={paginationOptions} />;
    };

    const onSave = (kuldObj) => {
        let datas = {};
        if (!currentId) {
            datas = makeFormData(kuldObj, 'kepek', false);
            Services.addGaleria(datas).then((res) => {
                if (!res.err) {
                    listGaleriak();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
        } else {
            datas = makeFormData(kuldObj, 'kepek', true);
            Services.editGaleria(datas, currentId).then((res) => {
                if (!res.err) {
                    listGaleriak();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            });
        }
    };

    const onDelete = () => {
        Services.deleteGaleria(currentId).then((res) => {
            if (!res.err) {
                listGaleriak();
                toggleDeleteModal();
                addNotification('success', res.msg);
            } else {
                addNotification('error', res.err);
            }
        });
    };

    const onChangeEditor = ({ value }) => {
        setMyArtGaleriakObj({
            ...myArtGaleriakObj,
            leiras: value
        });
    };

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" backdrop="static">
                <RVForm onSubmit={() => serializeValue('se', myArtGaleriakObj, () => {}, 'leiras', onSave)} encType="multipart/form-data" noValidate={true}>
                    <ModalHeader>{!currentId ? 'MyArt gal??ria hozz??ad??sa' : 'MyArt gal??ria m??dos??t??sa'}</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-md-4">
                                <Label>Azonos??t??:</Label>
                                <RVInput type="text" name="azonosito" id="azonosito" value={myArtGaleriakObj.azonosito} onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)} />
                            </div>
                            <div className="col-md-4">
                                <Label>N??v:</Label>
                                <RVInput type="text" name="nev" id="nev" value={myArtGaleriakObj.nev} onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)} />
                            </div>
                            <div className="col-md-4">
                                <Label>M??v??sz neve:</Label>
                                <RVInput type="text" name="muveszNev" id="muveszNev" value={myArtGaleriakObj.muveszNev} onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)} />
                            </div>
                            <div className="col-md-12" />
                            <br />
                            <div className="col-md-4">
                                <Label>M??v??sz telefonsz??ma:</Label>
                                <RVInput
                                    type="text"
                                    name="muveszTelefon"
                                    id="muveszTelefon"
                                    value={myArtGaleriakObj.muveszTelefon}
                                    onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label>M??v??sz e-mail c??me:</Label>
                                <RVInput
                                    type="email"
                                    name="muveszEmail"
                                    id="muveszEmail"
                                    value={myArtGaleriakObj.muveszEmail}
                                    onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label>M??v??sz weblapja:</Label>
                                <RVInput type="text" name="muveszUrl" id="muveszUrl" value={myArtGaleriakObj.muveszUrl} onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)} />
                            </div>
                            <div className="col-md-12" />
                            <br />
                            <div className="col-md-12">
                                <Label>K??pek: *</Label>
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
                                <Wysiwyg fontId="myArtGaleria" onChange={onChangeEditor} value={myArtGaleriakObj.leiras} />
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
                <ModalHeader>MyArt ??ltal??nos bejegyz??s t??rl??se</ModalHeader>
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
                    + MyArt gal??ria hozz??ad??sa
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
