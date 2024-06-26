import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import { Wysiwyg, Editor, setEditorValue } from '@inftechsol/react-slate-wysiwyg';
import { serializeValue, initialValue } from '../../../commons/Serializer';
import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';
import { RVForm, RVInput } from '@inftechsol/reactstrap-form-validation';

const MyArtAltalanos = (props) => {
    const defaultMyArtAltalanosObj = {
        azonosito: '',
        nev: '',
        leiras: initialValue
    };

    const [myArtAltalanosJson, setMyArtAltalanosJson] = useState([]);
    const [myArtAltalanosObj, setMyArtAltalanosObj] = useState(defaultMyArtAltalanosObj);
    const [currentId, setCurrentId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const { addNotification } = props;

    const listAltalanos = () => {
        Services.listAltalanos((err, res) => {
            if (!err) {
                setMyArtAltalanosJson(res);
            }
        });
    };

    useEffect(() => {
        listAltalanos();
    }, []);

    const getAltalanos = (id) => {
        Services.getAltalanos(id, (err, res) => {
            if (!err && Editor && Editor.current) {
                const leiras = serializeValue('de', res.leiras);
                setEditorValue(leiras, Editor);
                setMyArtAltalanosObj({ ...myArtAltalanosObj, azonosito: res.azonosito, nev: res.nev, leiras: leiras });
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
        setMyArtAltalanosObj(defaultMyArtAltalanosObj);
        toggleModal();
    };

    const handleEditClick = (id) => {
        setCurrentId(id);
        getAltalanos(id);
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

        return <DataTable bordered columns={columns} datas={myArtAltalanosJson} paginationOptions={paginationOptions} />;
    };

    const onSave = () => {
        let obj = {};
        Object.assign(obj, myArtAltalanosObj);
        obj.leiras = serializeValue('se', myArtAltalanosObj.leiras);
        if (!currentId) {
            Services.addAltalanos(obj, (err, res) => {
                if (!err) {
                    listAltalanos();
                    toggleModal();
                    addNotification('success', res.msg);
                }
            });
        } else {
            Services.editAltalanos(obj, currentId, (err, res) => {
                if (!err) {
                    listAltalanos();
                    toggleModal();
                    addNotification('success', res.msg);
                }
            });
        }
    };

    const onDelete = () => {
        Services.deleteAltalanos(currentId, (err, res) => {
            if (!err) {
                listAltalanos();
                toggleDeleteModal();
                addNotification('success', res.msg);
            }
        });
    };

    const onChangeEditor = (value) => {
        setMyArtAltalanosObj({
            ...myArtAltalanosObj,
            leiras: value
        });
    };

    const renderWysiwyg = () => {
        return <Wysiwyg onChange={onChangeEditor} value={myArtAltalanosObj.leiras} />;
    };

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size="xl" backdrop="static">
                <RVForm onSubmit={onSave} noValidate={true}>
                    <ModalHeader>{!currentId ? 'MyArt általános bejegyzés hozzáadása' : 'MyArt általános bejegyzés módosítása'}</ModalHeader>
                    <ModalBody>
                        <div className="col-md-12">
                            <Label>Azonosító:</Label>
                            <RVInput type="text" name="azonosito" id="azonosito" value={myArtAltalanosObj.azonosito} onChange={(e) => handleInputChange(e, myArtAltalanosObj, setMyArtAltalanosObj)} />
                        </div>
                        <div className="col-md-12">
                            <Label>Név:</Label>
                            <RVInput type="text" name="nev" id="nev" value={myArtAltalanosObj.nev} onChange={(e) => handleInputChange(e, myArtAltalanosObj, setMyArtAltalanosObj)} />
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
                    + MyArt általános bejegyzés hozzáadása
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

export default MyArtAltalanos;
