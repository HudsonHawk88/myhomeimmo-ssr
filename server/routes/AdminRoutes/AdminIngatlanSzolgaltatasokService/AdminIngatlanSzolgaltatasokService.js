import express from 'express';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import multer from 'multer';
import sharp from 'sharp';
import { jwtparams, UseQuery, pool, validateToken, hasRole, getId, getJSONfromLongtext } from '../../../common/QueryHelpers.js';

const router = express.Router();
const ingatlanSzolg = pool;

/* const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        let id = await getId(req.headers.id, 'ingatlan_szolg');
        const dir = `${process.env.adminIngSzolgDir}/${id}/`;
        let exist = existsSync(dir);
        if (!exist) {
            mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); //Appending .jpg
    }
}); */
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ROLES START

router.get('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const id = req.headers.id;
        const user = await validateToken(token, jwtparams.secret);
        // const user = { roles: [{ value: "SZUPER_ADMIN"}]}
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (id) {
                const sql = `SELECT * FROM ingatlan_szolg WHERE id='${id}';`;
                ingatlanSzolg.query(sql, (err, result) => {
                    if (!err) {
                        if (hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                            let resss = getJSONfromLongtext(result[0], 'toBool');
                            res.status(200).send(resss);
                        } else {
                            res.status(403).send({
                                err: 'Nincs jogosultsága az adott művelethez!'
                            });
                        }
                    }
                });
            } else {
                const sql = `SELECT * FROM ingatlan_szolg;`;
                ingatlanSzolg.query(sql, (error, ress) => {
                    if (error) {
                        res.status(500).send({ err: 'Hiba történt a szolgaltatasok lekérdezésekor!' });
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
    const token = req.cookies.JWT_TOKEN;
    // TODO berakni a token vizsgálatot a true helyére és a user a validateToken-es lesz ha lesz Admin felület hozzá!!!
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        // const user = { roles: [{ value: "SZUPER_ADMIN"}] };
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                let felvitelObj = req.body;
                if (felvitelObj) {
                    felvitelObj = JSON.parse(JSON.stringify(felvitelObj));
                    //store user, password and role
                    const sql = `CREATE TABLE IF NOT EXISTS myhomeimmo.ingatlan_szolg (
                    id INT NOT NULL PRIMARY KEY,
                    azonosito text DEFAULT NULL,
                    kep json DEFAULT NULL,
                    leiras text DEFAULT NULL
                  ) ENGINE=InnoDB;`;
                    ingatlanSzolg.query(sql, async (error) => {
                        if (!error) {
                            const ingSzolgSql = `SELECT azonosito FROM ingatlan_szolg WHERE azonosito = '${felvitelObj.azonosito}';`;
                            const result = await UseQuery(ingSzolgSql);
                            // if (resultEmail.rowCount === 0) {
                            if (result.length === 0) {
                                let id = await getId(req.headers.id, 'ingatlan_szolg');
                                let kepek = [];
                                if (req.files) {
                                    req.files.forEach((kep) => {
                                        let extIndex = kep.originalname.lastIndexOf('.');
                                        let fname = kep.originalname.substring(0, extIndex);

                                        kepek.push({
                                            src: `${process.env.adminIngSzolgUrl}/${id}/${fname}.jpg`,
                                            title: `${fname}.jpg`,
                                            filename: `${fname}.jpg`
                                        });

                                        sharp(kep.buffer)
                                            .jpeg({ quality: 80 })
                                            .resize({ width: 1500, fit: 'inside' })
                                            .withMetadata()
                                            .toBuffer((err, buff) => {
                                                if (!err) {
                                                    const dir = `${process.env.adminIngSzolgDir}/${id}`;
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
                                const sql = `INSERT INTO ingatlan_szolg (id, azonosito, kep, leiras)
                          VALUES ('${id}', '${felvitelObj.azonosito}', '${JSON.stringify(felvitelObj.kep)}', '${felvitelObj.leiras}');`;
                                ingatlanSzolg.query(sql, (err) => {
                                    if (!err) {
                                        res.status(200).send({
                                            msg: 'Szolgáltatás sikeresen hozzáadva!'
                                        });
                                    } else {
                                        res.status(500).send({
                                            err: err
                                        });
                                    }
                                });
                            } else {
                                res.status(400).send({
                                    err: 'Ez a szolgáltatás már létezik!'
                                });
                            }
                        } else {
                            res.status(500).send({
                                err: 'Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!',
                                msg: err
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        err: 'Szolgáltatás adatainak megadása kötelező!'
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
        // const user = { roles: [{ value: "SZUPER_ADMIN"}] };
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
                                kepek = JSON.parse(modositoObj.kep);
                            }
                        }

                        if (req.files) {
                            req.files.map((kep) => {
                                let extIndex = kep.originalname.lastIndexOf('.');
                                let fname = kep.originalname.substring(0, extIndex);
                                /* kepek.push({
                                    src: `${process.env.adminIngSzolgUrl}/${id}/${fname}.jpg`,
                                    title: `${fname}.jpg`,
                                    filename: `${fname}.jpg`
                                }); */

                                if (kepek.find((k) => k.originalname === kep.originalname)) {
                                    kepek.push({
                                        filename: `${fname}.jpg`,
                                        src: `${process.env.adminIngSzolgUrl}/${id}/${fname}.jpg`,
                                        title: `${fname}.jpg`
                                    });
                                }

                                sharp(kep.buffer)
                                    .jpeg({ quality: 80 })
                                    .resize({ width: 1500, fit: 'inside' })
                                    .withMetadata()
                                    .toBuffer((err, buff) => {
                                        if (!err) {
                                            const dir = `${process.env.adminIngSzolgDir}/${id}`;
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
                        const sql = `UPDATE ingatlan_szolg SET azonosito='${modositoObj.azonosito}', kep='${JSON.stringify(modositoObj.kep)}', leiras='${modositoObj.leiras}' WHERE id = '${id}';`;
                        ingatlanSzolg.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Szolgáltatás sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: 'Szolgáltatás módosítása sikertelen!'
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
                        err: 'Szolgáltatás adatainak megadása kötelező'
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
                    const sql = `DELETE FROM ingatlan_szolg WHERE id='${id}';`;
                    ingatlanSzolg.query(sql, (err) => {
                        if (!err) {
                            const dir = `${process.env.adminIngSzolgDir}/${id}/`;
                            rmSync(dir, { recursive: true, force: true });
                            res.status(200).send({
                                msg: 'Szolgáltatás sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: 'Szolgáltatás törlése sikertelen!'
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
        const adminIngSzolgId = req.headers.id;
        const { filename } = req.body;

        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                const image = `${process.env.adminIngSzolgDir}/${adminIngSzolgId}/${filename}`;
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

// ROLES END

export default router;
