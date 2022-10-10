import express from 'express';
import multer from 'multer';
import { jwtparams, pool, validateToken, createIngatlanokSql, createIngatlanokTriggerSql, hasRole, getJSONfromLongtext, isTableExists, getId } from '../../../common/QueryHelpers.js';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { addIngatlan, editIngatlan } from '../../../schemas/IngatlanSchema.js';

const router = express.Router();
const ingatlanok = pool;

//TODO: Egyéb (nem publikus) dokumentumok, képek feltöltését megvalósítani!!!

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        let id = await getId(req.headers.id, 'ingatlanok');
        const dir = `${process.env.ingatlankepekdir}/${id}/`;
        let exist = existsSync(dir);
        if (!exist) {
            mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); //Appending .jpg
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
            if (id) {
                const sql = `SELECT * FROM ingatlanok WHERE id='${id}';`;
                ingatlanok.query(sql, (err, result) => {
                    if (!err) {
                        let ressss = result.map((ing) => {
                            return getJSONfromLongtext(ing, 'toBool');
                        });
                        res.status(200).send(ressss);
                    } else {
                        res.status(500).send({ err: err });
                    }
                });
            } else {
                const sql = `SELECT id, refid, office_id, cim, leiras, helyseg, irsz, telepules, altipus, rendeltetes, hirdeto, ar, kepek, kaucio, penznem, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, rogzitIdo, hirdeto
                FROM ingatlanok`;
                ingatlanok.query(sql, (err, result) => {
                    if (!err) {
                        let ressss = result.map((ing) => {
                            return getJSONfromLongtext(ing, 'toBool');
                        });
                        res.status(200).send(ressss);
                    } else {
                        res.status(500).send({ err: err });
                    }
                });
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
                const image = `${process.env.ingatlankepekdir}/${ingatlanId}/${filename}`;
                rmSync(image, {
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
                return editIngatlan(req, res);
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
                if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                    const sql = `DELETE FROM ingatlanok WHERE id='${id}';`;
                    // const sql = `DELETE FROM ingatlanok WHERE id='${id}' AND email='${user.email}';`;
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
            } else {
                res.status(400).send({ err: 'Id megadása kötelező' });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

// INGATLANOK END

export default router;
