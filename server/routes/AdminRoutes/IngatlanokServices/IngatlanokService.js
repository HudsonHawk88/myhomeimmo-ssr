import express from 'express';
import multer from 'multer';
import {
    jwtparams,
    pool,
    mailUrl,
    validateToken,
    createIngatlanokSql,
    createIngatlanokTriggerSql,
    hasRole,
    getJSONfromLongtext,
    isTableExists,
    stringToBool,
    UseQuery,
    getChangedField,
    renderValtozatasok,
    log
} from '../../../common/QueryHelpers.js';
import { existsSync, mkdirSync, rmSync, readFileSync } from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';

import { addIngatlan, editIngatlan } from '../../../schemas/IngatlanSchema.js';
import moment from 'moment';

const router = express.Router();
const ingatlanok = pool;
const transporter = nodemailer.createTransport(mailUrl);

//TODO: Egyéb (nem publikus) dokumentumok, képek feltöltését megvalósítani!!!

/* const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        let id = await getId(req.headers.id, 'ingatlanok');
        const dir = `${process.env.ingatlankepekdir}/${id}`;
        let exist = existsSync(dir);

        if (!exist) {
            mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        let extIndex = file.originalname.lastIndexOf('.');
        let fname = file.originalname.substring(0, extIndex);
        const ref = `${fname}.jpg`;

        cb(null, ref); //Appending .jpg
    }
}); */

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// INGATLANOK START

router.get('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const id = req.headers.id;
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                let resArr = [];
                if (id) {
                    const sql = `SELECT * FROM ingatlanok WHERE id='${id}';`;
                    ingatlanok.query(sql, (err, result) => {
                        if (!err) {
                            result.find((ing) => {
                                const ingg = getJSONfromLongtext(ing, 'toBool');
                                if ((ingg.hirdeto.feladoEmail === user.email && ingg.id === parseInt(id, 10)) || hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                                    resArr.push(ingg);
                                }
                                /*  console.log('MODIDO: ', ingg.modIdo);
                                ing.modIdo = moment(ing.modIdo).locale('hu'); */
                            });
                            if (resArr) {
                                res.status(200).send(resArr);
                            } else {
                                res.status(401).send({ err: 'Nincs jogosultsága az adott művelethez!' });
                            }
                        } else {
                            res.status(500).send({ err: err });
                        }
                    });
                } else {
                    const sql = `SELECT id, refid, office_id, cim, leiras, helyseg, irsz, telepules, altipus, rendeltetes, hirdeto, ar, kepek, kaucio, penznem, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, villanyfogy, gazfogy, etanusitvany, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, isTetoter, isVip, rogzitIdo, modIdo, modUser, hirdeto, jutalek, megbizaskelte, megbizasvege, nempubmegjegyzes, nempubcsatolmanyok
                    FROM ingatlanok ORDER BY rogzitIdo DESC`;
                    ingatlanok.query(sql, (err, result) => {
                        if (!err) {
                            let ressss = result.filter((ing) => {
                                const ingg = getJSONfromLongtext(ing, 'toBool');
                                if (ingg.hirdeto.feladoEmail === user.email || hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_OSSZ_LEK'])) {
                                    return getJSONfromLongtext(ing, 'toBool');
                                }
                            });
                            if (ressss && Array.isArray(ressss)) {
                                const resArr = ressss.map((r) => {
                                    return getJSONfromLongtext(r);
                                });
                                res.status(200).send(resArr);
                            }
                        } else {
                            res.status(500).send({ err: err });
                        }
                    });
                }
            } else {
                res.status(401).send({ err: 'Nincs jogosultsága az adott művelethez!' });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

router.post('/deletefile', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        const ingId = req.headers.id;
        const dir = req.headers.dir;
        const { filename } = req.body;

        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                const file = `${process.env.ingatlankepekdir}/${ingId}/${dir}/${filename}`;
                rmSync(file, {
                    force: true
                });

                res.status(200).send({ err: null, msg: 'File sikeresen törölve!' });
            } else {
                res.status(401).send({ err: 'Nincs jogosultsága az adott művelethez!' });
            }
        }
    }
});

router.post('/deleteimage', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        const ingatlanId = req.headers.id;
        const { filename } = req.body;

        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                let extIndex = filename.lastIndexOf('.');
                let fname = filename.substring(0, extIndex);
                const image = `${process.env.ingatlankepekdir}/${ingatlanId}/${fname}.jpg`;
                const imageIcon = `${process.env.ingatlankepekdir}/${ingatlanId}/${fname}_icon.jpg`;
                rmSync(image, {
                    force: true
                });
                rmSync(imageIcon, {
                    force: true
                });
                res.status(200).send({ err: null, msg: 'Kép sikeresen törölve!' });
            } else {
                res.status(401).send({ err: 'Nincs jogosultsága az adott művelethez!' });
            }
        }
    }
});

