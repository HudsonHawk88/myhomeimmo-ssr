import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import Services from './Services';
import IngatlanForm from './IngatlanForm';

const Ingatlanok = (props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [ingatlanokJson, setIngatlanokJson] = useState([]);
    const [formType, setFormType] = useState('FEL'); // ['FEL', 'MOD', 'DEL']
    const { addNotification } = props;

    const generateXml = () => {
        Services.generateXml().then((res) => {
            if (!res.err) {
                addNotification('success', res.msg);
            } else {
                addNotification('error', res.err);
            }
        });
    };

    const listIngatlanok = () => {
        Services.listIngatlanok().then((res) => {
            if (!res.err) {
                setIngatlanokJson(res);
            }
        });
    };

    const nevFormatter = (nev) => {
        if (nev) {
            return `${nev.titulus} ${nev.vezeteknev} ${nev.keresztnev}`;
        }
    };

    const telefonFormatter = (telefon) => {
        if (telefon) {
            return `${telefon.orszaghivo} ${telefon.korzet} ${telefon.telszam}`;
        }
    };

    const init = () => {
        listIngatlanok();
    };

    useEffect(() => {
        init();
    }, []);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleNewClick = () => {
        setFormType('FEL');
        setCurrentId(null);
        toggleModal();
    };

    const handleViewClick = (id) => {
        setCurrentId(id);
        toggleModal();
    };

    const handleEditClick = (id) => {
        setCurrentId(id);
        setFormType('MOD');
        toggleModal();
    };

    const handleDeleteClick = (id) => {
        setFormType('DEL');
        Services.deleteIngatlan(id).then((res) => {
            if (!res.err) {
                toggleDeleteModal();
                listIngatlanok();
                addNotification('success', res.msg);
            } else {
                addNotification('error', res.err);
            }
        });
    };

    const tableIconFormatter = (cell, row) => {
        return (
            <React.Fragment>
                <Button key={row.id} color="link" onClick={() => handleViewClick(row.id)}>
                    <i className="fas fa-eye" />
                </Button>
                <Button key={row.id + 2} color="link" onClick={() => handleEditClick(row.id)}>
                    <i className="fas fa-pencil-alt" />
                </Button>
                <Button key={row.id + 3} color="link" onClick={() => handleDeleteClick(row.id)}>
                    <i className="fas fa-trash" />
                </Button>
            </React.Fragment>
        );
    };

    const renderTable = () => {
        const columns = [
            {
                dataField: 'cim',
                text: 'Ingatlanhirdetés címe',
                filter: true,
                filterType: 'textFilter',
                filterDefaultValue: 'Keresés...'
            },
            {
                dataField: 'telepules',
                text: 'Település',
                filter: true,
                filterType: 'textFilter',
                filterDefaultValue: 'Keresés...'
            },
            {
                dataField: 'statusz',
                text: 'Státusz',
                filter: true,
                filterType: 'textFilter',
                filterDefaultValue: 'Keresés...'
            },
            {
                dataField: 'tipus',
                text: 'Típus',
                filter: true,
                filterType: 'textFilter',
                filterDefaultValue: 'Keresés...'
            },
            {
                dataField: 'allapot',
                text: 'Állapot',
                filter: true,
                filterType: 'textFilter',
                filterDefaultValue: 'Keresés...'
            },
            {
                dataField: 'ar',
                text: 'Ár',
                filter: true,
                filterType: 'textFilter',
                filterDefaultValue: 'Keresés...'
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

        return <DataTable bordered columns={columns} datas={ingatlanokJson} paginationOptions={paginationOptions} />;
    };

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} backdrop="static" size="xl">
                <IngatlanForm
                    currentId={currentId}
                    formType={formType}
                    listIngatlanok={listIngatlanok}
                    toggleModal={toggleModal}
                    nevFormatter={nevFormatter}
                    telefonFormatter={telefonFormatter}
                    {...props}
                />
            </Modal>
        );
    };

    return (
        // <div className='tartalom-admin'>
        <div className="row">
            <div className="col-md-12">
                <Button type="button" color="success" onClick={handleNewClick}>
                    Ingatlanhirdetés hozzáadása
                </Button>
                &nbsp;&nbsp;
                <Button type="button" color="info" onClick={() => generateXml()}>
                    XML file generálásasa
                </Button>
                <br />
                <br />
                {renderModal()}
                {ingatlanokJson && ingatlanokJson.length !== 0 && renderTable()}
                {/* {renderFigyelmeztetesModal()} */}
            </div>
        </div>
        // </div>
    );
};

export default Ingatlanok;
