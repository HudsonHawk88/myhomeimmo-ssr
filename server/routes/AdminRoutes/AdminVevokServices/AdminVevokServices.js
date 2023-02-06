import { jwtparams, UseQuery, pool, validateToken, hasRole, getId, getJSONfromLongtext, getNumberFromBoolean } from '../../../common/QueryHelpers.js';
import express from 'express';
import nodemailer from 'nodemailer';
import mailconf from '../../common/MailerService/mailconfig.json';

const router = express.Router();
const adminvevok = pool;
const transporter = nodemailer.createTransport(mailconf);


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
                console.log(felvitelObj);
                if (felvitelObj) {
                    //store user, password and role
                    const sql = `CREATE TABLE IF NOT EXISTS eobgycvo_myhome.adminvevok (
                    id INT NOT NULL PRIMARY KEY,
                    nev json DEFAULT NULL,
                    cim json DEFAULT NULL,
                    telefon json DEFAULT NULL,
                    email text DEFAULT NULL,
                    erdeklodes json DEFAULT NULL
                  ) ENGINE=InnoDB;`;
                    adminvevok.query(sql, async (error) => {
                        if (!error) {
                            const sqlEmail = `SELECT email, nev FROM adminvevok WHERE email = '${felvitelObj.email}';`;
                            const resultEmail = await UseQuery(sqlEmail);
                            if (resultEmail.length === 0) {
                                let id = await getId(req.headers.id, 'adminvevok');
                                const sql = `INSERT INTO adminvevok (id, nev, cim, telefon, email, erdeklodes)
                                VALUES ('${id}', '${JSON.stringify(felvitelObj.nev)}', '${JSON.stringify(felvitelObj.cim)}', '${JSON.stringify(felvitelObj.telefon)}', '${felvitelObj.email}', '${JSON.stringify(felvitelObj.erdeklodesek)}');`;
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
                        const sql = `UPDATE adminvevok SET nev = '${JSON.stringify(modositoObj.nev)}', cim = '${JSON.stringify(modositoObj.cim)}', telefon = '${JSON.stringify(modositoObj.telefon)}', email = '${modositoObj.email}', erdeklodes = '${JSON.stringify(modositoObj.erdeklodesek)}';`;
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

router.post('/kiajanl', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'VEVOK_ADMIN'])) {
                let id = req.headers.id;
                const sql = `SELECT nev, email, erdeklodes FROM adminvevok WHERE id = '${id}';`;
                const result = await UseQuery(sql);
                let vevo = getJSONfromLongtext(result[0], 'toBool');
                let kereso = req.body;
                kereso = JSON.parse(JSON.stringify(kereso));
                const keys = Object.keys(kereso);

                let where = '';
                let newWhere = '';
                let leftJoin = '';
                keys.forEach((filter) => {
                    if (kereso[filter] !== '' && kereso[filter] !== false && filter !== 'irszam' && filter !== 'telepules') {
                        if (
                            filter === 'telek' ||
                            filter === 'alapterulet' ||
                            filter === 'ar' ||
                            filter === 'isHirdetheto' ||
                            filter === 'isKiemelt' ||
                            filter === 'isLift' ||
                            filter === 'isErkely' ||
                            filter === 'isTetoter' ||
                            filter !== 'irszam' ||
                            filter === 'statusz' ||
                            filter === 'tipus' ||
                            filter === 'szobaszam' ||
                            filter === 'emelet' ||
                            filter === 'epitesmod' ||
                            filter === 'futes' ||
                            filter === 'allapot' ||
                            filter === 'atipus' ||
                            filter === 'rendeltetes'
                        ) {
                            if (filter === 'telek' || filter === 'alapterulet') {
                                where = where.concat(`${filter}>=${kereso[filter]} AND `);
                            }
                            if (filter === 'ar') {
                                const ar = kereso[filter].replace(/ /g, '');
                                where = where.concat(`REPLACE(${filter}, ' ', '') <= ${ar} AND `);
                            }
                            if (filter === 'isHirdetheto' || filter === 'isKiemelt' || filter === 'isLift' || filter === 'isErkely' || filter === 'isUjEpitesu' || filter === 'isTetoter') {
                                where = where.concat(`${filter}='${Number(kereso[filter])}' AND `);
                            }
                            if (
                                filter === 'statusz' ||
                                filter === 'tipus' ||
                                filter === 'altipus' ||
                                filter === 'rendeltetes' ||
                                filter === 'szobaszam' ||
                                filter === 'emelet' ||
                                filter === 'epitesmod' ||
                                filter === 'futes' ||
                                filter === 'allapot' ||
                                filter === 'penznem'
                            ) {
                                where = where.concat(`${filter}='${kereso[filter]}' AND `);
                            }
                        }
                    }
                });
                

                if (kereso['telepules']) {
                    if (kereso['telepules'].km > 0) {
                        let km = kereso['telepules'].km;
                        let telepnev = kereso['telepules'].telepulesnev;
                        leftJoin = await getIngatlanokByKm(telepnev, km);
                        newWhere = `distance >= 0 ORDER BY distances.distance`;
                    } else {
                        if (kereso['telepules'].telepulesnev !== '' && leftJoin === '') {
                            newWhere = newWhere.concat(` telepules='${kereso['telepules'].telepulesnev}' AND `);
                        }
                    }
                }

                let resss = where.lastIndexOf('AND');
                if (resss !== -1) {
                    where = where.slice(0, resss - 1);
                }

                let resultNew = newWhere.lastIndexOf('AND');
                if (resultNew !== -1) {
                    newWhere = newWhere.slice(0, resultNew - 1);
                }

                let keresSql = `SELECT id FROM ingatlanok ${leftJoin !== '' ? leftJoin : ''} WHERE isAktiv='1' ${where !== '' ? 'AND ' + where : ''}${newWhere !== '' ? ' AND ' + newWhere : ''};`;

                const keresoResult = await UseQuery(keresSql);
                const ingatlanUrl = keresoResult.map((ing) => {
                    const url = `${process.env.REACT_APP_url}${ing.id}`
                    return url;
                });

                const teljesNev = `${vevo.nev.titulus && vevo.nev.titulus + ' '} ${vevo.nev.vezeteknev} ${vevo.nev.keresztnev}`;
                const mail = {
                    from: `${process.env.foEmail}`, // sender address
                    to: `${teljesNev} <${vevo.email}>`, // list of receivers
                    subject: `Ezek az ingatlanok érdekelhetik...`, // Subject line
                    html: `<b>Kedves ${teljesNev}!</b><br><br>
                    Az alábbi ingatlanok érdekelhetik:<br>
                    <ul>
                        ${ingatlanUrl.map((u) => {
                            return `<li><a href="${u}" target="_blank">${u}</a></li>`
                        })}
                        
                    </ul><br>
                    Tisztelettel:<br>
                    MyhomeImmo Kft.<br>` // html body
                }

                transporter.sendMail(mail, (err) => {
                    if (!err) {
                        res.status(200).send({ msg: 'Az ajánló email sikeresen elküldve!' });
                    } else {
                        res.status(500).send({ err: err, msg: 'Az ajánló email küldése sikertelen volt!' });
                    }
                })

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
