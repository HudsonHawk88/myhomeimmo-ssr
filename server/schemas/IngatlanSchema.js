import { existsSync, mkdirSync, writeFileSync } from 'fs';
import sharp from 'sharp';
import nodemailer from 'nodemailer';
import moment from 'moment';
import { pool, mailUrl, UseQuery, hasRole, getJSONfromLongtext, getId, log } from '../common/QueryHelpers.js';

const transporter = nodemailer.createTransport(mailUrl);

const addIngatlan = async (req, res) => {
    const felvitelObj = getJSONfromLongtext(req.body, 'toNumber');
    /*   console.log(req.file); */
    /*     felvitelObj.isKiemelt = getNumberFromBoolean(felvitelObj.isKiemelt);
    felvitelObj.isErkely = getNumberFromBoolean(felvitelObj.isErkely);
    felvitelObj.isLift = getNumberFromBoolean(felvitelObj.isLift);
    felvitelObj.isAktiv = getNumberFromBoolean(felvitelObj.isAktiv);
    felvitelObj.isUjEpitesu = getNumberFromBoolean(felvitelObj.isUjEpitesu);
    felvitelObj.helyseg = JSON.parse(felvitelObj.helyseg); */
    /* felvitelObj.hirdeto = JSON.parse(felvitelObj.hirdeto); */
    felvitelObj.telepules = felvitelObj.helyseg.telepules.telepulesnev;
    let id = await getId(req.headers.id, 'ingatlanok');

    const getAdminAvatarSql = `SELECT id, email, avatar FROM adminusers WHERE email = '${felvitelObj.hirdeto.feladoEmail}'`;

    /*     console.log('SQL: ', getAdminAvatarSql); */

    const admin = await UseQuery(getAdminAvatarSql, 'POST /api/admin/ingatlanok');

    if (admin && admin[0].avatar) {
        felvitelObj.hirdeto.feladoAvatar = JSON.parse(admin[0].avatar);
    } else {
        felvitelObj.hirdeto.feladoAvatar = [{ src: '`${process.env.mainUrl}/stattic/images/noavatar.png`', filename: 'noavatar.png', title: 'noavatar.png' }];
    }

    const sql = `INSERT INTO ingatlanok(id, office_id, cim, leiras, helyseg, irsz, telepules, ar, kaucio, penznem, statusz, tipus, altipus, rendeltetes, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, villanyfogy, gazfogy, etanusitvany, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, isTetoter, isVip, hirdeto) VALUES ('${id}', '${
        felvitelObj.office_id
    }', '${felvitelObj.cim}', '${felvitelObj.leiras}', '${JSON.stringify(felvitelObj.helyseg)}', '${felvitelObj.helyseg.irszam}', '${felvitelObj.telepules}', '${felvitelObj.ar}', '${
        felvitelObj.kaucio
    }', '${felvitelObj.penznem}', '${felvitelObj.statusz}', '${felvitelObj.tipus}', '${felvitelObj.altipus}', '${felvitelObj.rendeltetes}', '${felvitelObj.allapot}', '${felvitelObj.emelet}', '${
        felvitelObj.alapterulet
    }', '${felvitelObj.telek}', '${felvitelObj.telektipus}', '${felvitelObj.beepithetoseg}', '${felvitelObj.viz}', '${felvitelObj.gaz}', '${felvitelObj.villany}', '${felvitelObj.szennyviz}', '${
        felvitelObj.szobaszam
    }', '${felvitelObj.felszobaszam}', '${felvitelObj.epitesmod}', '${felvitelObj.futes}', '${felvitelObj.villanyfogy}', '${felvitelObj.gazfogy}', '${felvitelObj.etanusitvany}', '${
        felvitelObj.isHirdetheto
    }', '${felvitelObj.isKiemelt}', '${felvitelObj.isErkely}', '${felvitelObj.isLift}', '${felvitelObj.isAktiv}', '${felvitelObj.isUjEpitesu}', '${felvitelObj.isTetoter}', '${
        felvitelObj.isVip
    }',  '${JSON.stringify(felvitelObj.hirdeto)}');`;

    pool.query(sql, async (error) => {
        if (!error) {
            let kepek = [];
            if (req.files) {
                req.files.forEach((kep, index) => {
                    let extIndex = kep.originalname.lastIndexOf('.');
                    let fname = kep.originalname.substring(0, extIndex);
                    kepek.push({
                        filename: `${fname}.jpg`,
                        isCover: index.toString() === '0' ? true : false,
                        src: `${process.env.ingatlankepekUrl}/${id}/${fname}.jpg`,
                        title: `${fname}.jpg`
                    });
                    /* let extIndex = kep.filename.lastIndexOf('.');
                    let fname = kep.filename.substring(0, extIndex);
                    sharp(kep.path)
                        .jpeg({ quality: 80 })
                        .resize({ width: 2500, height: 1500, fit: 'inside' })
                        .toBuffer((err, buff) => {
                            if (!err) {
                                fs.writeFileSync(`${process.env.ingatlankepekdir}/${id}/${fname}.jpg`, buff);
                                // TODO: megnézni, hogy jó-e a javítás...
                                sharp(buff)
                                    .resize({ width: 250, height: 200, fit: 'inside' })
                                    .toFile(`${process.env.ingatlankepekdir}/${id}/${fname}_icon.jpg`)
                                    .catch((err) => console.log(err));
                            } else {
                                console.log(err);
                            }
                        }); */

                    sharp(kep.buffer)
                        .jpeg({ quality: 80 })
                        .resize({ width: 1500, fit: 'inside' })
                        .withMetadata()
                        .toBuffer((err, buff) => {
                            if (!err) {
                                const dir = `${process.env.ingatlankepekdir}/${id}`;
                                const isDirExist = existsSync(dir);
                                if (!isDirExist) {
                                    mkdirSync(dir);
                                }
                                writeFileSync(`${dir}/${fname}.jpg`, buff);
                                sharp(buff).resize({ width: 250, height: 200, fit: 'inside' }).toFile(`${dir}/${fname}_icon.jpg`);
                                log('POST /api/admin/ingatlanok', `Kép hozzáadva: ${dir}/${fname}_icon.jpg\n`);
                            } else {
                                log('POST /api/admin/ingatlanok', err);
                            }
                        });
                });
            }

            const updateImagesSql = `UPDATE ingatlanok SET kepek='${JSON.stringify(kepek)}' WHERE id='${id}';`;

            const images = await UseQuery(updateImagesSql, 'POST /api/admin/ingatlanok');
            if (images) {
                res.status(200).send({ msg: 'Ingatlan sikeresen hozzáadva!', ingatlanId: id });
            } else {
                res.status(500).send({ err: 'ingatlan képek feltöltése sikertelen!' });
            }
        } else {
            log('POST /api/admin/ingatlanok', error);
            res.status(500).send({
                err: error,
                msg: 'Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!'
            });
        }
    });
};

