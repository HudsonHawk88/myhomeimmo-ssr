import {
    jwtparams,
    poolConnect,
    validateToken,
    createIngatlanokSql,
    createIngatlanokTriggerSql,
    hasRole,
    UseQuery,
    getDataFromDatabase,
    getJSONfromLongtext,
    getBooleanFromNumber,
    getNumberFromBoolean,
    isIngatlanokTableExists
} from '../../../common/QueryHelpers.js';
import express from 'express';
import { existsSync, mkdirSync, writeFileSync, rmdirSync, rmSync } from 'fs';
import multer from 'multer';
/* import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.resolve(__dirname,'../.env'),
}); */

const router = express.Router();
const ingatlanok = poolConnect;

const getId = async (reqID) => {
    let id = undefined;
    if (reqID !== undefined) {
        id = parseInt(reqID, 10);
    } else {
        const isExist = await isIngatlanokTableExists(ingatlanok);
        if (isExist) {
            const getLastIdSql = `SELECT MAX(id) as id FROM ingatlanok;`;
            let result = await UseQuery(ingatlanok, getLastIdSql);
            let newID = result[0].id;
            if (newID && newID !== 'null') {
                id = newID + 1;
            } else {
                id = 1;
            }
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
                let sss = await getDataFromDatabase(req.method, sql, id);
                ingatlanok.query(sql, (err, result) => {
                    if (!err) {
                        let ressss = [];

                        result.map((ing) => {
                            const rrrr = getJSONfromLongtext(ing);
                            ressss.push(rrrr);
                        });
                        res.status(200).send(ressss);
                    } else {
                        res.status(500).send({ err: err });
                    }
                });
            } else {
                const sql = `SELECT id, refid, cim, leiras, helyseg, irsz, altipus, rendeltetes, hirdeto, ar, kepek, kaucio, penznem, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, rogzitIdo, hirdeto
                FROM ingatlanok`;
                ingatlanok.query(sql, async (err, result) => {
                    if (!err) {
                        let ressss = result;

                        await ressss.map((ing) => {
                            const rrrr = getJSONfromLongtext(ing);
                            return rrrr;
                        });
                        res.status(200).send(ressss);
                    } else {
                        res.status(500).send({ err: err });
                    }
                });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

router.post('/deleteimage', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        const ingatlanId = req.headers.id;
        const { filename } = req.body;

        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                const image = `${process.env.ingatlankepekdir}/${ingatlanId}/${filename}`;
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
                    ingatlanok.query(createIngatlanokSql);
                    const isExist = await isIngatlanokTableExists(ingatlanok);
                    if (!isExist) {
                        ingatlanok.query(createIngatlanokTriggerSql);
                    }

                    felvitelObj.isKiemelt = getNumberFromBoolean(felvitelObj.isKiemelt);
                    felvitelObj.isErkely = getNumberFromBoolean(felvitelObj.isErkely);
                    felvitelObj.isLift = getNumberFromBoolean(felvitelObj.isLift);
                    felvitelObj.isAktiv = getNumberFromBoolean(felvitelObj.isAktiv);
                    felvitelObj.isUjEpitesu = getNumberFromBoolean(felvitelObj.isUjEpitesu);

                    felvitelObj.helyseg = JSON.parse(felvitelObj.helyseg);
                    console.log(felvitelObj);
                    /* felvitelObj.hirdeto = JSON.parse(felvitelObj.hirdeto); */
                    console.log(typeof felvitelObj.hirdeto, felvitelObj.helyseg.telepules.telepulesnev);
                    felvitelObj.telepules = felvitelObj.helyseg.telepules.telepulesnev;
                    const getUserAvatarSql = `SELECT avatar FROM adminusers WHERE email='${user.email}'`;
                    const userAvatar = await UseQuery(ingatlanok, getUserAvatarSql);
                    const avatar = userAvatar ? userAvatar[0].avatar : [];
                    let id = await getId(req.headers.id);
                    const sql = `INSERT INTO ingatlanok(id, cim, leiras, helyseg, irsz, telepules, ar, kaucio, penznem, statusz, tipus, altipus, rendeltetes, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, hirdeto) VALUES ('${id}', '${
                        felvitelObj.cim
                    }', '${felvitelObj.leiras}', '${JSON.stringify(felvitelObj.helyseg)}', '${felvitelObj.helyseg.irszam}', '${felvitelObj.telepules}', '${felvitelObj.ar}', '${
                        felvitelObj.kaucio
                    }', '${felvitelObj.penznem}', '${felvitelObj.statusz}', '${felvitelObj.tipus}', '${felvitelObj.altipus}', '${felvitelObj.rendeltetes}', '${felvitelObj.allapot}', '${
                        felvitelObj.emelet
                    }', '${felvitelObj.alapterulet}', '${felvitelObj.telek}', '${felvitelObj.telektipus}', '${felvitelObj.beepithetoseg}', '${felvitelObj.viz}', '${felvitelObj.gaz}', '${
                        felvitelObj.villany
                    }', '${felvitelObj.szennyviz}', '${felvitelObj.szobaszam}', '${felvitelObj.felszobaszam}', '${felvitelObj.epitesmod}', '${felvitelObj.futes}', '${felvitelObj.isHirdetheto}', '${
                        felvitelObj.isKiemelt
                    }', '${felvitelObj.isErkely}', '${felvitelObj.isLift}', '${felvitelObj.isAktiv}', '${felvitelObj.isUjEpitesu}', '${felvitelObj.hirdeto}');`;

                    ingatlanok.query(sql, async (error) => {
                        if (!error) {
                            let kepek = [];
                            if (req.files) {
                                req.files.map((kep, index) => {
                                    kepek.push({
                                        filename: kep.filename,
                                        isCover: index.toString() === '1' ? true : false,
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

                            const images = await UseQuery(ingatlanok, updateImagesSql);
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

                        modositoObj.isKiemelt = getNumberFromBoolean(modositoObj.isKiemelt);
                        modositoObj.isErkely = getNumberFromBoolean(modositoObj.isErkely);
                        modositoObj.isLift = getNumberFromBoolean(modositoObj.isLift);
                        modositoObj.isAktiv = getNumberFromBoolean(modositoObj.isAktiv);
                        modositoObj.isUjEpitesu = getNumberFromBoolean(modositoObj.isUjEpitesu);
                        modositoObj.hirdeto = JSON.parse(modositoObj.hirdeto);

                        modositoObj.feladoAvatar = modositoObj.feladoAvatar ? modositoObj.feladoAvatar : '[]';
                        modositoObj.helyseg = JSON.parse(modositoObj.helyseg);
                        modositoObj.telepules = modositoObj.helyseg.telepules.telepulesnev;
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

                        console.log(modositoObj.isAktiv, typeof modositoObj.isAktiv);

                        const sql = `UPDATE ingatlanok SET cim='${modositoObj.cim}', leiras='${modositoObj.leiras}', helyseg='${JSON.stringify(modositoObj.helyseg)}', kepek='${JSON.stringify(
                            kepek
                        )}', irsz='${modositoObj.irsz}', telepules='${modositoObj.telepules}', ar='${modositoObj.ar}', kaucio='${modositoObj.kaucio}', penznem='${modositoObj.penznem}', statusz='${
                            modositoObj.statusz
                        }', tipus='${modositoObj.tipus}', altipus='${modositoObj.altipus}', rendeltetes='${modositoObj.rendeltetes}', allapot='${modositoObj.allapot}', emelet='${
                            modositoObj.emelet
                        }', alapterulet='${modositoObj.alapterulet}', telek='${modositoObj.telek}', telektipus='${modositoObj.telektipus}', beepithetoseg='${modositoObj.beepithetoseg}', viz='${
                            modositoObj.viz
                        }', gaz='${modositoObj.gaz}', villany='${modositoObj.villany}', szennyviz='${modositoObj.szennyviz}', szobaszam='${modositoObj.szobaszam}', felszobaszam='${
                            modositoObj.felszobaszam
                        }', epitesmod='${modositoObj.epitesmod}', futes='${modositoObj.futes}', isHirdetheto='${modositoObj.isHirdetheto}', isKiemelt='${modositoObj.isKiemelt}', isErkely='${
                            modositoObj.isErkely
                        }', isLift='${modositoObj.isLift}', isAktiv='${modositoObj.isAktiv}', isUjEpitesu='${modositoObj.isUjEpitesu}', hirdeto='${JSON.stringify(
                            modositoObj.hirdeto
                        )}' WHERE id='${id}';`;
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

export default router;
