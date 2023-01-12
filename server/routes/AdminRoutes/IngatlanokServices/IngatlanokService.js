import express from 'express';
import multer from 'multer';
import { jwtparams, pool, validateToken, createIngatlanokSql, createIngatlanokTriggerSql, hasRole, getJSONfromLongtext, isTableExists, getId, UseQuery } from '../../../common/QueryHelpers.js';
import { existsSync, mkdirSync, rmSync } from 'fs';
import nodemailer from 'nodemailer';

import { addIngatlan, editIngatlan } from '../../../schemas/IngatlanSchema.js';
import mailconf from '../../common/MailerService/mailconfig.json';

const router = express.Router();
const ingatlanok = pool;
const transporter = nodemailer.createTransport(mailconf);

//TODO: Egyéb (nem publikus) dokumentumok, képek feltöltését megvalósítani!!!

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        let id = await getId(req.headers.id, 'ingatlanok');
        const dir = `${process.env.ingatlankepekdir}/${id}`;
        let exist = existsSync(dir);

        if (!exist) {
            mkdirSync(dir);
        }
        /*  console.log(req.file); */
        /*  const fname = file.filename.split('.').slice(0, -1).join('.'); */
        /*     sharp(file).resize(250, 200).toFile(`${process.env.ingatlankepekdir}/${id}/${fname}_icon.jpg`);
        sharp(file).jpeg({ quality: 80 }).resize(2500, 1500).toFile(`${process.env.ingatlankepekdir}/${id}/${fname}.jpg`); */
        cb(null, dir);
    },
    /*  imageOptions: {
        fileFormat: 'webp',
        quality: 80
    }, */
    /* imageOptions: {
        fileFormat: 'jpg',
        quality: 60,
        resize: {
            width: 2500,
            height: 1500,
            resizeMode: 'inside'
        }
    } */
    filename: function (req, file, cb) {
        let extIndex = file.originalname.lastIndexOf('.');
        let fname = file.originalname.substring(0, extIndex);
        const ref = `${fname}.jpg`;

        cb(null, ref); //Appending .jpg
    }
});

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
                    const sql = `SELECT id, refid, office_id, cim, leiras, helyseg, irsz, telepules, altipus, rendeltetes, hirdeto, ar, kepek, kaucio, penznem, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, isTetoter, rogzitIdo, hirdeto
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

router.post('/', upload.array('kepek'), async (req, res) => {
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
                                    console.log('NOK');
                                }
                            });
                        } else {
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

router.put('/', upload.array('uj_kepek'), async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                return editIngatlan(req, res, user);
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
                        hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])
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
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            console.log(JSON.parse(JSON.stringify(user.roles)));
            if (!hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN']) && user.isErtekesito) {
                const { ingatlanId } = req.body;
                console.log(ingatlanId)
                let nev = JSON.parse(user.nev);
                const teljesNev = `${nev.titulus && nev.titulus + ' '} ${nev.vezeteknev} ${nev.keresztnev}`;
                console.log(typeof process.env.foEmail);
                console.log(process.env.foEmail)
                transporter.sendMail(
                {
                    from: `${teljesNev} <${user.email}>`, // sender address
                    to: process.env.foEmail, // list of receivers
                    subject: `${teljesNev} - új ingatlan`, // Subject line
                    html: `<b>Kedves Berki Mónika!</b><br><br>
                    ${teljesNev} ingatlanértékesítő új ingatlant adott hozzá. Az ingatlan id-je: ${ingatlanId}<br>
                    Tisztelettel:<br>
                    ${teljesNev}<br>` // html body
                },
                (err) => {
                    if (!err) {
                        res.status(200).send({ msg: 'E-mail sikeresen elküldve!' });
                        transporter.close();
                    } else {
                        res.status(500).send({ err: err, msg: 'Email küldése sikertelen!' });
                    }
                }
            );
            } else {
                res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

// INGATLANOK END

export default router;
