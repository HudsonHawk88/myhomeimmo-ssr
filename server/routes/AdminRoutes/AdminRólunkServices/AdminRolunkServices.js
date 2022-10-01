import { jwtparams, UseQuery, pool, validateToken, hasRole } from '../../../common/QueryHelpers.js';
import express from 'express';
const router = express.Router();
const rolunk = pool;

// ROLUNK START

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
                const sql = `SELECT * FROM rolunk WHERE id='${id}';`;
                rolunk.query(sql, (err, result) => {
                    if (!err) {
                        if (hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                            let resss = result[0];
                            resss.kep = JSON.parse(resss.kep);
                            res.status(200).send(resss);
                        } else {
                            res.status(403).send({
                                err: 'Nincs jogosultsága az adott művelethez!'
                            });
                        }
                    }
                });
            } else {
                const sql = `SELECT * FROM rolunk;`;
                rolunk.query(sql, (error, ress) => {
                    if (error) {
                        res.status(500).send({ err: 'Hiba történt a Rólunk lekérdezésekor!' });
                    } else {
                        let result = ress;
                        result.map((item) => {
                            item.kep = JSON.parse(item.kep);
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

router.post('/', async (req, res) => {
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
                if (felvitelObj) {
                    felvitelObj = JSON.parse(JSON.stringify(felvitelObj));
                    //store user, password and role
                    const sql = `CREATE TABLE IF NOT EXISTS eobgycvo_myhome.rolunk (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    azonosito text DEFAULT NULL,
                    kep json DEFAULT NULL,
                    nev text DEFAULT NULL,
                    beosztas text DEFAULT NULL,
                    email text DEFAULT NULL,
                    telefon text DEFAULT NULL,
                    leiras text DEFAULT NULL
                  ) ENGINE=InnoDB;`;
                    rolunk.query(sql, async (error) => {
                        if (!error) {
                            const rolunkSql = `SELECT azonosito FROM rolunk WHERE azonosito = '${felvitelObj.azonosito}';`;
                            const result = await UseQuery(rolunkSql);
                            // if (resultEmail.rowCount === 0) {
                            if (result.length === 0) {
                                const sql = `INSERT INTO rolunk (azonosito, kep, nev, beosztas, email, telefon, leiras)
                          VALUES ('${felvitelObj.azonosito}', '${JSON.stringify(felvitelObj.kep)}', '${felvitelObj.nev}', '${felvitelObj.beosztas}', '${felvitelObj.email}', '${
                                    felvitelObj.telefon
                                }', '${felvitelObj.leiras}');`;
                                rolunk.query(sql, (err) => {
                                    if (!err) {
                                        res.status(200).send({
                                            msg: 'Rólunk sikeresen hozzáadva!'
                                        });
                                    } else {
                                        res.status(500).send({
                                            err: err
                                        });
                                    }
                                });
                            } else {
                                res.status(400).send({
                                    err: 'Ez a "Rólunk" már létezik!'
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
                        err: 'Rólunk adatainak megadása kötelező!'
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
                // TODO Email címet most csak szuperadmin tud módoítani!!!!
                if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                    if (id) {
                        modositoObj = JSON.parse(JSON.stringify(modositoObj));
                        const sql = `UPDATE rolunk SET azonosito='${modositoObj.azonosito}', kep='${JSON.stringify(modositoObj.kep)}', nev='${modositoObj.nev}', beosztas='${
                            modositoObj.beosztas
                        }', email='${modositoObj.email}', telefon='${modositoObj.telefon}', leiras='${modositoObj.leiras}' WHERE id = '${id}';`;
                        rolunk.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Rólunk sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: 'Rólunk módosítása sikertelen!'
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
                        err: 'Rólunk adatainak megadása kötelező'
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
                    const sql = `DELETE FROM rolunk WHERE id='${id}';`;
                    rolunk.query(sql, (err) => {
                        if (!err) {
                            res.status(200).send({
                                msg: 'Rólunk sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: 'Rólunk törlése sikertelen!'
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

// ROLUNK END

export default router;
