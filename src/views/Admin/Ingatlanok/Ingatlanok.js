import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';

import Services from './Services';
import IngatlanForm from './IngatlanForm';
import { hasRole } from '../../../commons/Lib';

const Ingatlanok = (props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [ingatlanokJson, setIngatlanokJson] = useState([]);
    const [ingatlanOptions, setIngatlanOptions] = useState([]);
    const [altipusOptions, setAltipusOptions] = useState([]);
    const [tipusFilterOptions, setTipusFilterOptions] = useState([]);
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

    const getIngatlanOptions = () => {
        Services.getIngatlanOptions().then((res) => {
            if (!res.err) {
                setIngatlanOptions(res);
                const ooo = res;
                ooo.forEach((option) => {
                    if (option.nev === 'tipus') {
                        const tipusOptions = [];
                        option.options.forEach((opt) => {
                            let newObj = {};
                            newObj.text = opt.nev;
                            newObj.id = opt.id;
                            newObj.value = opt.value;
                            newObj.nev = opt.nev;
                            tipusOptions.push(newObj);
                        });
                        setTipusFilterOptions(tipusOptions);
                    }
                });
            }
        });
    };

    const getAltipusOptions = () => {
        Services.getAltipusOptions().then((res) => {
            if (!res.err) {
                setAltipusOptions(res);
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
        getIngatlanOptions();
        getAltipusOptions();
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
        toggleDeleteModal();
        setCurrentId(id);
    };

    const printAjanloPDF = (id) => {
        Services.printPDF(id).then((res) => {
            if (res) {
               /*  const url = window.URL.createObjectURL(new Blob([new Uint8Array(res.data.data).buffer])); */
                const url = window.URL.createObjectURL(new Blob([new Uint8Array(res.data.data).buffer], { type: 'application/pdf' }));
              /*   window.open(url, '_blank'); */
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Információs lap.pdf');
                document.body.appendChild(link);
                link.click();
            }
        })
    }

    const openFacebookShare = (url, title, w, h) => {
        if (__isBrowser__) {
            var left = screen.width / 2 - w / 2;
            var top = screen.height / 2 - h / 2;
            return window.open(
                url,
                title,
                'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left
            );
        } else {
            return false;
        }
    };

    const tableIconFormatter = (cell, row) => {
        return (
            <React.Fragment>
                <Button
                    key={row.id + 1}
                    color="link"
                    onClick={() => {
                        openFacebookShare(`https://www.facebook.com/sharer/sharer.php?u=${process.env.shareUrl + row.id}`, 'Megosztás facebookon', 800, 800);
                    }}
                >
                    <i className="fa fa-facebook-square" />
                </Button>
                {((hasRole(props.user.roles, ['INGATLAN_ADMIN']) && props.user.roles.find((role) => role.value === 'INGATLAN_OSSZ_LEK') === undefined) ||
                    props.user.email === row.hirdeto.feladoEmail) && (
                    <>
                        <Button key={row.id + 2} color="link" onClick={() => handleEditClick(row.id)}>
                            <i className="fas fa-pencil-alt" />
                        </Button>
                        <Button key={row.id + 3} color="link" onClick={() => handleDeleteClick(row.id)}>
                            <i className="fas fa-trash" />
                        </Button>
                    </>
                )}
                {hasRole(props.user.roles, ['INGATLAN_ADMIN']) && (
                    <Button key={row.id + 2} color="link" onClick={() => printAjanloPDF(row.id)}>
                        <i className="fas fa-file-pdf" />
                    </Button>
                )}
            </React.Fragment>
        );
    };

    const telepulesFormatter = (cell, row) => {
        return row.helyseg.telepules.telepulesnev;
    };

    const tipusFormatter = (cell, row) => {
        let tipus = null;
        ingatlanOptions.forEach((option) => {
            if (option.nev === 'tipus') {
                option.options.forEach((opt) => {
                    if (opt.value === row.tipus) {
                        tipus = opt.nev;
                    }
                });
            }
        });
        return tipus;
    };

    /*     const arFormatter = (cell, row) => {
        let ar = row.ar + '';
        ar = ar + ' ' + row.penznem;
        return ar;
    };
 */
    const renderTable = () => {
        const columns = [
            {
                dataField: 'id',
                text: 'ID',
                filter: true,
                filterType: 'textFilter',
                filterDefaultValue: 'Keresés...'
            },
            {
                dataField: 'refid',
                text: 'Ref ID',
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
                filterType: 'optionFilter',
                filterOptions: [
                    { id: 0, value: 'Eladó', text: 'Eladó' },
                    { id: 1, value: 'Kiadó', text: 'Kiadó' }
                ],
                filterDefaultValue: 'Keresés...'
            },
            {
                dataField: 'tipus',
                text: 'Típus',
                filter: true,
                filterType: 'optionFilter',
                filterOptions: tipusFilterOptions,
                filterDefaultValue: 'Keresés...',
                formatter: tipusFormatter
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
                /* formatter: arFormatter, */
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

    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };

    const deleteIngatlan = () => {
        Services.deleteIngatlan(currentId).then((res) => {
            if (!res.err) {
                toggleDeleteModal();
                setCurrentId(null);
                listIngatlanok();
                addNotification('success', res.msg);
            } else {
                addNotification('error', res.err);
            }
        });
    };

    const renderDeleteModal = () => {
        return (
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal} backdrop="static" size="md">
                <ModalHeader>Törlés figyelmeztetés</ModalHeader>
                <ModalBody>Valóban törölni kívánja az adott tételt?</ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => deleteIngatlan()}>
                        Igen
                    </Button>
                    <Button color="dark" onClick={() => toggleDeleteModal()}>
                        Mégsem
                    </Button>
                </ModalFooter>
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
                {renderDeleteModal()}
                {ingatlanokJson && ingatlanokJson.length !== 0 && renderTable()}
                {/* {renderFigyelmeztetesModal()} */}
            </div>
        </div>
        // </div>
    );
};

export default Ingatlanok;
