import { jwtparams, UseQuery, pool, validateToken, hasRole, getId, getJSONfromLongtext } from '../../../common/QueryHelpers.js';
import express from 'express';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import multer from 'multer';
import sharp from 'sharp';
import { getInsertSql, getUpdateScript } from '../../../common/QueryHelpers';
const router = express.Router();
const projektek = pool;

/* const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        if (file) {
            const id = await getId(req.headers.id, 'projektek');
            const dir = `${process.env.avatardir}/${id}/`;
            let exist = existsSync(dir);
            if (!exist) {
                mkdirSync(dir);
            }
            cb(null, dir);
        }
    },
    filename: function (req, file, cb) {
        if (file) {
            cb(null, file.originalname); //Appending .jpg
        }
    }
}); */

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const keys = [
    'id',
    'nev',
    'leiras',
    'borito',
    'projektlakaskepek',
    'utem',
    'szlogen',
    'felirat',
    'bemutatvideo',
    'cim',
    'atadasev',
    'atadasnegyedev',
    'atadashonap',
    'osszlakasszam',
    'szabadlakasszam',
    'ingtipus',
    'elsodlegesfutes',
    'masodlagosfutes',
    'harmadlagosfutes',
    'parkolotipus',
    'parkolohasznalat',
    'parkoloarmill',
    'isTobbEpuletes',
    'komfort',
    'epuletszintek',
    'isLift',
    'tarolohasznalat',
    'isAkadalymentes',
    'isLegkondicionalt',
    'isZoldOtthon',
    'energetika',
    'isNapelemes',
    'isSzigetelt',
    'szigetelesmeret'
];

const objectKeys = ['borito', 'projektlakaskepek', 'cim', 'epuletszintek'];

// PROJEKTEK START

router.get('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const id = req.headers.id;
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (id) {
                const sql = `SELECT * FROM projektek WHERE id='${id}';`;
                projektek.query(sql, (err, result) => {
                    if (!err) {
                        if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                            const resss = getJSONfromLongtext(result[0], 'toBool');
                            res.status(200).send(resss);
                        } else {
                            res.status(403).send({
                                err: 'Nincs jogosultsága az adott művelethez!'
                            });
                        }
                    }
                });
            } else {
                const sql = `SELECT nev, cim, atadev, osszlakasszam, szabadlakasszam, ingtipus, isZoldOtthon, energetika, isNapelemes, isSzigetelt FROM projektek;`;
                projektek.query(sql, (error, ress) => {
                    if (error) {
                        res.status(500).send({ err: 'Hiba történt a projektek lekérdezésekor!' });
                    } else {
                        let resss = ress.map((item) => {
                            return getJSONfromLongtext(item, 'toBool');
                        });
                        res.status(200).send(resss);
                    }
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.post('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                let felvitelObj = req.body;
                const sql = `CREATE TABLE IF NOT EXISTS eobgycvo_myhome.projektek (
                id int NOT NULL PRIMARY KEY,
                nev text NOT NULL DEFAULT '',
                leiras text NOT NULL DEFAULT '',
                borito json NOT NULL DEFAULT '{}',
                projektlakaskepek json NOT NULL DEFAULT '[]',
                utem int DEFAULT NULL,
                szlogen text DEFAULT NULL,
                felirat text DEFAULT NULL,
                bemutatvideo text DEFAULT NULL,
                cim json NOT NULL DEFAULT '{}',
                atadasev YEAR(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                atadasnegyedev int NOT NULL DEFAULT 1,
                atadashonap int NOT NULL DEFAULT 1,
                osszlakasszam int NOT NULL DEFAULT 1,
                szabadlakasszam int NOT NULL DEFAULT 1,
                ingtipus text NOT NULL DEFAULT '',
                elsodlegesfutes text NOT NULL DEFAULT '',
                masodlagosfutes text DEFAULT NULL,
                harmadlagosfutes text DEFAULT NULL,
                parkolotipus text NOT NULL DEFAULT '',
                parkolohasznalat text NOT NULL DEFAULT '',
                parkoloarmill text DEFAULT '',
                isTobbEpuletes boolean DEFAULT 0,
                komfort text DEFAULT '',
                epuletszintek json DEFAULT NULL,
                isLift boolean DEFAULT 0,
                tarolohasznalat text DEFAULT '',
                isAkadalymentes boolean DEFAULT 0,
                isLegkondicionalt boolean DEFAULT 0,
                isZoldOtthon boolean DEFAULT 0,
                energetika text(2) DEFAULT '',
                isNapelemes boolean DEFAULT 0,
                isSzigetelt boolean DEFAULT 0,
                szigetelesmeret int DEFAULT NULL
                ) ENGINE=InnoDB;`;
                projektek.query(sql, async (error) => {
                    if (!error) {
                        felvitelObj = getJSONfromLongtext(felvitelObj, 'toNumber');
                        let id = await getId(req.headers.id, 'projektek');
                        felvitelObj.id = id;

                        /* const keys = Object.keys(felvitelObj); */

                        const sql = getInsertSql('projektek', keys, felvitelObj, objectKeys);
                        projektek.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Projekt sikeresen hozzáadva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: err
                                });
                            }
                        });
                    } else {
                        res.status(500).send({
                            err: error,
                            msg: 'Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!'
                        });
                    }
                });
            } else {
                res.status(403).send({
                    err: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.put('/', upload.array('uj_avatar'), async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            const id = req.headers.id;
            let modositoObj = req.body;
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                if (id) {
                    const sql = getUpdateScript('projektek', { id: id }, modositoObj);
                    projektek.query(sql, (err) => {
                        if (!err) {
                            res.status(200).send({
                                msg: 'Projekt sikeresen módosítva!'
                            });
                        } else {
                            res.status(500).send({
                                err: 'Projekt módosítása sikertelen!',
                                msg: err
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        err: 'Id megadása kötelező'
                    });
                }
            } else {
                res.status(403).send({
                    err: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.delete('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    const id = req.headers.id;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                if (id) {
                    const sql = `DELETE FROM projektek WHERE id='${id}';`;
                    projektek.query(sql, (err) => {
                        if (!err) {
                            /*  const dir = `${process.env.avatardir}/${id}/`;
                            rmSync(dir, { recursive: true, force: true }); */
                            res.status(200).send({
                                msg: 'Projekt sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: 'Projekt törlése sikertelen!'
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        err: 'Id megadása kötelező'
                    });
                }
            } else {
                res.status(403).send({
                    err: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.post('/deleteimage', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        const projektId = req.headers.id;
        const { filename } = req.body;

        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                /*  const image = `${process.env.avatardir}/${projektId}/${filename}`;
                rmSync(image, {
                    force: true
                }); */
                res.status(200).send({ err: null, msg: 'Kép sikeresen törölve!' });
            } else {
                res.status(401).send({ err: 'Nincs jogosultsága az adott művelethez!' });
            }
        }
    }
});

// PROJEKTEK END

export default router;
