import fs from 'fs';
import sharp from 'sharp';
import { pool, UseQuery, hasRole, getJSONfromLongtext, getId } from '../common/QueryHelpers.js';

const addIngatlan = async (req, res) => {
    const felvitelObj = getJSONfromLongtext(req.body, 'toNumber');
    console.log(req.file);
    /*     felvitelObj.isKiemelt = getNumberFromBoolean(felvitelObj.isKiemelt);
    felvitelObj.isErkely = getNumberFromBoolean(felvitelObj.isErkely);
    felvitelObj.isLift = getNumberFromBoolean(felvitelObj.isLift);
    felvitelObj.isAktiv = getNumberFromBoolean(felvitelObj.isAktiv);
    felvitelObj.isUjEpitesu = getNumberFromBoolean(felvitelObj.isUjEpitesu);
    felvitelObj.helyseg = JSON.parse(felvitelObj.helyseg); */
    /* felvitelObj.hirdeto = JSON.parse(felvitelObj.hirdeto); */
    felvitelObj.telepules = felvitelObj.helyseg.telepules.telepulesnev;
    let id = await getId(req.headers.id, 'ingatlanok');
    const sql = `INSERT INTO ingatlanok(id, office_id, cim, leiras, helyseg, irsz, telepules, ar, kaucio, penznem, statusz, tipus, altipus, rendeltetes, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, isTetoter, hirdeto) VALUES ('${id}', '${
        felvitelObj.office_id
    }', '${felvitelObj.cim}', '${felvitelObj.leiras}', '${JSON.stringify(felvitelObj.helyseg)}', '${felvitelObj.helyseg.irszam}', '${felvitelObj.telepules}', '${felvitelObj.ar}', '${
        felvitelObj.kaucio
    }', '${felvitelObj.penznem}', '${felvitelObj.statusz}', '${felvitelObj.tipus}', '${felvitelObj.altipus}', '${felvitelObj.rendeltetes}', '${felvitelObj.allapot}', '${felvitelObj.emelet}', '${
        felvitelObj.alapterulet
    }', '${felvitelObj.telek}', '${felvitelObj.telektipus}', '${felvitelObj.beepithetoseg}', '${felvitelObj.viz}', '${felvitelObj.gaz}', '${felvitelObj.villany}', '${felvitelObj.szennyviz}', '${
        felvitelObj.szobaszam
    }', '${felvitelObj.felszobaszam}', '${felvitelObj.epitesmod}', '${felvitelObj.futes}', '${felvitelObj.isHirdetheto}', '${felvitelObj.isKiemelt}', '${felvitelObj.isErkely}', '${
        felvitelObj.isLift
    }', '${felvitelObj.isAktiv}', '${felvitelObj.isUjEpitesu}', '${felvitelObj.isTetoter}', '${JSON.stringify(felvitelObj.hirdeto)}');`;

    pool.query(sql, async (error) => {
        if (!error) {
            let kepek = [];
            if (req.files) {
                req.files.forEach((kep, index) => {
                    kepek.push({
                        filename: kep.filename,
                        isCover: index.toString() === '0' ? true : false,
                        src: `${process.env.ingatlankepekUrl}/${id}/${kep.filename}`,
                        title: kep.filename
                    });
                    let extIndex = kep.filename.lastIndexOf('.');
                    let fname = kep.filename.substring(0, extIndex);
                    sharp(kep.path)
                        .jpeg({ quality: 80 })
                        .resize({ width: 2500, height: 1500, fit: 'inside' })
                        .toBuffer((err, buff) => {
                            if (!err) {
                                fs.writeFileSync(`${process.env.ingatlankepekdir}/${id}/${fname}.jpg`, buff);
                                // TODO: megnézni, hogy jó-e a javítás...
                                sharp(buff)
                                    .toFile(`${process.env.ingatlankepekdir}/${id}/${fname}_icon.jpg`)
                                    .catch((err) => console.log(err));
                            } else {
                                console.log(err);
                            }
                        });
                    /* sharp(kep.path)
                        .resize({ width: 250, height: 200, fit: 'inside' })
                        .toBuffer((err, buff) => {
                            if (!err) {
                                fs.writeFileSync(`${process.env.ingatlankepekdir}/${id}/${fname}_icon.jpg`, buff);
                            } else {
                                console.log(err);
                            }
                        }); */
                });
            }

            const updateImagesSql = `UPDATE ingatlanok SET kepek='${JSON.stringify(kepek)}' WHERE id='${id}';`;

            const images = await UseQuery(updateImagesSql);
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
};

const editIngatlan = async (req, res, user) => {
    const id = req.headers.id;
    if (id) {
        const modositoObj = getJSONfromLongtext(req.body, 'toNumber');
        if ((modositoObj.hirdeto.feladoEmail === user.email && modositoObj.id === parseInt(id, 10)) || hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
            modositoObj.telepules = modositoObj.helyseg.telepules.telepulesnev;
            let kepek = [];
            if (modositoObj.kepek) {
                modositoObj.kepek = modositoObj.kepek;
                if (Array.isArray(modositoObj.kepek)) {
                    modositoObj.kepek.forEach((item) => {
                        kepek.push(JSON.parse(item));
                    });
                } else {
                    kepek.push(modositoObj.kepek);
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

            const sql = `UPDATE ingatlanok SET office_id='${modositoObj.office_id}', cim='${modositoObj.cim}', leiras='${modositoObj.leiras}', helyseg='${JSON.stringify(
                modositoObj.helyseg
            )}', kepek='${JSON.stringify(kepek)}', irsz='${modositoObj.helyseg.irszam}', telepules='${modositoObj.helyseg.telepules.telepulesnev}', ar='${modositoObj.ar}', kaucio='${
                modositoObj.kaucio
            }', penznem='${modositoObj.penznem}', statusz='${modositoObj.statusz}', tipus='${modositoObj.tipus}', altipus='${modositoObj.altipus}', rendeltetes='${
                modositoObj.rendeltetes
            }', allapot='${modositoObj.allapot}', emelet='${modositoObj.emelet}', alapterulet='${modositoObj.alapterulet}', telek='${modositoObj.telek}', telektipus='${
                modositoObj.telektipus
            }', beepithetoseg='${modositoObj.beepithetoseg}', viz='${modositoObj.viz}', gaz='${modositoObj.gaz}', villany='${modositoObj.villany}', szennyviz='${modositoObj.szennyviz}', szobaszam='${
                modositoObj.szobaszam
            }', felszobaszam='${modositoObj.felszobaszam}', epitesmod='${modositoObj.epitesmod}', futes='${modositoObj.futes}', isHirdetheto='${modositoObj.isHirdetheto}', isKiemelt='${
                modositoObj.isKiemelt
            }', isErkely='${modositoObj.isErkely}', isLift='${modositoObj.isLift}', isAktiv='${modositoObj.isAktiv}', isUjEpitesu='${modositoObj.isUjEpitesu}', isTetoter='${
                modositoObj.isTetoter
            }' , hirdeto='${JSON.stringify(modositoObj.hirdeto)}' WHERE id='${id}';`;
            pool.query(sql, (err) => {
                if (!err) {
                    res.status(200).send({ msg: 'Ingatlan sikeresen módosítva!' });
                } else {
                    res.status(500).send({ err: 'Ingatlan módosítása sikertelen!', msg: err });
                }
            });
        } else {
            res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
        }

        modositoObj.feladoAvatar = modositoObj.feladoAvatar ? modositoObj.feladoAvatar : '[]';
    } else {
        res.status(400).send({ err: 'Id megadása kötelező' });
    }
};

export { addIngatlan, editIngatlan };
