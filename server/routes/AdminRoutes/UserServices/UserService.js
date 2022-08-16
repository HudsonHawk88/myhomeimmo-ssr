// const { Pool } = require("pg");
const router = require('express').Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
// const poolJson = require("./pool.json");
const db_params = {
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpass,
    database: process.env.database,
    port: process.env.dbport
};
// const poolJson = require("./pool.json");
const users = mysql.createPool(db_params);
const jwt = require('jsonwebtoken');

const JWT = {
    secret: process.env.JWT_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
    expire: process.env.JWT_EXPIRE
};

function validateToken(token, secret) {
    try {
        const result = jwt.verify(token, secret);

        return {
            name: result.name,
            roles: result.roles,
            email: result.email
        };
    } catch (ex) {
        return null;
    }
}

function hasRole(userRoles, minRoles) {
    let result = false;
    userRoles.forEach((userrole) => {
        if (minRoles.includes(userrole)) {
            result = true;
        }
    });

    return result;
}

// USERS START

router.get('/', (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const id = req.headers.id;
        const user = validateToken(token, JWT.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (id) {
                const sql = `SELECT * FROM users WHERE id='${id}';`;
                let userEmail = undefined;
                users.query(sql, (err, result) => {
                    if (!err) {
                        userEmail = result.rows[0].email;
                    }
                });
                if ((user.roles && user.roles.length !== 0 && hasRole(user.roles, 'SZUPER_ADMIN')) || (userEmail && user.email === userEmail)) {
                    users.query(sql, (err, result) => {
                        if (!err) {
                            res.status(200).send(result.rows);
                        } else {
                            res.status(500).send(err);
                        }
                    });
                } else {
                    res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
                }
            } else {
                const sql = `SELECT * FROM users;`;
                if (user.roles && user.roles.length !== 0 && hasRole(user.roles, 'SZUPER_ADMIN')) {
                    users.query(sql, (err, result) => {
                        if (!err) {
                            res.status(200).send(result.rows);
                        } else {
                            res.status(500).send({ err: err });
                        }
                    });
                } else {
                    res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
                }
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

router.post('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = validateToken(token, JWT.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            let felvitelObj = req.body;
            if (felvitelObj) {
                felvitelObj = JSON.parse(JSON.stringify(felvitelObj));

                if (user.roles && user.roles.length !== 0 && hasRole(user.roles, 'SZUPER_ADMIN')) {
                    const hash = await bcrypt.hash(felvitelObj.password, 10);
                    //store user, password and role
                    const sql = `CREATE TABLE IF NOT EXISTS adminusers (
              id text PRIMARY KEY DEFAULT uuid_generate_v4(),
              nev json DEFAULT NULL,
              cim json DEFAULT NULL,
              telefon json DEFAULT NULL,
              avatar jsonb DEFAULT NULL,
              username text DEFAULT NULL,
              email text DEFAULT NULL,
              password text DEFAULT NULL,
              token text DEFAULT NULL
            );`;
                    users.query(sql, async (error) => {
                        if (!error) {
                            const sqlEmail = 'SELECT email FROM users WHERE email = $1';
                            const resultEmail = await users.query(sqlEmail, [felvitelObj.email]);

                            if (resultEmail.rowCount === 0) {
                                const sql = `INSERT INTO users (nev, cim, telefon, avatar, username, email, password, token)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
                                users.query(
                                    sql,
                                    [felvitelObj.nev, felvitelObj.cim, felvitelObj.telefon, JSON.stringify(felvitelObj.avatar), felvitelObj.username, felvitelObj.email, hash, null],
                                    (err) => {
                                        if (!err) {
                                            res.status(200).send({ msg: 'Felhasználó sikeresen hozzáadva!' });
                                        } else {
                                            res.status(500).send({ err: 'Felhasználó hozzáadása sikertelen!' });
                                        }
                                    }
                                );
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
                    res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
                }
            } else {
                res.status(400).send({ err: 'Felhasználó adatainak megadása kötelező' });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

router.put('/', (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = validateToken(token, JWT.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            const modositoObj = req.body;
            const id = req.headers.id;
            if (modositoObj) {
                if (id) {
                    modositoObj = JSON.parse(JSON.stringify(modositoObj));
                    const sql = `UPDATE users WHERE id='${id}';`;

                    if ((user.roles && user.roles.length !== 0 && hasRole(user.roles, 'SZUPER_ADMIN')) || user.email === modositoObj.email) {
                        users.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({ msg: 'Felhasználó sikeresen módosítva!' });
                            } else {
                                res.status(500).send({ err: 'Felhasználó módosítása sikertelen!' });
                            }
                        });
                    } else {
                        res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
                    }
                } else {
                    res.status(400).send({ err: 'Id megadása kötelező' });
                }
            } else {
                res.status(400).send({ err: 'Felhasználó adatainak megadása kötelező' });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

router.delete('/', (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = validateToken(token, JWT.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            const id = req.headers.id;
            if (id) {
                const selectSql = `SELECT * FROM users WHERE id='${id}';`;
                let userEmail = undefined;
                users.query(selectSql, (err, result) => {
                    if (!err) {
                        userEmail = result.rows[0].email;
                    }
                });
                if ((user.roles && user.roles.length !== 0 && hasRole(user.roles, 'SZUPER_ADMIN')) || (userEmail && user.email === userEmail)) {
                    const sql = `DELETE FROM users WHERE id='${id}';`;
                    users.query(sql, (err) => {
                        if (!err) {
                            res.status(200).send({ msg: 'Felhasználó sikeresen törölve!' });
                        } else {
                            res.status(500).send({ err: 'Felhasználó törlése sikertelen!' });
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

// ADMINUSERS END

export default router;
