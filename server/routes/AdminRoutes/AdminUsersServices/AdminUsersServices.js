import { jwtparams, UseQuery, pool, validateToken, hasRole, getId, getJSONfromLongtext, getNumberFromBoolean } from '../../../common/QueryHelpers.js';
import express from 'express';
import bcrypt from 'bcrypt';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import multer from 'multer';
import sharp from 'sharp';
/* import { getJSONfromLongtext } from '../../../common/QueryHelpers'; */
const router = express.Router();
const adminusers = pool;

/* const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        if (file) {
            const id = await getId(req.headers.id, 'adminusers');
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

// ADMINUSERS START

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
                const sql = `SELECT * FROM adminusers WHERE id='${id}';`;
                adminusers.query(sql, (err, result) => {
                    if (!err) {
                        if (result[0].email === user.email || (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN']))) {
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
                const sql = `SELECT * FROM adminusers;`;
                adminusers.query(sql, (error, ress) => {
                    if (error) {
                        res.status(500).send({ err: 'Hiba történt a felhasználók lekérdezésekor!' });
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

router.post('/', upload.array('avatar'), async (req, res) => {
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
                    const hash = await bcrypt.hash(felvitelObj.password, 10);
                    //store user, password and role
                    const sql = `CREATE TABLE IF NOT EXISTS eobgycvo_myhome.adminusers (
                    id INT NOT NULL PRIMARY KEY,
                    nev json DEFAULT NULL,
                    cim json DEFAULT NULL,
                    telefon json DEFAULT NULL,
                    avatar json DEFAULT NULL,
                    username text DEFAULT NULL,
                    email text DEFAULT NULL,
                    password char(100) DEFAULT NULL,
                    token text(200) DEFAULT NULL,
                    roles json,
                    isErtekesito bool
                  ) ENGINE=InnoDB;`;
                    adminusers.query(sql, async (error) => {
                        if (!error) {
                            const sqlEmail = `SELECT email FROM adminusers WHERE email = '${felvitelObj.email}';`;
                            const resultEmail = await UseQuery(sqlEmail);
                            // if (resultEmail.rowCount === 0) {
                            if (resultEmail.length === 0) {
                                felvitelObj.isErtekesito = getNumberFromBoolean(felvitelObj.isErtekesito);
                                let id = await getId(req.headers.id, 'adminusers');
                                let kepek = [];
                                if (req.files) {
                                    req.files.forEach((kep) => {
                                        let extIndex = kep.originalname.lastIndexOf('.');
                                        let fname = kep.originalname.substring(0, extIndex);
                                        kepek.push({
                                            src: `${process.env.avatarUrl}/${id}/${fname}.jpg`,
                                            title: `${fname}.jpg`,
                                            filename: `${fname}.jpg`
                                        });

                                        sharp(kep.buffer)
                                            .jpeg({ quality: 80 })
                                            .resize({ width: 1500, fit: 'inside' })
                                            .withMetadata()
                                            .toBuffer((err, buff) => {
                                                if (!err) {
                                                    const dir = `${process.env.avatardir}/${id}`;
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
                                felvitelObj.avatar = kepek;
                                const sql = `INSERT INTO adminusers (id, nev, cim, telefon, avatar, username, email, password, roles, token, isErtekesito)
                          VALUES ('${id}', '${felvitelObj.nev}', '${felvitelObj.cim}', '${felvitelObj.telefon}', '${JSON.stringify(felvitelObj.avatar)}', '${felvitelObj.username}', '${
                                    felvitelObj.email
                                }', '${hash}', '${felvitelObj.roles}', '${null}', '${felvitelObj.isErtekesito}');`;
                                adminusers.query(sql, (err) => {
                                    if (!err) {
                                        res.status(200).send({
                                            msg: 'Admin sikeresen hozzáadva!'
                                        });
                                    } else {
                                        res.status(500).send({
                                            err: err
                                        });
                                    }
                                });
                            } else {
                                res.status(400).send({
                                    err: 'Ezzel a felhasználónévvel / email címmel már regisztráltak!'
                                });
                            }
                        } else {
                            res.status(500).send({
                                err: error,
                                msg: 'Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!'
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        err: 'Felhasználó adatainak megadása kötelező'
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

router.put('/', upload.array('uj_avatar'), async (req, res) => {
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
                if (user.email === modositoObj.email || (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN']))) {
                    if (id) {
                        // modositoObj = JSON.parse(JSON.stringify(modositoObj));
                        modositoObj.isErtekesito = getNumberFromBoolean(modositoObj.isErtekesito);
                        const isPasswordChanged = modositoObj.password ? true : false;
                        let hash = undefined;
                        if (isPasswordChanged) {
                            hash = await bcrypt.hash(modositoObj.password, 10);
                        }

                        let kepek = [];
                        if (modositoObj.avatar) {
                            modositoObj.avatar = JSON.parse(JSON.stringify(modositoObj.avatar));
                            if (Array.isArray(modositoObj.avatar)) {
                                modositoObj.avatar.forEach((item) => {
                                    kepek.push(JSON.parse(item));
                                });
                            } else {
                                kepek.push(JSON.parse(modositoObj.avatar));
                            }
                        }

                        if (req.files) {
                            req.files.map((kep) => {
                                let extIndex = kep.originalname.lastIndexOf('.');
                                let fname = kep.originalname.substring(0, extIndex);
                                kepek.push({
                                    src: `${process.env.avatarUrl}/${id}/${fname}.jpg`,
                                    title: `${fname}.jpg`,
                                    filename: `${fname}.jpg`
                                });

                                sharp(kep.buffer)
                                    .jpeg({ quality: 80 })
                                    .resize({ width: 1500, fit: 'inside' })
                                    .withMetadata()
                                    .toBuffer((err, buff) => {
                                        if (!err) {
                                            const dir = `${process.env.avatardir}/${id}`;
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

                        modositoObj.avatar = kepek;

                        const sql = isPasswordChanged
                            ? `UPDATE adminusers SET nev = '${modositoObj.nev}', cim = '${modositoObj.cim}', telefon = '${modositoObj.telefon}', avatar = '${JSON.stringify(
                                  modositoObj.avatar
                              )}', username = '${modositoObj.username}', email = '${modositoObj.email}', password = '${hash}', roles = '${modositoObj.roles}', isErtekesito = '${
                                  modositoObj.isErtekesito
                              }' WHERE id = '${id}';`
                            : `UPDATE adminusers SET nev = '${modositoObj.nev}', cim = '${modositoObj.cim}', telefon = '${modositoObj.telefon}', avatar = '${JSON.stringify(
                                  modositoObj.avatar
                              )}', username = '${modositoObj.username}', email = '${modositoObj.email}', roles = '${modositoObj.roles}', isErtekesito = '${
                                  modositoObj.isErtekesito
                              }' WHERE id = '${id}';`;
                        adminusers.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Felhasználó sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: 'Felhasználó módosítása sikertelen!',
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
                    res.status(400).send({
                        err: 'Felhasználó adatainak megadása kötelező'
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
                    const sql = `DELETE FROM adminusers WHERE id='${id}';`;
                    adminusers.query(sql, (err) => {
                        if (!err) {
                            const dir = `${process.env.avatardir}/${id}/`;
                            rmSync(dir, { recursive: true, force: true });
                            res.status(200).send({
                                msg: 'Felhasználó sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: 'Felhasználó törlése sikertelen!'
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
        const adminUserId = req.headers.id;
        const { filename } = req.body;

        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                const image = `${process.env.avatardir}/${adminUserId}/${filename}`;
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

// ADMINUSERS END

export default router;
