import { jwtparams, UseQuery, pool, validateToken, hasRole, getId, getJSONfromLongtext, getNumberFromBoolean } from '../../../common/QueryHelpers.js';
import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();
const adminvevok = pool;

// ADMINVEVOK START

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
                const sql = `SELECT * FROM adminvevok WHERE id='${id}';`;
                adminvevok.query(sql, (err, result) => {
                    if (!err) {
                        if (result[0].email === user.email || (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'VEVOK_ADMIN']))) {
                            const vevok = getJSONfromLongtext(result[0], 'toBool');
                            res.status(200).send(vevok);
                        } else {
                            res.status(403).send({
                                err: 'Nincs jogosultsága az adott művelethez!'
                            });
                        }
                    }
                });
            } else {
                if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'VEVOK_ADMIN'])) {
                    const sql = `SELECT * FROM adminvevok;`;
                    adminvevok.query(sql, (error, ress) => {
                        if (error) {
                            res.status(500).send({ err: error, msg: 'Hiba történt a vevők lekérdezésekor!' });
                        } else {
                            let resss = ress.map((vevo) => {
                                return getJSONfromLongtext(vevo, 'toBool');
                            });
                            res.status(200).send(resss);
                        }
                    });
                } else {
                    res.status(403).send({
                        err: 'Nincs jogosultsága az adott művelethez!'
                    });
                }
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
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'VEVOK_ADMIN'])) {
                let felvitelObj = req.body;
                if (felvitelObj) {
                    felvitelObj = JSON.parse(JSON.stringify(felvitelObj));
                    const hash = await bcrypt.hash(felvitelObj.password, 10);
                    //store user, password and role
                    const sql = `CREATE TABLE IF NOT EXISTS eobgycvo_myhome.adminvevok (
                    id INT NOT NULL PRIMARY KEY,
                    nev json DEFAULT NULL,
                    cim json DEFAULT NULL,
                    telefon json DEFAULT NULL,
                    email text DEFAULT NULL,
                    erdeklodes json,
                  ) ENGINE=InnoDB;`;
                    adminvevok.query(sql, async (error) => {
                        if (!error) {
                            const sqlEmail = `SELECT email, nev FROM adminvevok WHERE email = '${felvitelObj.email}' OR nev = '${felvitelObj.nev}';`;
                            const resultEmail = await UseQuery(sqlEmail);
                            if (resultEmail.length === 0) {
                                let id = await getId(req.headers.id, 'adminvevok');
                                const sql = `INSERT INTO adminvevok (id, nev, cim, telefon, email, erdeklodes)
                                VALUES ('${id}', '${felvitelObj.nev}', '${felvitelObj.cim}', '${felvitelObj.telefon}', '${felvitelObj.email}', '${felvitelObj.erdeklodes}');`;
                                adminvevok.query(sql, (err) => {
                                    if (!err) {
                                        res.status(200).send({
                                            msg: 'Vevő sikeresen hozzáadva!'
                                        });
                                    } else {
                                        res.status(500).send({
                                            err: err, msg: 'Vevő hozzáadása sikertelen!'
                                        });
                                    }
                                });
                            } else {
                                res.status(400).send({
                                    err: err, msg: 'Ezzel a névvel / email címmel már regisztráltak!'
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
                        err: 'Vevő adatainak megadása kötelező!'
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

router.put('/', async (req, res) => {
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
                if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'VEVOK_ADMIN'])) {
                    if (id) {
                        const sql = `UPDATE adminvevok SET nev = '${modositoObj.nev}', cim = '${modositoObj.cim}', telefon = '${modositoObj.telefon}', email = '${modositoObj.email}', erdeklodes = '${modositoObj.erdeklodes}';`;
                        adminvevok.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Vevő sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    msg: 'Vevő módosítása sikertelen!',
                                    err: err
                                });
                            }
                        });
                    } else {
                        res.status(400).send({
                            err: {},
                            msg: 'Id megadása kötelező'
                        });
                    }
                } else {
                    res.status(400).send({
                        err: {},
                        msg: 'Vevő adatainak megadása kötelező'
                    });
                }
            } else {
                res.status(403).send({
                    err: {},
                    msg: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: {},
            msg: 'Nincs belépve! Kérem jelentkezzen be!'
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
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'VEVOK_ADMIN'])) {
                if (id) {
                    const sql = `DELETE FROM adminvevok WHERE id='${id}';`;
                    adminvevok.query(sql, (err) => {
                        if (!err) {
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

// ADMINVEVOK END

export default router;
