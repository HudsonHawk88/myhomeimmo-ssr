import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { DataTable } from '@inftechsol/react-data-table';
import { Page, Document, pdf, Font, StyleSheet, View, Text, Image } from '@react-pdf/renderer';

import Services from './Services';
import IngatlanForm from './IngatlanForm';
import { hasRole } from '../../../commons/Lib';

const Ingatlanok = (props) => {
    const [viewModal, setViewModal] = useState(false);
    const [viewKepek, setViewKepek] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [ingatlanokJson, setIngatlanokJson] = useState([]);
    const [ingView, setIngView] = useState({});
    const [ingatlanOptions, setIngatlanOptions] = useState([]);
    const [altipusOptions, setAltipusOptions] = useState([]);
    const [tipusFilterOptions, setTipusFilterOptions] = useState([]);
    const [formType, setFormType] = useState('FEL'); // ['FEL', 'MOD', 'DEL']
    const [step, setStep] = useState(1);
    const maxStep = 3;

    const { addNotification, user } = props;

    const generateXml = () => {
        Services.generateXml((err, res) => {
            if (!err) {
                addNotification('success', res.msg);
            }
        });
    };

    const getIngatlanOptions = () => {
        Services.getIngatlanOptions((err, res) => {
            if (!err) {
                setIngatlanOptions(res);
                const ooo = res;
                return ooo.map((option) => {
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
        Services.getAltipusOptions((err, res) => {
            if (!err) {
                setAltipusOptions(res);
            }
        });
    };

    const listIngatlanok = () => {
        Services.listIngatlanok((err, res) => {
            if (!err) {
                let sortedArray = [];
                const sajat = res.filter((i) => i.hirdeto.feladoEmail === user.email);
                const egyeb = res.filter((i) => i.hirdeto.feladoEmail !== user.email);
                sortedArray = sortedArray.concat(sajat, egyeb);

                setIngatlanokJson(sortedArray);
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

    const getIngatlan = (id) => {
        Services.getIngatlan(id, (err, res) => {
            if (!err) {
                setIngView(res[0]);
            }
        });
    };

    const init = () => {
        listIngatlanok();
        getIngatlanOptions();
        getAltipusOptions();
    };

    useEffect(() => {
        init();

        return () => {};
    }, []);

    const toggleViewKepek = () => {
        setViewKepek(!viewKepek);
    };

    const toggleViewModal = () => {
        setViewModal(!viewModal);
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleNewClick = () => {
        setStep(1);
        setFormType('FEL');
        setCurrentId(null);
        toggleModal();
    };

    const handleViewClick = (id) => {
        setStep(1);
        setCurrentId(id);
        toggleViewModal();
    };

    const handleEditClick = (id) => {
        setStep(1);
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
        Services.infoPDF(id, async (err, res) => {
            if (!err) {
                const ingatlan = res;
                /*   console.log(ingatlan); */
                Font.register({
                    family: 'OpenSans-Regular',
                    src: `${process.env.staticUrl}/fonts/OpenSans-Regular.ttf`
                });
                const styles = StyleSheet.create({
                    pdftartalom: {
                        display: 'flex',
                        fontFamily: 'OpenSans-Regular',
                        /*  minHeight: '100%', */
                        /* maxHeight: '96%', */
                        padding: '2% 4%',
                        maxWidth: '100%'
                        /* border: '2px solid blue' */
                    },
                    pagebreak: {
                        clear: 'both',
                        breakBefore: 'always'
                    },
                    fejlec: {
                        display: 'flex',
                        flexWrap: 'wrap',
                        minWidth: '100%',
                        maxWidth: '100%',
                        minHeight: '70px',
                        maxHeight: '70px',
                        margin: '10px 0px'
                    },
                    fejleckep: {
                        width: '15%',
                        height: '100%'
                    },
                    fejlecadatok: {
                        opacity: 0.65,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        width: '35%',
                        fontSize: '9px',
                        height: '100%'
                    },
                    kozepso: {
                        display: 'block',
                        alignSelf: 'flex-end',
                        /* flexWrap: 'wrap',
                        minWidth: '20%',
                        maxWidth: '20%' */
                        width: '50%'
                    },
                    cim: {
                        fontWeight: 'extrabold',
                        fontSize: '20px',
                        textAlign: 'right',
                        marginBottom: '5px'
                    },
                    nevjegy: {
                        display: 'flex',
                        /* width: '100%', */
                        fontSize: '10px',
                        textAlign: 'right',
                        alignSelf: 'flex-end',
                        justifyContent: 'flex-end',
                        position: 'relative',
                        right: '20px'
                    },
                    nevjegykartya: {
                        display: 'inline-block'
                        /* padding: '10px 30px', */
                        /* border: '2px solid #3AD6C5' */
                    },
                    ikonosadat: {
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'right',
                        flexWrap: 'wrap',
                        width: '85%',
                        height: '15px'
                    },
                    ikonkep: {
                        width: '15px',
                        height: '15px',
                        margin: '0 5px 0 0'
                    },
                    kepekView: {
                        display: 'flex',
                        flexWrap: 'wrap',
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        padding: '15px 0px',
                        margin: 0,
                        borderTop: '1px solid #3AD6C5',
                        borderBottom: '1px solid #3AD6C5'
                    },
                    kepek: {
                        width: '33%',
                        height: '120px'
                    },
                    kepekBal: {
                        width: '32%',
                        marginRight: '1%',
                        height: '120px'
                    },
                    kepekJobb: {
                        width: '33%',
                        marginLeft: '1%',
                        height: '120px'
                    },
                    heading: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        padding: '10px 0px'
                        /*     borderBottom: '1px solid blue', */
                        /* marginBottom: '5px' */
                    },
                    normalText: {
                        fontSize: '11px'
                    },
                    em: {
                        fontStyle: 'bold'
                    },
                    table: {
                        width: '100%',
                        /*  borderWidth: 1, */
                        display: 'flex',
                        flexDirection: 'column',
                        marginVertical: 12
                    },
                    tableRow: {
                        display: 'flex',
                        flexDirection: 'row'
                    },
                    cell: {
                        fontSize: '11px',
                        /*  borderWidth: 1, */
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        textAlign: 'left',
                        flexWrap: 'wrap'
                    }
                });

                const Table = ({ children, col, th }) => (
                    <View style={styles.table} wrap={false}>
                        {children.map((row, ind) => (
                            <View key={ind} style={[styles.tableRow, th && ind === 0 ? styles.em : {}, { backgroundColor: ind % 2 === 0 ? 'rgba(58, 214, 197, 1)' : '#ffffff' }]}>
                                {row.map((cell, j) => (
                                    <View key={j} style={[styles.cell, { width: col[j], height: 40, padding: '2px' }]}>
                                        {typeof cell === 'string' || typeof cell === 'number' ? <Text>{cell}</Text> : cell}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                );

                /* console.log('INGATLAN: ', <View style={{ margin: '1%', padding: '10px', border: '2px solid blue', maxHeight: '98%' }} wrap={false} />); */
                console.log(ingatlan.loggedUser);
                const newPdf = (
                    <Document language="hu">
                        <Page style={styles.pdftartalom} size="A4">
                            <View style={{ margin: '1%', padding: '10px' }}>
                                <View style={styles.fejlec} fixed>
                                    <Image src={'/static/images/logo_uj.png'} style={styles.fejleckep} />
                                    <View style={styles.kozepso}>
                                        <View style={{ width: '100%' }}>
                                            <Text style={styles.cim}>Ingatlan adatlap</Text>
                                        </View>
                                        <View style={styles.nevjegy}>
                                            <Text>{ingatlan.loggedUser && ingatlan.loggedUser.nev}</Text>
                                            <View style={styles.ikonosadat}>
                                                <Image src={'/static/images/telikon.png'} style={styles.ikonkep} />
                                                <Text>{ingatlan.loggedUser && ingatlan.loggedUser.telszam}</Text>
                                            </View>
                                            <View style={styles.ikonosadat}>
                                                <Image src={'/static/images/emailikon.png'} style={styles.ikonkep} />
                                                <Text>{ingatlan.loggedUser && ingatlan.loggedUser.email}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.fejlecadatok}>
                                        <View>
                                            <Text>{ingatlan.cegadatok && ingatlan.cegadatok.nev}</Text>
                                            <View style={styles.ikonosadat}>
                                                <Image src={'/static/images/telikon.png'} style={styles.ikonkep} />
                                                <Text>{ingatlan.cegadatok && ingatlan.cegadatok.telefon}</Text>
                                            </View>
                                            <View style={styles.ikonosadat}>
                                                <Image src={'/static/images/emailikon.png'} style={styles.ikonkep} />
                                                <Text>{ingatlan.cegadatok && ingatlan.cegadatok.email}</Text>
                                            </View>
                                            <View style={styles.ikonosadat}>
                                                <Image src={'/static/images/cimikon.png'} style={styles.ikonkep} />
                                                <Text>{ingatlan.cegadatok && ingatlan.cegadatok.cim}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {/*<View>
                                    <Text style={styles.cim}>Ingatlan adatlap</Text>
                                </View>
                                <View style={styles.nevjegy}>
                                    <View style={styles.nevjegykartya}>
                                        <Text>{ingatlan.loggedUser && ingatlan.loggedUser.nev}</Text>
                                        <View style={styles.ikonosadat}>
                                            <Image src={'/static/images/telikon.png'} style={styles.ikonkep} />
                                            <Text>{ingatlan.loggedUser && ingatlan.loggedUser.telszam}</Text>
                                        </View>
                                        <View style={styles.ikonosadat}>
                                            <Image src={'/static/images/emailikon.png'} style={styles.ikonkep} />
                                            <Text>{ingatlan.loggedUser && ingatlan.loggedUser.email}</Text>
                                        </View>
                                    </View>
                                </View>*/}
                                <View>
                                    <Text style={styles.heading}>{ingatlan.cim}</Text>
                                </View>
                                {ingatlan.kepek && ingatlan.kepek[0] && (
                                    <View wrap style={styles.kepekView}>
                                        <Image style={styles.kepekBal} src={ingatlan && ingatlan.kepek && ingatlan.kepek[0].src} />
                                        {ingatlan.kepek[1] && <Image style={styles.kepek} src={ingatlan && ingatlan.kepek && ingatlan.kepek[1].src} />}
                                        {ingatlan.kepek[2] && <Image style={styles.kepekJobb} src={ingatlan && ingatlan.kepek && ingatlan.kepek[2].src} />}
                                    </View>
                                )}
                                <View>
                                    <Text style={styles.heading}>Leírás:</Text>
                                    <Text style={styles.normalText}>{ingatlan.leiras}</Text>
                                </View>
                                <View wrap={false}>
                                    <Table
                                        col={['16.66%', '16.66%', '16.66%', '16.66%', '16.66%', '16.66%']}
                                        children={[
                                            ['Státusza', `${ingatlan.statusz}`, 'Építés módja: ', `${ingatlan.epitesmod}`, 'Ingatlan típusa: ', `${ingatlan.tipus}`],
                                            [
                                                'Altípusa: ',
                                                `${ingatlan.altipus}`,
                                                'Település: ',
                                                `${ingatlan.telepules}`,
                                                'Rendeltetés: ',
                                                `${ingatlan.rendeltetes && ingatlan.rendeltetes !== '' ? ingatlan.rendeltetes : '-'}`
                                            ],
                                            [
                                                'Tetőtéri: ',
                                                `${ingatlan.isTetoter === true ? 'Igen' : 'Nem'}`,
                                                'Fűtés típusa: ',
                                                `${ingatlan.futes}`,
                                                'Alapterület: ',
                                                `${ingatlan.alapterulet && ingatlan.alapterulet !== '' ? ingatlan.alapterulet + ' m2' : ''}`
                                            ],
                                            ['Telek mérete: ', `${ingatlan.telek !== '' ? ingatlan.telek + ' m2' : '-'}`, '', ``, '', ``]
                                        ]}
                                    />
                                </View>
                            </View>
                        </Page>
                    </Document>
                );
                const newPdfBuffer = await pdf(newPdf).toBlob();
                const url = window.URL.createObjectURL(newPdfBuffer, { type: 'application/pdf' });
                window.open(url, '_blank');
            }
        });
        /*  Services.printPDF(id, async (err, res) => {
            if (!err) {
                const html = res.html;
                Font.register({
                    family: 'OpenSans-Regular',
                    src: `${process.env.staticUrl}/fonts/OpenSans-Regular.ttf`
                });
                const styles = StyleSheet.create({
                    pdftartalom: {
                        fontFamily: 'OpenSans-Regular',
                        maxHeight: '100%'
                    },
                    pagebreak: {
                        clear: 'both',
                        breakBefore: 'always'
                    }
                });
                const newPdf = (
                    <Document language="hu">
                        <Page style={styles.pdftartalom} size="A4" break>
                            <Html>{html}</Html>
                            <View style={styles.pagebreak} break />
                            <Html>{html}</Html>
                        </Page>
                    </Document>
                );
                const newPdfBuffer = await pdf(newPdf).toBlob();
                const url = window.URL.createObjectURL(newPdfBuffer, { type: 'application/pdf' });
                window.open(url, '_blank');
            }
        }); */
    };

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

    const renderViewKepek = () => {
        return (
            <Modal isOpen={viewKepek} toggle={toggleViewKepek} size="xl" backdrop="static">
                <ModalBody>
                    <div className="row">
                        {ingView &&
                            ingView.kepek &&
                            ingView.kepek.map((kep, index) => {
                                return (
                                    <div className={`col-md-3 mb-2`} key={index.toString()}>
                                        <img width="100%" height="150px" src={kep.src} alt={kep.alt} />
                                    </div>
                                );
                            })}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="secondary" onClick={toggleViewKepek}>
                        OK
                    </Button>
                </ModalFooter>
            </Modal>
        );
    };

    const renderViewModal = () => {
        return (
            <Modal isOpen={viewModal} toggle={toggleViewModal} size="xl" backdrop="static">
                <ModalHeader>Megtekintés</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">{`Hirdető iroda: ${ingView.office_id === 1 ? 'Zalaegerszeg' : 'Zalaegerszeg'}`}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">{`Hirdető neve: ${ingView.hirdeto && ingView.hirdeto.feladoNev}`}</div>
                        <div className="col-md-4">{`Hirdető e-mail: ${ingView.hirdeto && ingView.hirdeto.feladoEmail}`}</div>
                        <div className="col-md-4">{`Hirdető telefon: ${ingView.hirdeto && ingView.hirdeto.feladoTelefon}`}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">{`Ingatlan címe: ${ingView.cim}`}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">{`Ingatlan refid: ${ingView.refid}`}</div>
                        <div className="col-md-4">{`ID: ${ingView.id}`}</div>
                        <div className="col-md-4">{`Státusz: ${ingView.statusz}`}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">{`Típus: ${tipusFormatter(null, ingView)}`}</div>
                        <div className="col-md-4">{`Altípus: ${ingView.altipus}`}</div>
                        <div className="col-md-4">{`Rendeltetés: ${ingView.rendeltetes && ingView.rendeltetes !== '' ? ingView.rendeltetes : '-'}`}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">{`Település: ${ingView.telepules}`}</div>
                        <div className="col-md-3">{`Ár: ${ingView.ar} ${ingView.penznem}`}</div>
                        <div className="col-md-3" hidden={!ingView.kaucio || ingView.kaucio === ''}>{`Kaucio: ${ingView.kaucio}`}</div>
                        <div className="col-md-3" hidden={!ingView.emelet || ingView.emelet === ''}>{`Emelet: ${ingView.emelet}`}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">{`Leírás:`}</div>
                        <div className="col-md-12">{`${ingView.leiras}`}</div>
                    </div>
                    <div className="row" hidden={!ingView.szobaszam || ingView.szobaszam === ''}>
                        <div className="col-md-3">{`Szobaszám: ${ingView.szobaszam}`}</div>
                        <div className="col-md-3">{`Félszobaszám: ${ingView.felszobaszam}`}</div>
                    </div>
                    <div className="row" hidden={!ingView.telek || ingView.telek === ''}>
                        <div className="col-md-3">{`Víz: ${ingView.viz}`}</div>
                        <div className="col-md-3">{`Gáz: ${ingView.gaz}`}</div>
                        <div className="col-md-3">{`Villany: ${ingView.villany}`}</div>
                        <div className="col-md-3">{`Szennyvíz: ${ingView.szennyviz}`}</div>
                    </div>
                    <div className="row" hidden={!ingView.telek || ingView.telek === ''}>
                        <div className="col-md-4">{`Telek mérete: ${ingView.telek} m2`}</div>
                        <div className="col-md-4">{`Telektípus: ${ingView.telektipus}`}</div>
                        <div className="col-md-4">{`Beépíthetőség: ${ingView.beepithetoseg}%`}</div>
                    </div>
                    <div className="row" hidden={!ingView.futes && ingView.futes === '' && !ingView.epitesmod && ingView.epitesmod === ''}>
                        <div className="col-md-6" hidden={!ingView.epitesmod && ingView.epitesmod === ''}>{`Építés módja: ${ingView.epitesmod}`}</div>
                        <div className="col-md-6" hidden={!ingView.futes && ingView.futes === ''}>{`Fűtés módja: ${ingView.futes}`}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">{`Publikus: ${ingView.isAktiv === true ? 'Igen' : 'Nem'}`}</div>
                        <div className="col-md-3">{`Erkélyes: ${ingView.isErkely === true ? 'Igen' : 'Nem'}`}</div>
                        <div className="col-md-3">{`Hirdethető: ${ingView.isHirdetheto === true ? 'Igen' : 'Nem'}`}</div>
                        <div className="col-md-3">{`Kiemelt: ${ingView.isKiemelt === true ? 'Igen' : 'Nem'}`}</div>
                        <div className="col-md-3">{`Lift: ${ingView.isAktiv === true ? 'Van' : 'Nincs'}`}</div>
                        <div className="col-md-3">{`Tetőtéri: ${ingView.isAktiv === true ? 'Igen' : 'Nem'}`}</div>
                        <div className="col-md-3">{`VIP: ${ingView.isAktiv === true ? 'Igen' : 'Nem'}`}</div>
                        <div className="col-md-3">{`Újépítésű: ${ingView.isAktiv === true ? 'Igen' : 'Nem'}`}</div>
                    </div>
                    <Button color="success" onClick={toggleViewKepek}>
                        Képek megjelenitése
                    </Button>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" onClick={toggleViewModal} color="secondary">
                        OK
                    </Button>
                </ModalFooter>
            </Modal>
        );
    };

    const sendMail = (ingatlanId, isAktiv, publikusChange, isNew) => {
        if (!hasRole(user.roles, ['SZUPER_ADMIN'])) {
            Services.jovahagyasraKuldes(ingatlanId, isAktiv, publikusChange, isNew, (err, res) => {
                if (!err) {
                    addNotification('success', res.msg);
                } else {
                    addNotification(
                        'error',
                        'Valami hiba történt a jóváhagyásra küldéskor! Kérjük Próbál meg újra a jóváhagyásr küldést a "Jóvágyásra küldés gombbal! Ha ez sem működik, kérlek érteítsd a rendszergazdát!" '
                    );
                }
            });
        }
    };

    const tableIconFormatter = (cell, row) => {
        return (
            <React.Fragment>
                {(hasRole(user.roles, ['SZUPER_ADMIN']) || (hasRole(user.roles, ['INGATLAN_ADMIN']) && user.email === row.hirdeto.feladoEmail)) && (
                    <React.Fragment>
                        <Button
                            type="button"
                            key={row.id + 1}
                            color="link"
                            onClick={() => {
                                handleViewClick(row.id);
                                getIngatlan(row.id);
                            }}
                        >
                            <i className="fas fa-eye" />
                        </Button>
                        <Button type="button" key={row.id + 2} color="link" onClick={() => handleEditClick(row.id)}>
                            <i className="fas fa-pencil" />
                        </Button>
                    </React.Fragment>
                )}
                {!hasRole(user.roles, ['SZUPER_ADMIN']) && user.email === row.hirdeto.feladoEmail && (
                    <Button type="button" color="link" key={row.id + 3} onClick={() => sendMail(row.id, row.isAktiv, true, false)}>
                        <i className="fas fa-user-check" />
                    </Button>
                )}
                <Button
                    key={row.id + 4}
                    type="button"
                    color="link"
                    onClick={() => {
                        openFacebookShare(`https://www.facebook.com/sharer/sharer.php?u=${process.env.shareUrl + row.id}`, 'Megosztás facebookon', 800, 800);
                    }}
                >
                    <i className="fa fa-facebook-square" />
                </Button>
                {(hasRole(user.roles, ['INGATLAN_ADMIN']) || user.roles.find((role) => role.value === 'INGATLAN_OSSZ_LEK') === undefined) && (
                    <Button type="button" key={row.id + 5} color="link" onClick={() => printAjanloPDF(row.id)}>
                        <i className="fas fa-file-pdf" />
                    </Button>
                )}
                {(hasRole(user.roles, ['SZUPER_ADMIN']) || (hasRole(user.roles, ['INGATLAN_ADMIN']) && user.email === row.hirdeto.feladoEmail)) && (
                    <Button type="button" key={row.id + 6} color="link" onClick={() => handleDeleteClick(row.id)}>
                        <i className="fas fa-trash" />
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
                    if (opt.value == row.tipus) {
                        tipus = opt.nev;
                    }
                });
            }
        });
        return tipus;
    };

    const arFormatter = (cell, row) => {
        let ar = row.ar + '';
        ar = ar + ' ' + row.penznem;
        return ar;
    };

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
                formatter: (cell, row) => tipusFormatter(cell, row)
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
                    setStep={setStep}
                    step={step}
                    maxStep={maxStep}
                    formType={formType}
                    listIngatlanok={listIngatlanok}
                    toggleModal={toggleModal}
                    nevFormatter={nevFormatter}
                    telefonFormatter={telefonFormatter}
                    ingatlanok={ingatlanokJson}
                    {...props}
                />
            </Modal>
        );
    };

    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };

    const deleteIngatlan = () => {
        Services.deleteIngatlan(currentId, (err, res) => {
            if (!err) {
                toggleDeleteModal();
                setCurrentId(null);
                listIngatlanok();
                addNotification('success', res.msg);
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
                {renderViewModal()}
                {renderViewKepek()}
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
