import { jwtparams, UseQuery, pool, validateToken, hasRole, getId, getJSONfromLongtext } from '../../../common/QueryHelpers.js';
import express from 'express';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import multer from 'multer';
import sharp from 'sharp';

const router = express.Router();
const kapcsolat = pool;

/* const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        if (file) {
            const id = await getId(req.headers.id, 'kapcsolat');
            const dir = `${process.env.kapcsolatDir}/${id}/`;
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

// KAPCSOLAT START

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
                const sql = `SELECT * FROM kapcsolat WHERE id='${id}';`;
                kapcsolat.query(sql, (err, result) => {
                    if (!err) {
                        if (hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                            let resss = getJSONfromLongtext(result[0]);
                            res.status(200).send(resss);
                        } else {
                            res.status(403).send({
                                err: 'Nincs jogosultsága az adott művelethez!'
                            });
                        }
                    }
                });
            } else {
                const sql = `SELECT * FROM kapcsolat;`;
                kapcsolat.query(sql, (error, ress) => {
                    if (error) {
                        res.status(500).send({ err: 'Hiba történt a Rólunk lekérdezésekor!' });
                    } else {
                        let result = ress.map((item) => {
                            return getJSONfromLongtext(item);
                        });
                        res.status(200).send(result);
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

router.post('/', upload.array('kep'), async (req, res) => {
/* router.post('/', async (req, res) => { */
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                let felvitelObj = req.body;
                console.log(req.body)
                if (felvitelObj) {
                    felvitelObj = JSON.parse(JSON.stringify(felvitelObj));
                    //store user, password and role
                    const sql = `CREATE TABLE IF NOT EXISTS eobgycvo_myhome.kapcsolat (
                    id INT NOT NULL PRIMARY KEY,
                    azonosito text DEFAULT NULL,
                    kep json DEFAULT NULL,
                    nev text DEFAULT NULL,
                    cim text DEFAULT NULL,
                    email text DEFAULT NULL,
                    telefon text DEFAULT NULL,
                    kapcsolatcim text DEFAULT NULL,
                    kapcsolatleiras text DEFAULT NULL
                  ) ENGINE=InnoDB;`;
                    kapcsolat.query(sql, async (error) => {
                        if (!error) {
                            const kapcsolatSql = `SELECT azonosito FROM kapcsolat WHERE azonosito = '${felvitelObj.azonosito}';`;
                            const result = await UseQuery(kapcsolatSql);
                            // if (resultEmail.rowCount === 0) {
                            if (result.length === 0) {
                                let id = await getId(req.headers.id, 'kapcsolat');
                                let kepek = [];
                                console.log(req.files);
                                console.log(req.file);
                                if (req.files) {
                                    req.files.forEach((kep) => {
                                        let extIndex = kep.originalname.lastIndexOf('.');
                                        let fname = kep.originalname.substring(0, extIndex);
                                        kepek.push({
                                            src: `${process.env.kapcsolatUrl}/${id}/${fname}.jpg`,
                                            title: `${fname}.jpg`,
                                            filename: `${fname}.jpg`
                                        });
                                        
                                        sharp(kep.buffer)
                                            .jpeg({ quality: 80 })
                                            .resize({ width: 1500, fit: 'inside' })
                                            .withMetadata()
                                            .toBuffer((err, buff) => {
                                                if (!err) {
                                                    const dir = `${process.env.kapcsolatDir}/${id}`;
                                                    const isDirExist = existsSync(dir);
                                                    if (!isDirExist) {
                                                        mkdirSync(dir);
                                                    }
                                                    writeFileSync(`${dir}/${fname}.jpg`, buff);
                                                } else {
                                                    console.log(err);
                                                }
                                            });
                                    });
                                }
                                felvitelObj.kep = kepek;
                                const sql = `INSERT INTO kapcsolat (id, azonosito, kep, nev, cim, email, telefon, kapcsolatcim, kapcsolatleiras)
                                VALUES ('${id}', '${felvitelObj.azonosito}', '${JSON.stringify(felvitelObj.kep)}', '${felvitelObj.nev}', '${felvitelObj.cim}', '${felvitelObj.email}', '${
                                    felvitelObj.telefon
                                }', '${felvitelObj.kapcsolatcim}', '${felvitelObj.kapcsolatleiras}');`;
                                kapcsolat.query(sql, (err) => {
                                    if (!err) {
                                        res.status(200).send({
                                            msg: 'Kapcsolat sikeresen hozzáadva!'
                                        });
                                    } else {
                                        res.status(500).send({
                                            err: err
                                        });
                                    }
                                });
                            } else {
                                res.status(400).send({
                                    err: 'Ez a "Kapcsolat" már létezik!'
                                });
                            }
                        } else {
                            res.status(500).send({
                                err: 'Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!',
                                msg: error
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        err: 'Kapcsolat adatainak megadása kötelező!'
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

router.put('/', upload.array('uj_kep'), async (req, res) => {
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
            if (modositoObj) {
                // TODO Email címet most csak szuperadmin tud módoítani!!!!
                if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                    if (id) {
                        modositoObj = JSON.parse(JSON.stringify(modositoObj));
                        let kepek = [];
                        if (modositoObj.kep) {
                            modositoObj.kep = JSON.parse(JSON.stringify(modositoObj.kep));
                            if (Array.isArray(modositoObj.kep)) {
                                modositoObj.kep.forEach((item) => {
                                    kepek.push(JSON.parse(item));
                                });
                            } else {
                                kepek.push(JSON.parse(modositoObj.kep));
                            }
                        }

                        if (req.files) {
                            req.files.map((kep) => {
                                let extIndex = kep.originalname.lastIndexOf('.');
                                let fname = kep.originalname.substring(0, extIndex);
                                kepek.push({
                                    src: `${process.env.kapcsolatUrl}/${id}/${fname}.jpg`,
                                    title: `${fname}.jpg`,
                                    filename: `${fname}.jpg`
                                });

                                
                                sharp(kep.buffer)
                                    .jpeg({ quality: 80 })
                                    .resize({ width: 1500, fit: 'inside' })
                                    .withMetadata()
                                    .toBuffer((err, buff) => {
                                        if (!err) {
                                            const dir = `${process.env.kapcsolatDir}/${id}`;
                                            const isDirExist = existsSync(dir);
                                            if (!isDirExist) {
                                                mkdirSync(dir);
                                            }
                                            writeFileSync(`${dir}/${fname}.jpg`, buff);
                                        } else {
                                            console.log(err);
                                        }
                                    });
                            });
                        }

                        modositoObj.kep = kepek;
                        const sql = `UPDATE kapcsolat SET azonosito='${modositoObj.azonosito}', kep='${JSON.stringify(modositoObj.kep)}', nev='${modositoObj.nev}', cim='${modositoObj.cim}', email='${
                            modositoObj.email
                        }', telefon='${modositoObj.telefon}', kapcsolatcim='${modositoObj.kapcsolatcim}', kapcsolatleiras='${modositoObj.kapcsolatleiras}' WHERE id = '${id}';`;
                        kapcsolat.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Kapcsolat sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: 'Kapcsolat módosítása sikertelen!'
                                });
                            }
                        });
                    } else {
                        res.status(400).send({
                            err: 'Id megadása kötelező'
                        });
                    }
                } else {
                    res.status(400).send({
                        err: 'Kapcsolat adatainak megadása kötelező'
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
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                if (id) {
                    const sql = `DELETE FROM kapcsolat WHERE id='${id}';`;
                    kapcsolat.query(sql, (err) => {
                        if (!err) {
                            const dir = `${process.env.kapcsolatDir}/${id}/`;
                            rmSync(dir, { recursive: true, force: true });
                            res.status(200).send({
                                msg: 'Kapcsolat sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: 'Kapcsolat törlése sikertelen!'
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
        const kapcsolatId = req.headers.id;
        const { filename } = req.body;

        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                const image = `${process.env.kapcsolatDir}/${kapcsolatId}/${filename}`;
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

// KAPCSOLAT END

export default router;
