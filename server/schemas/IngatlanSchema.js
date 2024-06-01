import { existsSync, mkdirSync, writeFileSync } from 'fs';
import sharp from 'sharp';
import nodemailer from 'nodemailer';
import moment from 'moment';
import { pool, mailUrl, UseQuery, hasRole, getJSONfromLongtext, getId, log, validateToken, jwtparams } from '../common/QueryHelpers.js';

const transporter = nodemailer.createTransport(mailUrl);

const addIngatlan = async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    const user = await validateToken(token, jwtparams.secret);
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
    let kepek = [];
    let nempubcsatolmanyok = [];

    const getErtSql = `SELECT nev, email, isErtekesito FROM adminusers`;

    const ertekesitok = await UseQuery(getErtSql, 'GET /api/admin/adminusers');

    if (req.files) {
        req.files.forEach((file, index) => {
            let extIndex = file.originalname.lastIndexOf('.');
            let fname = file.originalname.substring(0, extIndex);
            let ext = file.originalname.substring(extIndex + 1, file.originalname.length);

            if (file.fieldname === 'kepek') {
                kepek.push({
                    filename: `${fname}.jpg`,
                    isCover: index.toString() === '0' ? true : false,
                    src: `${process.env.ingatlankepekUrl}/${id}/${fname}.jpg`,
                    title: `${fname}.jpg`
                });

                sharp(file.buffer)
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
            }
            if (file.fieldname === 'nempubcsatolmanyok') {
                console.log('file, file:TYPE: ', file, file.tpye);
                if (file.mimetype.includes('image')) {
                    nempubcsatolmanyok.push({
                        filename: `${fname}.jpg`,
                        src: `${process.env.ingatlankepekUrl}/${id}/nempubcsatolmanyok/${fname}.jpg`,
                        title: `${fname}.jpg`,
                        type: file.mimetype
                    });

                    sharp(file.buffer)
                        .jpeg({ quality: 80 })
                        .resize({ width: 1500, fit: 'inside' })
                        .withMetadata()
                        .toBuffer((err, buff) => {
                            if (!err) {
                                const dir = `${process.env.ingatlankepekdir}/${id}/nempubcsatolmanyok`;
                                const isDirExist = existsSync(dir);
                                if (!isDirExist) {
                                    mkdirSync(dir, { recursive: true });
                                }
                                writeFileSync(`${dir}/${fname}.jpg`, buff);
                                log('POST /api/admin/projektek', `Kép hozzáadva: ${dir}/${fname}_icon.jpg\n`);
                            } else {
                                log('POST /api/admin/projektek', err);
                            }
                        });
                } else {
                    nempubcsatolmanyok.push({
                        filename: `${fname}.${ext}`,
                        src: `${process.env.ingatlankepekUrl}/${id}/nempubcsatolmanyok/${fname}.${ext}`,
                        title: `${fname}.${ext}`,
                        type: file.mimetype
                    });

                    const dir = `${process.env.ingatlankepekdir}/${id}/nempubcsatolmanyok`;
                    const isDirExist = existsSync(dir);
                    if (!isDirExist) {
                        mkdirSync(dir, { recursive: true });
                    }
                    writeFileSync(`${dir}/${fname}.${ext}`, file.buffer);
                }
            }
        });
    }

    const sql = `INSERT INTO ingatlanok(id, office_id, cim, leiras, helyseg, irsz, telepules, ar, kaucio, penznem, statusz, tipus, altipus, rendeltetes, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, villanyfogy, gazfogy, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, isTetoter, isVip, hirdeto, jutalek, megbizaskelte, megbizasvege, nempubmegjegyzes, kepek, nempubcsatolmanyok) VALUES ('${id}', '${
        felvitelObj.office_id
    }', '${felvitelObj.cim}', '${felvitelObj.leiras}', '${JSON.stringify(felvitelObj.helyseg)}', '${felvitelObj.helyseg.irszam}', '${felvitelObj.telepules}', '${felvitelObj.ar}', '${
        felvitelObj.kaucio
    }', '${felvitelObj.penznem}', '${felvitelObj.statusz}', '${felvitelObj.tipus}', '${felvitelObj.altipus}', '${felvitelObj.rendeltetes}', '${felvitelObj.allapot}', '${felvitelObj.emelet}', '${
        felvitelObj.alapterulet
    }', '${felvitelObj.telek}', '${felvitelObj.telektipus}', '${felvitelObj.beepithetoseg}', '${felvitelObj.viz}', '${felvitelObj.gaz}', '${felvitelObj.villany}', '${felvitelObj.szennyviz}', '${
        felvitelObj.szobaszam
    }', '${felvitelObj.felszobaszam}', '${felvitelObj.epitesmod}', '${felvitelObj.futes}', '${felvitelObj.villanyfogy}', '${felvitelObj.gazfogy}', '${felvitelObj.isHirdetheto}', '${
        felvitelObj.isKiemelt
    }', '${felvitelObj.isErkely}', '${felvitelObj.isLift}', '${felvitelObj.isAktiv}', '${felvitelObj.isUjEpitesu}', '${felvitelObj.isTetoter}', '${felvitelObj.isVip}',  '${JSON.stringify(
        felvitelObj.hirdeto
    )}', '${felvitelObj.jutalek}', '${felvitelObj.megbizaskelte}', '${felvitelObj.megbizasvege}', '${felvitelObj.nempubmegjegyzes}', '${JSON.stringify(kepek)}', '${JSON.stringify(
        nempubcsatolmanyok
    )}');`;

    pool.query(sql, async (error) => {
        if (!error) {
            if (ertekesitok) {
                ertekesitok.forEach((ert) => {
                    if (ert.isErtekesito == 1 && ert.email !== user.email) {
                        const userNev = user && user.nev && JSON.parse(user.nev);
                        const nev = ert && ert.nev && JSON.parse(ert.nev);
                        const teljesNev = `${nev.titulus && nev.titulus + ' '} ${nev.vezeteknev} ${nev.keresztnev}`;
                        console.log('ERT: ', ert, typeof ert);

                        const teljesUserNev = `${userNev.titulus && userNev.titulus + ' '} ${userNev.vezeteknev} ${userNev.keresztnev}`;
                        const mail = {
                            from: `${process.env.foNev} <${process.env.foEmail}>`, // sender address
                            to: `${ert.email}`, // list of receivers
                            subject: `${teljesUserNev} felvitt egy új ingatlant!`, // Subject line
                            html: `<b>Kedves ${teljesNev}!</b><br><br>
                                ${teljesUserNev} felvitt egy új ingatlant!<br><br>
                                Az ingatlan id-je: ${id}<br><br>
                                Tisztelettel:<br>
                                ${process.env.foNev}`
                        };
                        transporter.sendMail(mail, (mailerr) => {
                            if (!mailerr) {
                                res.status(200).send({ msg: 'Ingatlan sikeresen hozzáadva és e-mail sikeresen elküldve az értékesíŧőknek!', ingatlanId: id });
                            } else {
                                log('PUT /api/admin/ingatlanok', mailerr);
                                res.status(409).send({ err: mailerr, msg: 'Hiba történt a levélküldéskor!' });
                            }
                        });
                    }
                });
            } else {
                res.status(409).send({ err: error, msg: 'Nincs értékesítő kiválasztva levélküldéshez!' });
            }
        } else {
            log('POST /api/admin/ingatlanok', error);
            res.status(500).send({
                err: error,
                msg: 'Hiba történt az adatbázis létrehozásakor vagy felvitelkor! Értesítse a weboldal rendszergazdáját!'
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
            let nempubcsatolmanyok = [];
            modositoObj.kepek = modositoObj.kepek;
            if (Array.isArray(modositoObj.kepek)) {
                modositoObj.kepek.forEach((item) => {
                    if (!item.file) {
                        kepek.push(item);
                    }
                });
            } else {
                kepek = modositoObj.kepek;
            }

            if (Array.isArray(modositoObj.nempubcsatolmanyok)) {
                modositoObj.nempubcsatolmanyok.forEach((item) => {
                    if (!item.file) {
                        nempubcsatolmanyok.push(item);
                    }
                });
            } else {
                nempubcsatolmanyok = modositoObj.nempubcsatolmanyok;
            }

            console.log(req.files);
            if (req.files) {
                req.files.forEach((file) => {
                    let extIndex = file.originalname.lastIndexOf('.');
                    let fname = file.originalname.substring(0, extIndex);
                    const dir = `${process.env.ingatlankepekdir}/${id}`;
                    let ext = file.originalname.substring(extIndex + 1, file.originalname.length);

                    if (file.fieldname === 'uj_kepek') {
                        kepek.push({
                            filename: `${fname}.jpg`,
                            isCover: false,
                            src: `${process.env.ingatlankepekUrl}/${id}/${fname}.jpg`,
                            title: `${fname}.jpg`
                        });

                        sharp(file.buffer)
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
                    }

                    if (file.fieldname === 'uj_nempubcsatolmanyok') {
                        console.log('file, file:TYPE: ', file, file.tpye);
                        if (file.mimetype.includes('image')) {
                            nempubcsatolmanyok.push({
                                filename: `${fname}.jpg`,
                                src: `${process.env.ingatlankepekUrl}/${id}/nempubcsatolmanyok/${fname}.jpg`,
                                title: `${fname}.jpg`,
                                type: file.mimetype
                            });

                            sharp(file.buffer)
                                .jpeg({ quality: 80 })
                                .resize({ width: 1500, fit: 'inside' })
                                .withMetadata()
                                .toBuffer((err, buff) => {
                                    if (!err) {
                                        const dir = `${process.env.ingatlankepekdir}/${id}/nempubcsatolmanyok`;
                                        const isDirExist = existsSync(dir);
                                        if (!isDirExist) {
                                            mkdirSync(dir, { recursive: true });
                                        }
                                        writeFileSync(`${dir}/${fname}.jpg`, buff);
                                        log('POST /api/admin/projektek', `Kép hozzáadva: ${dir}/${fname}_icon.jpg\n`);
                                    } else {
                                        log('POST /api/admin/projektek', err);
                                    }
                                });
                        } else {
                            nempubcsatolmanyok.push({
                                filename: `${fname}.${ext}`,
                                src: `${process.env.ingatlankepekUrl}/${id}/nempubcsatolmanyok/${fname}.${ext}`,
                                title: `${fname}.${ext}`,
                                type: file.mimetype
                            });

                            const dir = `${process.env.ingatlankepekdir}/${id}/nempubcsatolmanyok`;
                            const isDirExist = existsSync(dir);
                            if (!isDirExist) {
                                mkdirSync(dir, { recursive: true });
                            }
                            writeFileSync(`${dir}/${fname}.${ext}`, file.buffer);
                        }
                    }
                });
            }

            if (modositoObj.uj_nempubcsatolmanyok) {
                delete modositoObj.uj_nempubcsatolmanyok;
            }

            kepek.forEach((kep, index) => {
                kep.isCover = index.toString() === '0' ? true : false;
            });

            /* const modIdo = moment().locale('hu').format('YYYY-MM-DD HH:mm:ss.000'); */

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
            }', isHirdetheto='${modositoObj.isHirdetheto}', isKiemelt='${modositoObj.isKiemelt}', isErkely='${modositoObj.isErkely}', isLift='${modositoObj.isLift}', isAktiv='${
                kepek.length > 0 ? modositoObj.isAktiv : 0
            }', isUjEpitesu='${modositoObj.isUjEpitesu}', isTetoter='${modositoObj.isTetoter}', isVip='${modositoObj.isVip}', jutalek='${modositoObj.jutalek}', megbizaskelte='${
                modositoObj.megbizaskelte
            }', megbizasvege='${modositoObj.megbizasvege}', nempubmegjegyzes='${modositoObj.nempubmegjegyzes}', nempubcsatolmanyok='${JSON.stringify(nempubcsatolmanyok)}' WHERE id='${id}';`;
            console.log(sql);

            const projektId = modositoObj.projektid || null;
            const getProjektingatalnokSql = `SELECT projektingatlanok FROM projektek WHERE id = ${projektId};`;
            let projektIngatlanok = await UseQuery(getProjektingatalnokSql, '/api/ingatalan PUT');
            console.log(projektIngatlanok && projektIngatlanok.length);
            projektIngatlanok = projektIngatlanok && projektIngatlanok.length > 0 ? JSON.parse(projektIngatlanok[0].projektingatlanok) : null;
            let newProjIng = [];
            /* console.log(typeof projektIngatlanok, Array.isArray(projektIngatlanok)); */
            console.log(projektIngatlanok);
            /* projektIngatlanok = null; */
            if (projektId && projektIngatlanok && projektIngatlanok.length > 0) {
                projektIngatlanok.forEach((pi) => {
                    let projIng = pi;
                    console.log(pi.id);
                    if (pi.id.toString() === id.toString()) {
                        projIng.ar = modositoObj.ar;
                        projIng.alapterulet = modositoObj.alapterulet;
                        projIng.szobaszam = modositoObj.szobaszam;
                        projIng.felszobaszam = modositoObj.felszobaszam;
                    }

                    newProjIng.push(projIng);
                });
                const updateProjektingatlanokSql = `UPDATE projektek SET projektingatlanok = '${JSON.stringify(newProjIng)}' WHERE id = '${projektId}';`;

                pool.query(updateProjektingatlanokSql, (error) => {
                    if (!error) {
                        pool.query(sql, (err) => {
                            if (!err) {
                                console.log(JSON.parse(user.roles), hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN']));
                                if (hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                                    const ingId = modositoObj.id;

                                    const mail = {
                                        from: `${nev} <${user.email}>`, // sender address
                                        to: `${modositoObj.hirdeto.feladoEmail}`, // list of receivers
                                        subject: `${teljesNev} ${modositoObj.isAktiv ? 'publikussá' : 'inkatívvá'} tette a hirdetésed!`, // Subject line
                                        html: `<b>Kedves ${modositoObj.hirdeto.feladoNev}!</b><br><br>
                                            ${nev} admin ${modositoObj.isAktiv ? 'publikussá tette a hirdetésed!' : 'levette a hirdetésed láthatóságát!'} Az ingatlanod id-je: ${
                                            ingId ? ingId : 'Nincs id, valami hiba van...'
                                        }<br><br>
                                            Tisztelettel:<br>
                                            ${nev}`
                                    };
                                    if ((modositoObj.isAktiv == 1 || modositoObj.isAktiv == true) && modositoObj.hirdeto.feladoEmail !== user.email) {
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
                                    res.status(200).send({ msg: 'Ingatlan sikeresen módosítva!' });
                                }
                            } else {
                                log('PUT /api/admin/ingatlanok', err);
                                res.status(500).send({ err: 'Ingatlan módosítása sikertelen!', msg: err });
                            }
                        });
                    } else {
                        log('/api/ingatlan PUT', `updateProjektingatlanokSql: ${updateProjektingatlanokSql}, error: ${error}`);
                        res.status(400).send({ err: error, msg: error });
                    }
                });
            } else {
                pool.query(sql, (err) => {
                    if (!err) {
                        console.log(JSON.parse(user.roles), hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN']));
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
                            if ((modositoObj.isAktiv == 1 || modositoObj.isAktiv == true) && modositoObj.hirdeto.feladoEmail !== user.email) {
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
                            res.status(200).send({ msg: 'Ingatlan sikeresen módosítva!' });
                        }
                    } else {
                        log('PUT /api/admin/ingatlanok', err);
                        res.status(500).send({ err: 'Ingatlan módosítása sikertelen!', msg: err });
                    }
                });
            }
        } else {
            res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
        }

        /* modositoObj.feladoAvatar = modositoObj.feladoAvatar ? modositoObj.feladoAvatar : '[]'; */
    } else {
        res.status(400).send({ err: 'Id megadása kötelező' });
    }
};

export { addIngatlan, editIngatlan };
