import { jwtparams, UseQuery, pool, validateToken, hasRole } from '../../../common/QueryHelpers.js';
import express from 'express';
const router = express.Router();
const roles = pool;

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
                const sql = `SELECT * FROM roles WHERE id='${id}';`;
                roles.query(sql, (err, result) => {
                    if (!err) {
                        if (hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                            res.status(200).send(result[0]);
                        } else {
                            res.status(403).send({
                                err: 'Nincs jogosultsága az adott művelethez!'
                            });
                        }
                    }
                });
            } else {
                const sql = `SELECT * FROM roles;`;
                roles.query(sql, (error, ress) => {
                    if (error) {
                        res.status(500).send({ err: 'Hiba történt a felhasználók lekérdezésekor!' });
                    } else {
                        res.status(200).send(ress);
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
                    const sql = `CREATE TABLE IF NOT EXISTS eobgycvo_myhome.roles (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    label text DEFAULT NULL,
                    leiras text DEFAULT NULL,
                    value text DEFAULT NULL
                  ) ENGINE=InnoDB;`;
                    roles.query(sql, async (error) => {
                        if (!error) {
                            const roleSql = `SELECT value FROM roles WHERE value = '${felvitelObj.role}';`;
                            const resultRole = await UseQuery(roleSql);
                            // if (resultEmail.rowCount === 0) {
                            if (resultRole.length === 0) {
                                const sql = `INSERT INTO roles (label, leiras, value)
                          VALUES ('${felvitelObj.label}', '${felvitelObj.leiras}', '${felvitelObj.value}');`;
                                roles.query(sql, (err) => {
                                    if (!err) {
                                        res.status(200).send({
                                            msg: 'Jogosultság sikeresen hozzáadva!'
                                        });
                                    } else {
                                        res.status(500).send({
                                            err: err
                                        });
                                    }
                                });
                            } else {
                                res.status(400).send({
                                    err: 'Ez a jogosultság már létezik!'
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
                        err: 'Jogosultság adatainak megadása kötelező!'
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
                        const sql = `UPDATE roles SET label = '${modositoObj.label}', leiras = '${modositoObj.leiras}', value = '${modositoObj.value}' WHERE id = '${id}';`;
                        roles.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Jogosultság sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: 'Jogosultság módosítása sikertelen!'
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
                        err: 'Jogosultság adatainak megadása kötelező'
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
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                const id = req.headers.id;
                if (id) {
                    const sql = `DELETE FROM roles WHERE id='${id}';`;
                    roles.query(sql, (err) => {
                        if (!err) {
                            res.status(200).send({
                                msg: 'Jogosultság sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: 'Jogosultság törlése sikertelen!'
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

// ROLES END

export default router;