const editIngatlan = async (req, res, user, nev) => {
    const id = req.headers.id;
    if (id) {
        const modositoObj = getJSONfromLongtext(req.body, 'toNumber');
        if ((modositoObj.hirdeto.feladoEmail === user.email && modositoObj.id === parseInt(id, 10)) || hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
            modositoObj.telepules = modositoObj.helyseg.telepules.telepulesnev;
            let kepek = [];
            if (modositoObj.kepek) {
                kepek = modositoObj.kepek;
                /* if (Array.isArray(modositoObj.kepek)) {
                    modositoObj.kepek.forEach((item) => {
                        kepek.push(item);
                    });
                } else {
                    kepek = modositoObj.kepek;
                } */
            }
            console.log(req.files);
            if (req.files && req.files.length > 0) {
                console.log(req.files.length);
                req.files.map((kep) => {
                    let extIndex = kep.originalname.lastIndexOf('.');
                    let fname = kep.originalname.substring(0, extIndex);
                    const dir = `${process.env.ingatlankepekdir}/${id}`;
                    if (kepek.find((k) => k.originalname === kep.originalname)) {
                        kepek.push({
                            filename: `${fname}.jpg`,
                            isCover: false,
                            src: `${process.env.ingatlankepekUrl}/${id}/${fname}.jpg`,
                            title: `${fname}.jpg`
                        });
                    }

                    sharp(kep.buffer)
                        .jpeg({ quality: 80 })
                        .resize({ width: 1500, fit: 'inside' })
                        .withMetadata()
                        .toBuffer((err, buff) => {
                            if (!err) {
                                const isDirExist = existsSync(dir);
                                if (!isDirExist) {
                                    mkdirSync(dir);
                                }
                                writeFileSync(`${process.env.ingatlankepekdir}/${id}/${fname}.jpg`, buff);
                                sharp(buff).resize({ width: 250, height: 200, fit: 'inside' }).toFile(`${dir}/${fname}_icon.jpg`);
                            } else {
                                log('PUT /api/admin/ingatlanok', err);
                            }
                        });
                });
            }

            kepek.forEach((kep, index) => {
                kep.isCover = index.toString() === '0' ? true : false;
            });

            const modIdo = moment().locale('hu').format('YYYY-MM-DD HH:mm:ss.000');

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
            }', felszobaszam='${modositoObj.felszobaszam}', epitesmod='${modositoObj.epitesmod}', futes='${modositoObj.futes}', villanyfogy='${modositoObj.villanyfogy}', gazfogy='${
                modositoObj.gazfogy
            }', etanusitvany='${modositoObj.etanusitvany}', isHirdetheto='${modositoObj.isHirdetheto}', isKiemelt='${modositoObj.isKiemelt}', isErkely='${modositoObj.isErkely}', isLift='${
                modositoObj.isLift
            }', isAktiv='${kepek.length > 0 ? modositoObj.isAktiv : 0}', isUjEpitesu='${modositoObj.isUjEpitesu}', isTetoter='${modositoObj.isTetoter}', isVip='${
                modositoObj.isVip
            }', hirdeto='${JSON.stringify(modositoObj.hirdeto)}', modUser='${nev}' WHERE id='${id}';`;
            pool.query(sql, (err) => {
                if (!err) {
                    let nev = JSON.parse(user.nev);
                    if (hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                        const teljesNev = `${nev.titulus && nev.titulus + ' '} ${nev.vezeteknev} ${nev.keresztnev}`;
                        const ingId = modositoObj.id;

                        const mail = {
                            from: `${teljesNev} <${user.email}>`, // sender address
                            to: `${modositoObj.hirdeto.feladoEmail}`, // list of receivers
                            subject: `${teljesNev} ${modositoObj.isAktiv ? 'publikussá' : 'inkatívvá'} tette a hirdetésed!`, // Subject line
                            html: `<b>Kedves ${modositoObj.hirdeto.feladoNev}!</b><br><br>
                            ${teljesNev} admin ${modositoObj.isAktiv ? 'publikussá tette a hirdetésed!' : 'levette a hirdetésed láthatóságát!'} Az ingatlanod id-je: ${
                                ingId ? ingId : 'Nincs id, valami hiba van...'
                            }<br><br>
                            Tisztelettel:<br>
                            ${teljesNev}`
                        };
                        transporter.sendMail(mail, (mailerr) => {
                            if (!mailerr) {
                                res.status(200).send({ msg: 'Ingatlan sikeresen módosítva és e-mail sikeresen elküldve a hirdetőnek!' });
                            } else {
                                log('PUT /api/admin/ingatlanok', mailerr);
                                res.status(409).send({ err: mailerr, msg: 'Hiba történt a levélküldéskor!' });
                            }
                        });
                    } else {
                        res.status(200).send({ msg: 'Ingatlan sikeresen módosítva!' });
                    }
                } else {
                    log('PUT /api/admin/ingatlanok', err);
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
