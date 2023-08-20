import { jwtparams, UseQuery, pool, validateToken, hasRole, getId, getJSONfromLongtext } from '../../../common/QueryHelpers.js';
import express from 'express';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import multer from 'multer';
import sharp from 'sharp';
import { getInsertSql, getUpdateScript, log } from '../../../common/QueryHelpers';
const router = express.Router();
const projektek = pool;

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const keys = [
    'id',
    'nev',
    'leiras',
    'beruhazo',
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
    'jutalek',
    'megbizaskelte',
    'megbizasvege',
    'nempubmegjegyzes',
    'nempubcsatolmasnyok',
    'epuletszintek',
    'projektingatlanok',
    'penznem',
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

const objectKeys = ['borito', 'beruhazo', 'projektlakaskepek', 'cim', 'epuletszintek', 'projektingatlanok'];

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
                const sql = `SELECT id, nev, cim, atadasev, osszlakasszam, szabadlakasszam, ingtipus, isZoldOtthon, energetika, isNapelemes, isSzigetelt FROM projektek;`;
                projektek.query(sql, (error, ress) => {
                    if (error) {
                        res.status(500).send({ err: error, msg: 'Hiba történt a projektek lekérdezésekor!' });
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

router.post('/', upload.any(), async (req, res) => {
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
                const sql = `CREATE TABLE IF NOT EXISTS myhomeimmo.projektek (
                id int NOT NULL PRIMARY KEY,
                nev text NOT NULL DEFAULT '',
                leiras text NOT NULL DEFAULT '',
                borito json NOT NULL,
                beruhazo json NOT NULL,
                projektlakaskepek json NOT NULL,
                utem int DEFAULT NULL,
                szlogen text DEFAULT NULL,
                felirat text DEFAULT NULL,
                bemutatvideo text DEFAULT NULL,
                cim json NOT NULL,
                atadasev YEAR(4) NOT NULL,
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
                epuletszintek json NOT NULL,
                projektingatlanok json DEFAULT NULL,
                penznem text DEFAULT 'Ft',
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

                        let boritokepek = [];
                        let projektkepek = [];
                        if (req.files) {
                            req.files.forEach((kep, index) => {
                                let extIndex = kep.originalname.lastIndexOf('.');
                                let fname = kep.originalname.substring(0, extIndex);

                                if (kep.fieldname === 'projektlakaskepek') {
                                    projektkepek.push({
                                        filename: `${fname}.jpg`,
                                        isCover: index.toString() === '0' ? true : false,
                                        src: `${process.env.projektkepekUrl}/${id}/projektkepek/${fname}.jpg`,
                                        title: `${fname}.jpg`
                                    });
                                    sharp(kep.buffer)
                                        .jpeg({ quality: 80 })
                                        .resize({ width: 1500, fit: 'inside' })
                                        .withMetadata()
                                        .toBuffer((err, buff) => {
                                            if (!err) {
                                                const dir = `${process.env.projektDir}/${id}/projektkepek`;
                                                const isDirExist = existsSync(dir);
                                                if (!isDirExist) {
                                                    mkdirSync(dir, { recursive: true });
                                                }
                                                writeFileSync(`${dir}/${fname}.jpg`, buff);
                                                log('POST /api/admin/projektek', `Kép hozzáadva: ${dir}/${fname}_icon.jpg\n`);
                                            } else {
                                                log('POST /api/admin/projektek', err);
                                            }
                                        });
                                }
                                if (kep.fieldname === 'borito') {
                                    boritokepek.push({
                                        filename: `${fname}.jpg`,
                                        isCover: index.toString() === '0' ? true : false,
                                        src: `${process.env.projektkepekUrl}/${id}/borito/${fname}.jpg`,
                                        title: `${fname}.jpg`
                                    });
                                    sharp(kep.buffer)
                                        .jpeg({ quality: 80 })
                                        .resize({ width: 1500, fit: 'inside' })
                                        .withMetadata()
                                        .toBuffer((err, buff) => {
                                            if (!err) {
                                                const dir = `${process.env.projektDir}/${id}/borito`;
                                                const isDirExist = existsSync(dir);
                                                if (!isDirExist) {
                                                    mkdirSync(dir, { recursive: true });
                                                }
                                                writeFileSync(`${dir}/${fname}.jpg`, buff);
                                                log('POST /api/admin/projektek', `Kép hozzáadva: ${dir}/${fname}_icon.jpg\n`);
                                            } else {
                                                log('POST /api/admin/projektek', err);
                                            }
                                        });
                                }
                            });
                        }

                        felvitelObj.projektlakaskepek = projektkepek;
                        felvitelObj.borito = boritokepek;

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

router.put('/', upload.any(), async (req, res) => {
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
                    let boritokepek = [];
                    let projektkepek = [];
                    let kepek = [];
                    if (modositoObj.borito) {
                        modositoObj.borito = modositoObj.borito;
                        if (Array.isArray(modositoObj.borito)) {
                            modositoObj.borito.forEach((item) => {
                                boritokepek.push(JSON.parse(item));
                            });
                        } else {
                            boritokepek = JSON.parse(modositoObj.borito);
                        }
                    }

                    if (modositoObj.projektlakaskepek) {
                        if (Array.isArray(modositoObj.projektlakaskepek)) {
                            modositoObj.projektlakaskepek.forEach((item) => {
                                projektkepek.push(JSON.parse(item));
                            });
                        } else {
                            projektkepek = JSON.parse(modositoObj.projektlakaskepek);
                        }
                    }
                    if (req.files) {
                        req.files.forEach((kep, index) => {
                            let extIndex = kep.originalname.lastIndexOf('.');
                            let fname = kep.originalname.substring(0, extIndex);

                            if (kep.fieldname === 'uj_projektlakaskepek') {
                                projektkepek.push({
                                    filename: `${fname}.jpg`,
                                    isCover: index.toString() === '0' ? true : false,
                                    src: `${process.env.projektkepekUrl}/${id}/projektkepek/${fname}.jpg`,
                                    title: `${fname}.jpg`
                                });
                                sharp(kep.buffer)
                                    .jpeg({ quality: 80 })
                                    .resize({ width: 1500, fit: 'inside' })
                                    .withMetadata()
                                    .toBuffer((err, buff) => {
                                        if (!err) {
                                            const dir = `${process.env.projektDir}/${id}/projektkepek`;
                                            const isDirExist = existsSync(dir);
                                            if (!isDirExist) {
                                                mkdirSync(dir, { recursive: true });
                                            }
                                            writeFileSync(`${dir}/${fname}.jpg`, buff);
                                            log('POST /api/admin/projektek', `Kép hozzáadva: ${dir}/${fname}_icon.jpg\n`);
                                        } else {
                                            log('POST /api/admin/projektek', err);
                                        }
                                    });
                            }
                            if (kep.fieldname === 'uj_borito') {
                                boritokepek.push({
                                    filename: `${fname}.jpg`,
                                    isCover: index.toString() === '0' ? true : false,
                                    src: `${process.env.projektkepekUrl}/${id}/borito/${fname}.jpg`,
                                    title: `${fname}.jpg`
                                });
                                sharp(kep.buffer)
                                    .jpeg({ quality: 80 })
                                    .resize({ width: 1500, fit: 'inside' })
                                    .withMetadata()
                                    .toBuffer((err, buff) => {
                                        if (!err) {
                                            const dir = `${process.env.projektDir}/${id}/borito`;
                                            const isDirExist = existsSync(dir);
                                            if (!isDirExist) {
                                                mkdirSync(dir, { recursive: true });
                                            }
                                            writeFileSync(`${dir}/${fname}.jpg`, buff);
                                            log('POST /api/admin/projektek', `Kép hozzáadva: ${dir}/${fname}_icon.jpg\n`);
                                        } else {
                                            log('POST /api/admin/projektek', err);
                                        }
                                    });
                            }
                        });
                    }
                    modositoObj = getJSONfromLongtext(modositoObj, 'toNumber');
                    modositoObj.projektlakaskepek = JSON.stringify(projektkepek);
                    modositoObj.borito = JSON.stringify(boritokepek);
                    modositoObj.beruhazo = JSON.stringify(modositoObj.beruhazo);
                    modositoObj.cim = JSON.stringify(modositoObj.cim);
                    modositoObj.epuletszintek = JSON.stringify(modositoObj.epuletszintek);
                    modositoObj.projektingatlanok = JSON.stringify(modositoObj.projektingatlanok);
                    const sql = getUpdateScript('projektek', { id: id }, modositoObj);
                    console.log(sql);
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
                            const dir = `${process.env.projektDir}/${id}/`;
                            rmSync(dir, { recursive: true, force: true });
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
                const image = `${process.env.projektDir}/${projektId}/${filename}`;
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

// PROJEKTEK END

export default router;
