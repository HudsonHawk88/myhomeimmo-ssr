import express from 'express';
import multer from 'multer';
import { jwtparams, pool, validateToken, createIngatlanokSql, createIngatlanokTriggerSql, hasRole, getJSONfromLongtext, isTableExists, getId, UseQuery, printPDF } from '../../../common/QueryHelpers.js';
import { existsSync, mkdirSync, rmSync } from 'fs';
import nodemailer from 'nodemailer';

import { addIngatlan, editIngatlan } from '../../../schemas/IngatlanSchema.js';
import mailconf from '../../common/MailerService/mailconfig.json';

const router = express.Router();
const ingatlanok = pool;
let poolConfig = "smtps://username:password@smtp.example.com/?pool=true";
const transporter = nodemailer.createTransport(mailconf);

//TODO: Egyéb (nem publikus) dokumentumok, képek feltöltését megvalósítani!!!

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        let id = await getId(req.headers.id, 'ingatlanok');
        const dir = `${process.env.ingatlankepekdir}/${id}`;
        let exist = existsSync(dir);

        if (!exist) {
            mkdirSync(dir);
        }
        /*  console.log(req.file); */
        /*  const fname = file.filename.split('.').slice(0, -1).join('.'); */
        /*     sharp(file).resize(250, 200).toFile(`${process.env.ingatlankepekdir}/${id}/${fname}_icon.jpg`);
        sharp(file).jpeg({ quality: 80 }).resize(2500, 1500).toFile(`${process.env.ingatlankepekdir}/${id}/${fname}.jpg`); */
        cb(null, dir);
    },
    /*  imageOptions: {
        fileFormat: 'webp',
        quality: 80
    }, */
    /* imageOptions: {
        fileFormat: 'jpg',
        quality: 60,
        resize: {
            width: 2500,
            height: 1500,
            resizeMode: 'inside'
        }
    } */
    filename: function (req, file, cb) {
        let extIndex = file.originalname.lastIndexOf('.');
        let fname = file.originalname.substring(0, extIndex);
        const ref = `${fname}.jpg`;

        cb(null, ref); //Appending .jpg
    }
});

const upload = multer({ storage: storage });

// INGATLANOK START

