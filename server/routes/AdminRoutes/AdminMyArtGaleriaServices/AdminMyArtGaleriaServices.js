import { jwtparams, UseQuery, pool, validateToken, hasRole, getId, getJSONfromLongtext, getNumberFromBoolean } from '../../../common/QueryHelpers.js';
import express from 'express';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import path from 'path';
import multer from 'multer';
const router = express.Router();
const myArt = pool;

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        let id = await getId(req.headers.id, 'myart_galeriak');
        const dir = `${process.env.myartGaleriakDir}/${id}/`;
        let exist = existsSync(dir);
        if (!exist) {
            mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); //Appending .jpg
    }
});
const upload = multer({ storage: storage });

// MYARTALTALANOS START

router.get('/altalanos', async (req, res) => {
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
                const sql = `SELECT * FROM myart_altalanos WHERE id='${id}';`;
                myArt.query(sql, (err, result) => {
                    if (!err) {
                        if (hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                            let resss = result[0];
                            res.status(200).send(resss);
                        } else {
                            res.status(403).send({
                                err: 'Nincs jogosultsága az adott művelethez!'
                            });
                        }
                    }
                });
            } else {
                const sql = `SELECT * FROM myart_altalanos;`;
                myArt.query(sql, (error, ress) => {
                    if (error) {
                        res.status(500).send({ err: 'Hiba történt a MyArt Általános bejegyzés lekérdezésekor!' });
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

router.post('/altalanos', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
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
                    const sql = `CREATE TABLE IF NOT EXISTS eobgycvo_myhome.myart_altalanos (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    azonosito text DEFAULT NULL,
                    nev text DEFAULT NULL,
                    leiras text DEFAULT NULL
                  ) ENGINE=InnoDB;`;
                    myArt.query(sql, async (error) => {
                        if (!error) {
                            const myArtAltalanosSql = `SELECT azonosito FROM myart_altalanos WHERE azonosito = '${felvitelObj.azonosito}';`;
                            const result = await UseQuery(myArtAltalanosSql);
                            // if (resultEmail.rowCount === 0) {
                            if (result.length === 0) {
                                const sql = `INSERT INTO myart_altalanos (azonosito, nev, leiras)
                          VALUES ('${felvitelObj.azonosito}', '${felvitelObj.nev}', '${felvitelObj.leiras}');`;
                                myArt.query(sql, (err) => {
                                    if (!err) {
                                        res.status(200).send({
                                            msg: 'MyArt általános bejegyzés sikeresen hozzáadva!'
                                        });
                                    } else {
                                        res.status(500).send({
                                            err: err
                                        });
                                    }
                                });
                            } else {
                                res.status(400).send({
                                    err: 'Ez a MyArt általános bejegyzés már létezik!'
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
                        err: 'MyArt általános bejegyzés adatainak megadása kötelező!'
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

router.put('/altalanos', async (req, res) => {
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
                        const sql = `UPDATE myart_altalanos SET azonosito='${modositoObj.azonosito}', nev='${modositoObj.nev}', leiras='${modositoObj.leiras}' WHERE id = '${id}';`;
                        myArt.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'MyArt általános bejegyzés sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: 'MyArt általános bejegyzés módosítása sikertelen!'
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
                        err: 'MyArt általános bejegyzés adatainak megadása kötelező'
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

router.delete('/altalanos', async (req, res) => {
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
                    const sql = `DELETE FROM myart_altalanos WHERE id='${id}';`;
                    myArt.query(sql, (err) => {
                        if (!err) {
                            res.status(200).send({
                                msg: 'MyArt általános bejegyzés sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: 'MyArt általános bejegyzés törlése sikertelen!'
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

// MYARTALTALANOS END

// MYARTGALERIAK START

router.get('/galeriak', async (req, res) => {
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
                const sql = `SELECT * FROM myart_galeriak WHERE id='${id}';`;
                myArt.query(sql, (err, result) => {
                    if (!err) {
                        if (hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                            let resss = getJSONfromLongtext(result[0]);
                            // resss.isActive = resss.isActive === '0' ? true : false;
                            res.status(200).send(resss);
                        } else {
                            res.status(403).send({
                                err: 'Nincs jogosultsága az adott művelethez!'
                            });
                        }
                    }
                });
            } else {
                const sql = `SELECT id, azonosito, nev, muveszNev, muveszTelefon, muveszEmail, muveszUrl, leiras, isActive FROM myart_galeriak;`;
                myArt.query(sql, (error, ress) => {
                    if (error) {
                        res.status(500).send({ err: 'Hiba történt a MyArt Általános bejegyzés lekérdezésekor!' });
                    } else {
                        let resss = ress.map((item) => {
                            return getJSONfromLongtext(item);
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

router.post('/galeriak', upload.array('kepek'), async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
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
                    felvitelObj.isActive = getNumberFromBoolean(felvitelObj.isActive);
                    //store user, password and role
                    const sql = `CREATE TABLE IF NOT EXISTS eobgycvo_myhome.myart_galeriak (
                      id INT NOT NULL PRIMARY KEY,
                      azonosito text DEFAULT NULL,
                      nev text DEFAULT NULL,
                      muveszNev text DEFAULT NULL,
                      muveszTelefon text DEFAULT NULL,
                      muveszEmail text DEFAULT NULL,
                      muveszUrl text DEFAULT NULL,
                      kepek json DEFAULT NULL,
                      leiras text DEFAULT NULL,
                      isActive bool
                    ) ENGINE=InnoDB;`;
                    myArt.query(sql, async (error) => {
                        if (!error) {
                            const myArtGaleriakSql = `SELECT azonosito FROM myart_galeriak WHERE azonosito = '${felvitelObj.azonosito}';`;
                            const result = await UseQuery(myArtGaleriakSql);
                            // if (resultEmail.rowCount === 0) {
                            if (result.length === 0) {
                                let id = await getId(req.headers.id, 'myart_galeriak');
                                let kepek = [];
                                if (req.files) {
                                    req.files.forEach((kep) => {
                                        kepek.push({
                                            src: `${process.env.myartGaleriakUrl}/${id}/${kep.filename}`,
                                            title: kep.filename,
                                            filename: kep.filename
                                        });
                                    });
                                }

                                felvitelObj.kepek = kepek;
                                const sql = `INSERT INTO myart_galeriak (id, azonosito, nev, muveszNev, muveszTelefon, muveszEmail, muveszUrl, leiras, kepek,  isActive)
                            VALUES ('${id}', '${felvitelObj.azonosito}', '${felvitelObj.nev}', '${felvitelObj.muveszNev}', '${felvitelObj.muveszTelefon}', '${felvitelObj.muveszEmail}', '${
                                    felvitelObj.muveszUrl
                                }', '${felvitelObj.leiras}', '${JSON.stringify(felvitelObj.kepek)}', '${felvitelObj.isActive}');`;

                                myArt.query(sql, async (err) => {
                                    if (!err) {
                                        res.status(200).send({ err: null, msg: 'MyArt galéria bejegyzés hozzáadása sikeres!' });
                                    } else {
                                        res.status(500).send({ err: 'MyArt galéria bejegyzés hozzáadása sikertelen!', msg: err });
                                    }
                                });
                            } else {
                                res.status(400).send({
                                    err: 'Ez a MyArt galéria bejegyzés már létezik!'
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
                        err: 'MyArt galéria bejegyzés adatainak megadása kötelező!'
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

router.put('/galeriak', upload.array('uj_kepek'), async (req, res) => {
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
                        modositoObj.isActive = getNumberFromBoolean(modositoObj.isActive);

                        let kepek = [];
                        if (modositoObj.kepek) {
                            modositoObj.kepek = JSON.parse(JSON.stringify(modositoObj.kepek));
                            if (Array.isArray(modositoObj.kep)) {
                                modositoObj.kep.forEach((item) => {
                                    kepek.push(JSON.parse(item));
                                });
                            } else {
                                kepek.push(JSON.parse(modositoObj.kepek));
                            }
                        }

                        if (req.files) {
                            req.files.map((kep) => {
                                kepek.push({
                                    src: `${process.env.myartGaleriakUrl}/${id}/${kep.filename}`,
                                    title: kep.filename,
                                    filename: kep.filename
                                });
                            });
                        }

                        modositoObj.kep = kepek;
                        const sql = `UPDATE myart_galeriak SET azonosito='${modositoObj.azonosito}', nev='${modositoObj.nev}', muveszNev='${modositoObj.muveszNev}', muveszTelefon='${
                            modositoObj.muveszTelefon
                        }', muveszEmail='${modositoObj.muveszEmail}', muveszUrl='${modositoObj.muveszUrl}', kepek='${JSON.stringify(modositoObj.kepek)}', leiras='${modositoObj.leiras}', isActive='${
                            modositoObj.isActive
                        }' WHERE id = '${id}';`;
                        myArt.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'MyArt galéria bejegyzés sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: 'MyArt galéria bejegyzés módosítása sikertelen!'
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
                        err: 'MyArt galéria bejegyzés adatainak megadása kötelező'
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

router.delete('/galeriak', async (req, res) => {
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
                    const sql = `DELETE FROM myart_galeriak WHERE id='${id}';`;
                    myArt.query(sql, (err) => {
                        if (!err) {
                            const dir = `${process.env.myartGaleriakDir}/${id}/`;
                            rmSync(dir, { recursive: true, force: true });
                            res.status(200).send({
                                msg: 'MyArt galéria bejegyzés sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: 'MyArt galéria bejegyzés törlése sikertelen!'
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

router.post('/galeriak/deleteimage', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        const myartGaleriaId = req.headers.id;
        const { filename } = req.body;

        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                const image = `${process.env.myartGaleriakDir}/${myartGaleriaId}/${filename}`;
                console.log(image);
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

// MYARTGALERIAK END

export default router;
