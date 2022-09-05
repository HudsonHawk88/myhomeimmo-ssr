const { jwtparams, poolConnect, validateToken, createIngatlanokSql, createIngatlanokTriggerSql, hasRole, useQuery } = require('../../../common/QueryHelpers');
const router = require('express').Router();
const ingatlanok = poolConnect();
const { existsSync, mkdirSync, writeFileSync, rmdirSync, rmSync } = require('fs');
const multer = require('multer');

const getId = async (reqID) => {
    let id = undefined;
    if (reqID !== undefined) {
        id = parseInt(reqID, 10);
    } else {
        const getLastIdSql = `SELECT MAX(id) as id FROM ingatlanok;`;
        let result = await useQuery(ingatlanok, getLastIdSql);
        let newID = result[0].id;
        if (newID && newID !== 'null') {
            id = newID + 1;
        } else {
            id = 1;
        }
    }

    return id;
};

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        let id = await getId(req.headers.id);
        const dir = `${process.env.ingatlankepekdir}/${id}/`;
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

const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, callBack) => {
//       callBack(null, './public/images/')     // './public/images/' directory name where save the file
//   },
//   filename: (req, file, callBack) => {
//       callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//   }
// })

// var upload = multer({
//   storage: storage
// });

const getDir = (id) => {
    return `./public/images/ingatlanok/${id}`;
};

// INGATLANOK START

router.get('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const id = req.headers.id;
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (id) {
                const sql = `SELECT * FROM ingatlanok WHERE id='${id}';`;
                ingatlanok.query(sql, async (err, result) => {
                    if (!err) {
                        let ressss = result;
                        await ressss.map((ing) => {
                            if (ing.kepek) {
                                ing.kepek = JSON.parse(ing.kepek);
                            }
                            if (ing.rogzitoAvatar) {
                                ing.rogzitoAvatar = JSON.parse(ing.rogzitoAvatar);
                            }
                            ing.helyseg = JSON.parse(ing.helyseg);
                            ing.isHirdetheto = ing.isHirdetheto === 0 ? true : false;
                            ing.isKiemelt = ing.isKiemelt === 0 ? true : false;
                            ing.isErkely = ing.isErkely === 0 ? true : false;
                            ing.isLift = ing.isLift === 0 ? true : false;
                            ing.isAktiv = ing.isAktiv === 0 ? true : false;
                            ing.isUjEpitesu = ing.isUjEpitesu === 0 ? true : false;
                        });
                        res.status(200).send(ressss);
                    } else {
                        res.status(500).send({ err: err });
                    }
                });
            } else {
                res.status(400).send({ err: 'Id megadása kötelező!' });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

router.post('/uploadImage', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);

        // const user = { roles: [{ value: "SZUPER_ADMIN"}] };
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            const { kepek, ingatlanId } = req.body;
            if (kepek && ingatlanId) {
            }
        }
    }
});