router.get('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const id = req.headers.id;
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                let resArr = [];
                if (id) {
                    const sql = `SELECT * FROM ingatlanok WHERE id='${id}';`;
                    ingatlanok.query(sql, (err, result) => {
                        if (!err) {
                            result.find((ing) => {
                                const ingg = getJSONfromLongtext(ing, 'toBool');
                                if ((ingg.hirdeto.feladoEmail === user.email && ingg.id === parseInt(id, 10)) || hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                                    resArr.push(ingg);
                                }
                            });
                            if (resArr) {
                                res.status(200).send(resArr);
                            } else {
                                res.status(401).send({ err: 'Nincs jogosultsága az adott művelethez!' });
                            }
                        } else {
                            res.status(500).send({ err: err });
                        }
                    });
                } else {
                    const sql = `SELECT id, refid, office_id, cim, leiras, helyseg, irsz, telepules, altipus, rendeltetes, hirdeto, ar, kepek, kaucio, penznem, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, isTetoter, rogzitIdo, hirdeto
                FROM ingatlanok ORDER BY rogzitIdo DESC`;
                    ingatlanok.query(sql, (err, result) => {
                        if (!err) {
                            let ressss = result.filter((ing) => {
                                const ingg = getJSONfromLongtext(ing, 'toBool');
                                if (ingg.hirdeto.feladoEmail === user.email || hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_OSSZ_LEK'])) {
                                    return getJSONfromLongtext(ing, 'toBool');
                                }
                            });
                            if (ressss && Array.isArray(ressss)) {
                                const resArr = ressss.map((r) => {
                                    return getJSONfromLongtext(r);
                                });
                                res.status(200).send(resArr);
                            }
                        } else {
                            res.status(500).send({ err: err });
                        }
                    });
                }
            } else {
                res.status(401).send({ err: 'Nincs jogosultsága az adott művelethez!' });
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
                let extIndex = filename.lastIndexOf('.');
                let fname = filename.substring(0, extIndex);
                const image = `${process.env.ingatlankepekdir}/${ingatlanId}/${fname}.jpg`;
                const imageIcon = `${process.env.ingatlankepekdir}/${ingatlanId}/${fname}_icon.jpg`;
                rmSync(image, {
                    force: true
                });
                rmSync(imageIcon, {
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
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                const isExist = await isTableExists('ingatlanok');
                if (!isExist) {
                    ingatlanok.query(createIngatlanokSql, (errr) => {
                        if (!errr) {
                            ingatlanok.query(createIngatlanokTriggerSql, async (eee) => {
                                if (!eee) {
                                    /*  uploadIco.array('kepek'); */
                                    return addIngatlan(req, res);
                                } else {
                                    console.log('NOK');
                                }
                            });
                        } else {
                            res.status(500).send({ err: errr });
                        }
                    });
                } else {
                    return addIngatlan(req, res);
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
                return editIngatlan(req, res, user);
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
            // TODO: hozzáadni a feltöltő regisztrált usert is a jogosultakhoz!!!
            const id = req.headers.id;
            if (id) {
                if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {
                    const getIngatlanSql = `SELECT id, hirdeto FROM ingatlanok WHERE id='${id}';`;
                    let ingatlan = await UseQuery(getIngatlanSql);
                    ingatlan = getJSONfromLongtext(ingatlan, 'toBool');
                    const sql = `DELETE FROM ingatlanok WHERE id='${id}';`;
                    if (
                        (ingatlan && ingatlan[0].hirdeto && ingatlan[0].hirdeto.feladoEmail === user.email && ingatlan[0].id === parseInt(id, 10)) ||
                        hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])
                    ) {
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
                    // const sql = `DELETE FROM ingatlanok WHERE id='${id}' AND email='${user.email}';`;
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

// INGATLAN JOVAHAGYASA

router.post('/jovahagyas', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (!hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN']) && user.isErtekesito) {
                const ingatlanId = req.headers.ingatlanId;
                let nev = JSON.parse(user.nev);
                const teljesNev = `${nev.titulus && nev.titulus + ' '} ${nev.vezeteknev} ${nev.keresztnev}`;
                const mail = {
                    from: `${teljesNev} <${user.email}>`, // sender address
                    to: `${process.env.foEmail}`, // list of receivers
                    subject: `${teljesNev} - új ingatlan`, // Subject line
                    html: `<b>Kedves Berki Mónika!</b><br><br>
                    ${teljesNev} ingatlanértékesítő új ingatlant adott hozzá. Az ingatlan id-je: ${ingatlanId ? ingatlanId : 'Nincs id, valami hiba van...'}<br>
                    Tisztelettel:<br>
                    ${teljesNev}<br>` // html body
                }
                nodemailer.createTransport(mailconf).sendMail(mail, (errrr, ressss) => {
                    if (errrr) {
                        console.log(errrr);
                    }
                })
                transporter.sendMail(mail,
                (err) => {
                    if (!err) {
                        res.status(200).send({ msg: 'E-mail sikeresen elküldve!' });
                    } else {
                        /* console.log(mailconf);
                        console.log(err); */
                        res.status(500).send({ msg: 'Email küldése sikertelen!' });
                    }
                }
            );
            } else {
                res.status(403).send({ err: 'Nincs jogosultsága az adott művelethez!' });
            }
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

const renderKepek = async (kepek) => {
    let str = '';
    if (kepek && kepek.length > 0) {
        console.log(kepek);
        kepek.forEach((kep, index) => {
            if (index < 3) {
                str = str.concat(`<img class="ingkepek" src="${kep.src}" alt="${kep.filename}" />`);
            }
        });
    }

    return str;
}

const getNemUresFields = (ertek) => {
    let hidden = false;
    if (ertek === '' || ertek === 0) {
        hidden = true;
    }
    return hidden;
};

const isTelekAdatokHidden = (ingatlan) => {
    let isHidden = true;
    if (ingatlan) {
        if (ingatlan.tipus === 2 || ingatlan.tipus === 3 || ingatlan.tipus === 6 || ingatlan.tipus === 13 || ingatlan.tipus === 10) {
            isHidden = false;
        }
    }

    return isHidden;
};

const tipusFormatter = (ingatlanOptions, type) => {
    let tipus = ``;
    console.log(ingatlanOptions, typeof type)
    ingatlanOptions.forEach((option) => {
        console.log(option)
            console.log(option.value + '' === type + '')
            if (option.value + '' === type + '') {
                tipus = option.nev;
            }
    });
    return tipus;
};

const altipusFormatter = (altipusOptions, tipus, subtype) => {
    let altipus = ``;
    altipusOptions.forEach((option) => {
        const tipus_id = option.tipus_id + '';
        if (tipus_id + '' === tipus) {
            if (option.value === subtype || parseInt(option.value, 10) === subtype) {
                altipus = option.nev;
            }
        }
    });
    return altipus;
};

const renderParameterek = (ingatlan, tipusOpts, altipusOpts) => {
    const newP = `
    <table class="partabla">
    <tr>
    <td ${getNemUresFields(ingatlan.statusz) ? 'hidden' : ''}><strong>Ingatlan státusza: </strong></td>
    <td ${getNemUresFields(ingatlan.statusz) ? 'hidden' : ''}>${ingatlan.statusz}</td>
    <td ${getNemUresFields(ingatlan.epitesmod) ? 'hidden' : ''}><strong>Építés módja: </strong></td>
    <td ${getNemUresFields(ingatlan.epitesmod) ? 'hidden' : ''}>${ingatlan.epitesmod}</td>
    <td ${getNemUresFields(ingatlan.tipus) ? 'hidden' : ''}><strong>Ingatlan típusa: </strong></td>
    <td ${getNemUresFields(ingatlan.tipus) ? 'hidden' : ''}>${tipusFormatter(tipusOpts.options, ingatlan.tipus)}</td>
    <td ${getNemUresFields(ingatlan.altipus) ? 'hidden' : ''}><strong>Ingatlan altípusa: </strong></td>
    <td ${getNemUresFields(ingatlan.altipus) ? 'hidden' : ''}>${altipusFormatter(altipusOpts.options, ingatlan.tipus, ingatlan.altipus)}</td>
    </tr>
    <tr>
    <td ${getNemUresFields(ingatlan.telepules) ? 'hidden' : ''}><strong>Település: </strong></td>
    <td ${getNemUresFields(ingatlan.telepules) ? 'hidden' : ''}>${ingatlan.telepules}</td>
    <td ${getNemUresFields(ingatlan.rendeltetes) ? 'hidden' : ''}><strong>Rendeltetés: </strong></td>
    <td ${getNemUresFields(ingatlan.rendeltetes) ? 'hidden' : ''}>${ingatlan.rendeltetes}</td>
    <td ${!ingatlan.isTetoter ? 'hidden' : ''}><strong>Tetőtéri: </strong></td>
    <td ${!ingatlan.isTetoter ? 'hidden' : ''}>${ingatlan.isTetoter ? 'Igen' : 'Nem'}</td>
    <td ${getNemUresFields(ingatlan.futes) ? 'hidden' : ''}><strong>Fűtés típusa: </strong></td>
    <td ${getNemUresFields(ingatlan.futes) ? 'hidden' : ''}>${ingatlan.futes}</td>
    </tr>
    <tr>
    <td ${getNemUresFields(ingatlan.alapterulet) ? 'hidden' : ''}><strong>Alapterület: </strong></td>
    <td ${getNemUresFields(ingatlan.alapterulet) ? 'hidden' : ''}>${ingatlan.alapterulet} m<sup>2</sup></td>
    <td ${isTelekAdatokHidden(ingatlan) ? 'hidden' : ''}><strong>Telek mérete: </strong>/td>
    <td ${isTelekAdatokHidden(ingatlan) ? 'hidden' : ''}>${ingatlan.telek ? ingatlan.telek : '0'} m<sup>2</sup></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    </tr>
    <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    </tr>
    </table>
    `;
    const p = `<div class="row">
        <div class="col-md-6" ${getNemUresFields(ingatlan.statusz) ? 'hidden' : ''}>
            <strong>Ingatlan státusza: </strong>
            ${ingatlan.statusz}
        </div>
        <div class="col-md-6" ${getNemUresFields(ingatlan.epitesmod) ? 'hidden' : ''}>
            <strong>Építés módja: </strong>
            ${ingatlan.epitesmod}
        </div>
        <div class="col-md-12" />
        <br />
        <div class="col-md-6" ${getNemUresFields(ingatlan.tipus) ? 'hidden' : ''}>
            <strong>Ingatlan típusa: </strong>
            ${tipusFormatter(tipusOpts.options, ingatlan.tipus)}
        </div>
        <div class="col-md-6" ${getNemUresFields(ingatlan.altipus) ? 'hidden' : ''}>
            <strong>Ingatlan altípusa: </strong>
            ${altipusFormatter(altipusOpts.options, ingatlan.tipus, ingatlan.altipus)}
        </div>
        <div class="col-md-12" />
        <br />
        <div class="col-md-6" ${getNemUresFields(ingatlan.telepules) ? 'hidden' : ''}>
            <strong>Település: </strong>
            ${ingatlan.telepules}
        </div>
        <div class="col-md-6" ${getNemUresFields(ingatlan.rendeltetes) ? 'hidden' : ''}>
            <strong>Rendeltetés: </strong>
            ${ingatlan.rendeltetes}
        </div>
        <div class="col-md-12" />
        <br />
        <div class="col-md-6" ${!ingatlan.isTetoter ? 'hidden' : ''}>
            <strong>Tetőtéri: </strong>
            ${ingatlan.isTetoter ? 'Igen' : 'Nem'}
        </div>
        <div class="col-md-6" ${ingatlan.tipus !== 1 ? 'hidden' : ''}>
            <strong>Erkély: </strong>
            ${ingatlan.isErkely ? 'Van' : 'Nincs'}
        </div>
        <div class="col-md-12" />
        <br />
        <div class="col-md-6" ${getNemUresFields(ingatlan.futes) ? 'hidden' : ''}>
            <strong>Fűtés típusa: </strong>
            ${ingatlan.futes}
        </div>
        <div class="col-md-6" ${getNemUresFields(ingatlan.alapterulet) ? 'hidden' : ''}>
            <strong>Alapterület: </strong>
            ${ingatlan.alapterulet} m
            <sup>2</sup>
        </div>
        <div class="col-md-12" />
        <br />
        <div class="col-md-6" ${isTelekAdatokHidden(ingatlan) ? 'hidden' : ''}">
            <strong>Telek mérete: </strong>
            ${ingatlan.telek ? ingatlan.telek : '0'} m
            <sup>2</sup>
        </div>
        </div>`;

    return newP;
} 

// INGATLAN PDF AJANLO GENEÁLÁS

router.post('/infoPDF', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
                const ingatlanId = req.headers.ingatlanid;
                const ingatlanSql = `SELECT * FROM ingatlanok WHERE id='${ingatlanId}';`;
                const cegadatSql = `SELECT nev, cim, telefon FROM kapcsolat WHERE id='1';`;
                const tipusOptionsSql = `SELECT * FROM ingatlan_options;`;
                const altipusOptionsSql = `SELECT * FROM ingatlan_subtypes;`;
                const ingatlan = await UseQuery(ingatlanSql);
                const cegadatok = await UseQuery(cegadatSql);
                let tipusOptions = await UseQuery(tipusOptionsSql);
                let altipusOptions = await UseQuery(altipusOptionsSql);
                const tipusOpts = tipusOptions[0];
                const altipusOpts = altipusOptions[0];

                // USER ADATOK
                let nev = JSON.parse(user.nev);
                const teljesNev = `${nev.titulus && nev.titulus + ' '} ${nev.vezeteknev} ${nev.keresztnev}`;
                let telszam = JSON.parse(user.telefon);
                telszam = `${telszam.orszaghivo}-${telszam.korzet}/${telszam.telszam}`; 
                const email = user.email;
                console.log(ingatlan);
                console.log(ingatlan[0]);

                // INGATLANADATOK
              /*   const elsokepek = ingatlan && ingatlan[0].kepek && ingatlan[0].kepek.filter((kep, index) => index < 4); */
              /*   const alaprajz = ingatlan && ingatlan[0].kepek && ingatlan[0].kepek.map((kep) => kep.filename.includes('alaprajz')); */

                const html = `
                    <html>
                        <style> 
                            html { -webkit-print-color-adjust: exact; margin: 0; padding: 0; } 
                            @media print { .break { break-after: always } } } 
                            * { font-family: Arial, Helvetica, sans-serif }
                            .pdftartalom { min-height: calc(100% - 90px); max-height: calc(100% - 20px); padding: 25px 20px; margin: 15px; border: 2px blue solid; break-after: always; position: relative; top: 20px; }  
                            p { color: blue; } 
                            .pdftartalom ~ .pdftartalom { top: 10px;  break-after: always }
                            .break { break-after: always }
                            .pdfcim { color: blue; padding: 0; margin: 0 } 
                            .pdfnevjegy { float: right; padding: 10px 20px; border: 2px blue solid; font-size: 17 } 
                            .nevcim { font-size: 16 } 
                            .cegadatok { font-size: 13 } 
                            hr { border-color: blue 3px solid; } 
                            .pdfnormaldiv { clear: both; padding: 10px 0px; position: relative; } 
                            .ingatlancim { margin: 20px 0px 0px 0px; font-weight: bold; position: relative; } 
                            .ingkepekdiv { display: flex; max-width: 100%; position: relative; } 
                            .ingkepek { max-width: 33%; height: 150px; margin: 10px; position: relative; } 
                            .leiraspdf { font-size: 12; position: relative; } 
                            .partabla { font-size: 12; } 
                            tr:nth-child(even) { background-color: #33333; } 
                            td { padding: 10px }
                        </style>
                        <div class="pdftartalom">
                            <h2 class="pdfcim" style="text-align: center; color= blue">Információs lap</h2>
                            <div class="pdfnevjegy">
                                <p align='right' class="nevcim"><strong>Név: ${teljesNev}</strong><br />Mobil: ${telszam}</p>
                                <p align="left" class="cegadatok">${cegadatok[0].nev}<br />${cegadatok[0].cim}<br />Tel.: ${cegadatok[0].telefon}<br />E-mail: ${email}</p>
                            </div>
                            <div class="pdfnormaldiv">
                                <p class="ingatlancim" align="left">${ingatlan[0].cim}</p>
                                <hr>
                                <p align="left" style="padding-top: 10px">Ár: <strong>${ingatlan[0].ar} ${ingatlan[0].penznem} </strong> Referencia szám: <strong>${ingatlan[0].refid}</strong></p>
                                <div class="ingkepekdiv">${await renderKepek(ingatlan[0].kepek)}</div>
                                <h3 class="alcimpdf"><strong>Általános leírás:</strong></h3>
                                <hr>
                                <p align="left" class="leiraspdf">
                                    ${ingatlan[0].leiras}
                                </p>
                                <h3 class="alcimpdf"><strong>Paraméterek:</strong></h3>
                                <hr>
                                ${renderParameterek(ingatlan[0], tipusOpts, altipusOpts)}
                            </div>
                        </div>
                       <div class="break" /> 
                    </html>`;
                const pdf = await printPDF(html, 'A4', false);

                if(ingatlan && tipusOpts && altipusOpts && html) {
                    res.status(200).send({ msg:"HELLO PDF!", data: pdf});
                }

  
        }
    } else {
        res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
    }
});

// INGATLANOK END

export default router;