router.post('/', upload.any(), async (req, res) => {
    const token = req.cookies.JWT_TOKEN;

    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                const isExist = await isTableExists('ingatlanok');
                if (!isExist) {
                    ingatlanok.query(createIngatlanokSql, (errr) => {
                        if (!errr) {
                            ingatlanok.query(createIngatlanokTriggerSql, async (eee) => {
                                if (!eee) {
                                    /*  uploadIco.array('kepek'); */
                                    return addIngatlan(req, res);
                                } else {
                                    log('POST /api/admin/ingatlanok', eee);
                                }
                            });
                        } else {
                            log('POST /api/admin/ingatlanok', errr);
                            res.status(500).send({ err: errr });
                        }
                    });
                } else {
                    return addIngatlan(req, res);
                }
            } else {
                res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

router.put('/', upload.any(), async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        let nev = JSON.parse(user.nev);
        const teljesNev = `${nev.titulus && nev.titulus + ' '} ${nev.vezeteknev} ${nev.keresztnev}`;
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                return editIngatlan(req, res, user, teljesNev);
            } else {
                res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

router.delete('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            // TODO: hozzáadni a feltöltő regisztrált usert is a jogosultakhoz!!!
            const id = req.headers.id;
            if (id) {
                if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                    const getIngatlanSql = `SELECT id, hirdeto FROM ingatlanok WHERE id='${id}';`;
                    let ingatlan = await UseQuery(getIngatlanSql);
                    ingatlan = getJSONfromLongtext(ingatlan, 'toBool');
                    const sql = `DELETE FROM ingatlanok WHERE id='${id}';`;
                    if (
                        (ingatlan && ingatlan[0].hirdeto && ingatlan[0].hirdeto.feladoEmail === user.email && ingatlan[0].id === parseInt(id, 10)) ||
                        hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])
                    ) {
                        ingatlanok.query(sql, (err) => {
                            if (!err) {
                                const dir = `${process.env.ingatlankepekdir}/${id}/`;
                                rmSync(dir, { recursive: true, force: true });
                                res.status(200).send({ msg: 'Ingatlan sikeresen törölve!' });
                            } else {
                                res.status(500).send({ err: 'Ingatlan törlése sikertelen!' });
                            }
                        });
                    } else {
                        res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
                    }
                    // const sql = `DELETE FROM ingatlanok WHERE id='${id}' AND email='${user.email}';`;
                } else {
                    res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
                }
            } else {
                res.status(400).send({ err: 'Id megadása kötelező' });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

// INGATLAN JOVAHAGYASA

router.post('/jovahagyas', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        const adatok = req.body.adatok;
        console.log(req.body.adatok);
        const modositoObj = getJSONfromLongtext(adatok.modositoObj, 'toNumber');
        const regiIng = getJSONfromLongtext(adatok.regiIngatlan, 'toNumber');
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (!hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN']) && user.isErtekesito) {
                /* const ingatlanId = req.headers.ingatlanId; */
                const ingId = req.headers.ingatlanid;
                const isPublikus = stringToBool(req.headers.isaktiv);
                const publikusChange = stringToBool(req.headers.publikuschange);
                const isNew = stringToBool(req.headers.isnew);
                let nev = JSON.parse(user.nev);
                const teljesNev = `${nev.titulus && nev.titulus + ' '} ${nev.vezeteknev} ${nev.keresztnev}`;
                /*                 let oldIng = await UseQuery(`SELECT * FROM ingatlanok WHERE id = '${ingId}';`);
                oldIng = getJSONfromLongtext(oldIng[0], 'toNumber'); */
                const changedFields = getChangedField(modositoObj, regiIng);
                const mail = {
                    from: `${teljesNev} <${user.email}>`, // sender address
                    to: `${process.env.foEmail}`, // list of receivers
                    subject: `${teljesNev} - ${publikusChange ? 'Láthatóság megváltoztatása' : !isNew ? 'Módosított ingatlan' : 'Új ingatlan'}`, // Subject line
                    html: publikusChange
                        ? `<b>Kedves ${process.env.foNev}!</b><br><br>
                    ${teljesNev} ingatlanértékesítő szeretné ${isPublikus ? ' inaktívvá ' : ' publikussá '} tenni az ingatlanját. Az ingatlan id-je: ${
                              ingId ? ingId : 'Nincs id, valami hiba van...'
                          }<br><br>
                          Tisztelettel:<br>
                          ${teljesNev}`
                        : `<b>Kedves ${process.env.foNev}!</b><br><br>
                    ${teljesNev} ingatlanértékesítő ${isNew ? 'felvitt egy új ingatlant' : 'módosította az ingatlanját'} Az ingatlan id-je: ${ingId ? ingId : 'Nincs id, valami hiba van...'}<br><br>
                    ${
                        !isNew && modositoObj && publikusChange === false
                            ? `Az alábbi dolgok módosultak: <br>
                    <ul>
                    ${renderValtozatasok(changedFields)}
                    </ul>`
                            : ''
                    }
                   
                    Tisztelettel:<br>
                    ${teljesNev}`
                };

                transporter.sendMail(mail, (err) => {
                    if (!err) {
                        res.status(200).send({ msg: 'E-mail sikeresen elküldve!' });
                    } else {
                        /* console.log(mailconf);
                    console.log(err); */
                        log('POST /api/admin/ingatlanok', err);
                        res.status(500).send({ err: err, msg: 'Email küldése sikertelen!' });
                    }
                });
            } else {
                res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

const renderKepek = (kepek) => {
    let str = '';
    if (kepek && kepek.length > 0) {
        kepek.forEach((kep, index) => {
            /* if (index < 3) { */
            if (index < 3) {
                str = str.concat(`<img class="ingkepek" key="${kep.filename}" src="${kep.src}" alt="${kep.filename}" />`);
            }
        });
    }

    return str;
};

const getNemUresFields = (ertek) => {
    let hidden = false;
    if (ertek === '' || ertek === 0) {
        hidden = true;
    }
    return hidden;
};

const isTelekAdatokHidden = (ingatlan) => {
    let isHidden = true;
    if (ingatlan) {
        if (ingatlan.tipus === 2 || ingatlan.tipus === 3 || ingatlan.tipus === 6 || ingatlan.tipus === 13 || ingatlan.tipus === 10) {
            isHidden = false;
        }
    }

    return isHidden;
};

const tipusFormatter = (ingatlanOptions, type) => {
    let tipus = ``;
    ingatlanOptions.forEach((option) => {
        if (option.value + '' === type + '') {
            tipus = option.nev;
        }
    });
    return tipus;
};

const altipusFormatter = (altipusOptions, tipus, subtype) => {
    let altipus = ``;
    altipusOptions.forEach((option) => {
        const tipus_id = option.tipus_id + '';
        if (tipus_id + '' === tipus) {
            if (option.value === subtype || parseInt(option.value, 10) === subtype) {
                altipus = option.nev;
            }
        }
    });
    return altipus;
};

// INGATLAN PDF AJANLO GENEÁLÁS

router.post('/infoPDF', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            const ingatlanId = req.headers.ingatlanid;
            const ingatlanSql = `SELECT * FROM ingatlanok WHERE id='${ingatlanId}';`;
            const cegadatSql = `SELECT nev, cim, email, telefon FROM kapcsolat WHERE id='1';`;
            let ingatlan = await UseQuery(ingatlanSql);
            let cegadatok = await UseQuery(cegadatSql);
            // USER ADATOK
            let nev = JSON.parse(user.nev);
            const teljesNev = `${nev.titulus && nev.titulus + ' '} ${nev.vezeteknev} ${nev.keresztnev}`;
            let telszam = JSON.parse(user.telefon);
            telszam = `${telszam.orszaghivo}-${telszam.korzet}/${telszam.telszam}`;
            const email = user.email;
            const loggedUser = { nev: teljesNev, telszam: telszam, email: email };
            ingatlan = getJSONfromLongtext(ingatlan[0], 'toBool');
            cegadatok = getJSONfromLongtext(cegadatok[0], 'toBool');

            // INGATLANADATOK
            /*   const elsokepek = ingatlan && ingatlan[0].kepek && ingatlan[0].kepek.filter((kep, index) => index < 4); */
            /*   const alaprajz = ingatlan && ingatlan[0].kepek && ingatlan[0].kepek.map((kep) => kep.filename.includes('alaprajz')); */
            const sendObj = Object.assign({}, ingatlan, { cegadatok }, { loggedUser });

            if (ingatlan && cegadatok && loggedUser) {
                res.status(200).send(sendObj);
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

// INGATLANOK END

export default router;