router.post('/', upload.array('kepek'), async (req, res) => {
    const token = req.cookies.JWT_TOKEN;

    if (token) {
        const user = await validateToken(token, jwtparams.secret);

        // const user = { roles: [{ value: "SZUPER_ADMIN"}] };
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                let felvitelObj = req.body;
                if (felvitelObj) {
                    felvitelObj = JSON.parse(JSON.stringify(felvitelObj));
                    const createSql = createIngatlanokSql;
                    const createTriggerSql = createIngatlanokTriggerSql;

                    ingatlanok.query(createSql, async (errr) => {
                        if (errr) {
                            res.status(500).send({ err: errr });
                        } else {
                            felvitelObj.isKiemelt = felvitelObj.isKiemelt === 'true' ? 0 : 1;
                            felvitelObj.isHirdetheto = felvitelObj.isHirdetheto === 'true' ? 0 : 1;
                            felvitelObj.isErkely = felvitelObj.isErkely === 'true' ? 0 : 1;
                            felvitelObj.isLift = felvitelObj.isLift === 'true' ? 0 : 1;
                            felvitelObj.isAktiv = felvitelObj.isAktiv === 'true' ? 0 : 1;
                            felvitelObj.isUjEpitesu = felvitelObj.isUjEpitesu === 'true' ? 0 : 1;
                            felvitelObj.helyseg = JSON.parse(felvitelObj.helyseg);
                            const getUserAvatarSql = `SELECT avatar FROM adminusers WHERE email='${user.email}'`;
                            const userAvatar = await useQuery(ingatlanok, getUserAvatarSql);
                            const avatar = userAvatar ? userAvatar[0].avatar : [];
                            let id = await getId(req.headers.id);
                            const sql = `INSERT INTO ingatlanok(id, cim, leiras, helyseg, irsz, telepules, ar, kaucio, penznem, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, rogzitoNev, rogzitoEmail, rogzitoTelefon, rogzitoAvatar) VALUES ('${id}', '${
                                felvitelObj.cim
                            }', '${felvitelObj.leiras}', '${JSON.stringify(felvitelObj.helyseg)}', '${felvitelObj.helyseg.irszam}', '${felvitelObj.telepules}', '${felvitelObj.ar}', '${
                                felvitelObj.kaucio
                            }', '${felvitelObj.penznem}', '${felvitelObj.statusz}', '${felvitelObj.tipus}', '${felvitelObj.allapot}', '${felvitelObj.emelet}', '${felvitelObj.alapterulet}', '${
                                felvitelObj.telek
                            }', '${felvitelObj.telektipus}', '${felvitelObj.beepithetoseg}', '${felvitelObj.viz}', '${felvitelObj.gaz}', '${felvitelObj.villany}', '${felvitelObj.szennyviz}', '${
                                felvitelObj.szobaszam
                            }', '${felvitelObj.felszobaszam}', '${felvitelObj.epitesmod}', '${felvitelObj.futes}', '${felvitelObj.isHirdetheto}', '${felvitelObj.isKiemelt}', '${
                                felvitelObj.isErkely
                            }', '${felvitelObj.isLift}', '${felvitelObj.isAktiv}', '${felvitelObj.isUjEpitesu}', '${felvitelObj.feladoNev}', '${felvitelObj.feladoEmail}', '${
                                felvitelObj.feladoTelefon
                            }', '${avatar}');`;

                            ingatlanok.query(sql, async (error) => {
                                if (!error) {
                                    let kepek = [];
                                    if (req.files) {
                                        req.files.map((kep, index) => {
                                            kepek.push({
                                                filename: kep.filename,
                                                isCover: index.toString() === '0' ? true : false,
                                                src: `${process.env.ingatlankepekUrl}/${id}/${kep.filename}`,
                                                title: kep.filename
                                            });
                                        });
                                    }

                                    felvitelObj.kepek = kepek;

                                    // const dir = `/home/eobgycvo/public_html/images/ingatlanok/${id}/`;
                                    // let exist = existsSync(dir);
                                    // if (!exist) {
                                    //   mkdirSync(dir);
                                    //   felvitelObj.kepek.forEach((item) => {
                                    //     const img = item.preview;
                                    //     // const data = img.replace(/^data:image\/\w+;base64,/, "");
                                    //     const buf = Buffer.from(item.file);
                                    //     console.log(buf);
                                    //     writeFileSync(path.join(dir,item.filename), buf);
                                    //     delete item.preview
                                    //   })
                                    // }

                                    const updateImagesSql = `UPDATE ingatlanok SET kepek='${JSON.stringify(felvitelObj.kepek)}' WHERE id='${id}';`;

                                    const images = await useQuery(ingatlanok, updateImagesSql);
                                    if (images) {
                                        res.status(200).send({ msg: 'Ingatlan sikeresen hozzáadva!' });
                                    } else {
                                        res.status(500).send({ err: 'ingatlan képek feltöltése sikertelen!' });
                                    }
                                } else {
                                    res.status(500).send({
                                        err: error,
                                        msg: 'Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!'
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.status(400).send({ err: 'Ingatlan adatainak megadása kötelező' });
                }
            } else {
                res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

router.put('/', upload.array('uj_kepek'), async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                let modositoObj = req.body;
                const id = req.headers.id;
                if (modositoObj) {
                    if (id) {
                        modositoObj = JSON.parse(JSON.stringify(modositoObj));
                        modositoObj.isKiemelt = modositoObj.isKiemelt === 'true' ? 0 : 1;
                        modositoObj.isHirdetheto = modositoObj.isHirdetheto === 'true' ? 0 : 1;
                        modositoObj.isErkely = modositoObj.isErkely === 'true' ? 0 : 1;
                        modositoObj.isLift = modositoObj.isLift === 'true' ? 0 : 1;
                        modositoObj.isAktiv = modositoObj.isAktiv === 'true' ? 0 : 1;
                        modositoObj.isUjEpitesu = modositoObj.isUjEpitesu === 'true' ? 0 : 1;
                        modositoObj.helyseg = JSON.parse(modositoObj.helyseg);
                        modositoObj.feladoAvatar = modositoObj.feladoAvatar ? modositoObj.feladoAvatar : '[]';

                        let kepek = [];
                        if (modositoObj.kepek) {
                            modositoObj.kepek = JSON.parse(JSON.stringify(modositoObj.kepek));
                            if (Array.isArray(modositoObj.kepek)) {
                                modositoObj.kepek.forEach((item) => {
                                    kepek.push(JSON.parse(item));
                                });
                            } else {
                                kepek.push(JSON.parse(modositoObj.kepek));
                            }
                        }
                        if (req.files) {
                            req.files.map((kep, index) => {
                                kepek.push({
                                    filename: kep.filename,
                                    isCover: false,
                                    src: `${process.env.ingatlankepekUrl}/${id}/${kep.filename}`,
                                    title: kep.filename
                                });
                            });
                        }

                        kepek.forEach((kep, index) => {
                            kep.isCover = index.toString() === '0' ? true : false;
                        });

                        const sql = `UPDATE ingatlanok SET cim='${modositoObj.cim}', leiras='${modositoObj.leiras}', helyseg='${JSON.stringify(modositoObj.helyseg)}', kepek='${JSON.stringify(
                            kepek
                        )}', irsz='${modositoObj.irsz}', telepules='${modositoObj.telepules}', ar='${modositoObj.ar}', kaucio='${modositoObj.kaucio}', penznem='${modositoObj.penznem}', statusz='${
                            modositoObj.statusz
                        }', tipus='${modositoObj.tipus}', allapot='${modositoObj.allapot}', emelet='${modositoObj.emelet}', alapterulet='${modositoObj.alapterulet}', telek='${
                            modositoObj.telek
                        }', telektipus='${modositoObj.telektipus}', beepithetoseg='${modositoObj.beepithetoseg}', viz='${modositoObj.viz}', gaz='${modositoObj.gaz}', villany='${
                            modositoObj.villany
                        }', szennyviz='${modositoObj.szennyviz}', szobaszam='${modositoObj.szobaszam}', felszobaszam='${modositoObj.felszobaszam}', epitesmod='${modositoObj.epitesmod}', futes='${
                            modositoObj.futes
                        }', isHirdetheto='${modositoObj.isHirdetheto}', isKiemelt='${modositoObj.isKiemelt}', isErkely='${modositoObj.isErkely}', isLift='${modositoObj.isLift}', isAktiv='${
                            modositoObj.isAktiv
                        }', isUjEpitesu='${modositoObj.isUjEpitesu}', rogzitoNev='${modositoObj.feladoNev}', rogzitoEmail='${modositoObj.feladoEmail}', rogzitoTelefon='${
                            modositoObj.feladoTelefon
                        }', rogzitoAvatar='${modositoObj.feladoAvatar}' WHERE id='${id}';`;
                        ingatlanok.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({ msg: 'Ingatlan sikeresen módosítva!' });
                            } else {
                                res.status(500).send({ err: 'Ingatlan módosítása sikertelen!', msg: err });
                            }
                        });
                    } else {
                        res.status(400).send({ err: 'Id megadása kötelező' });
                    }
                } else {
                    res.status(400).send({ err: 'Ingatlan adatainak megadása kötelező' });
                }
            } else {
                res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

router.delete('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            // TODO hozzáadni a feltöltő regisztrált usert is a jogosultakhoz!!!
            const id = req.headers.id;
            if (id) {
                // let userEmail = undefined;
                // const selectSql = `SELECT email FROM ingatlanok WHERE id='${id}';`;
                // ingatlanok.query(selectSql, (err, result) => {
                //     if (!err) {
                //         userEmail = result.rows[0].email;
                //     }
                // });
                if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                    const sql = `DELETE FROM ingatlanok WHERE id='${id}';`;
                    // const sql = `DELETE FROM ingatlanok WHERE id='${id}' AND email='${user.email}';`;
                    ingatlanok.query(sql, (err) => {
                        if (!err) {
                            const dir = `${process.env.ingatlankepekdir}/${id}/`;
                            rmSync(dir, { recursive: true, force: true });
                            res.status(200).send({ msg: 'Ingatlan sikeresen törölve!' });
                        } else {
                            res.status(500).send({ err: 'Ingatlan törlése sikertelen!' });
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

// INGATLANOK END

module.exports = router;
