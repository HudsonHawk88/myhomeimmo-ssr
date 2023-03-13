import express from 'express';
import { pool, getIngatlanokByKm, getKepekForXml, UseQuery, getJSONfromLongtext, isTableExists } from '../../../common/QueryHelpers.js';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
const router = express.Router();
const ingatlanok = pool;

const getPenznem = (penznem) => {
    switch (penznem) {
        case 'Forint': {
            return 'HUF';
        }
        case 'Euró': {
            return 'EUR';
        }
        case 'USA Dollár': {
            return 'USD';
        }
        default: {
            return 'HUF';
        }
    }
};

// INGATLANOK START

router.get('/', async (req, res) => {
    const isExist = await isTableExists('ingatlanok');
    if (isExist) {
        const id = req.query.id;
        const sql = id
            ? `SELECT * FROM ingatlanok WHERE id='${id}' AND isAktiv='1' ORDER BY rogzitIdo DESC;`
            : `SELECT id, refid, office_id, cim, leiras, helyseg, irsz, telepules, altipus, rendeltetes, hirdeto, ar, kepek, kaucio, penznem, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, isTetoter, isVip, rogzitIdo FROM ingatlanok WHERE isAktiv='1' AND isKiemelt='1' ORDER BY rogzitIdo DESC;`;

        let result = await UseQuery(sql);
        let ress = result.map((ing) => {
            return getJSONfromLongtext(ing, 'toBool');
        });
        res.send(ress);
    } else {
        res.send([]);
    }
});

router.post('/keres', async (req, res) => {
    let kereso = req.body;
    kereso = JSON.parse(JSON.stringify(kereso));
    const keys = Object.keys(kereso);

    let where = '';
    let newWhere = '';
    let leftJoin = '';
    if (kereso['referenciaSzam'] !== '') {
        where = where.concat(`refid = '${kereso.referenciaSzam}' AND`);
    } else {
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
    }

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

    let result = where.lastIndexOf('AND');
    if (result !== -1) {
        where = where.slice(0, result - 1);
    }

    let resultNew = newWhere.lastIndexOf('AND');
    if (resultNew !== -1) {
        newWhere = newWhere.slice(0, resultNew - 1);
    }

    let sql = `SELECT * FROM ingatlanok ${leftJoin !== '' ? leftJoin : ''} WHERE isAktiv='1' ${where !== '' ? 'AND ' + where : ''}${newWhere !== '' ? ' AND ' + newWhere : ''};`;

    /*     console.log(sql); */
    ingatlanok.query(sql, (err, result) => {
        if (!err) {
            let ressss = result.map((ing) => {
                return getJSONfromLongtext(ing, 'toBool');
            });
            res.status(200).send(ressss);
        } else {
            res.status(500).send({ err: err });
        }
    });
});

router.get('/ingatlanokapi', (req, res, next) => {
    let sql = `SELECT * FROM ingatlanok WHERE isAktiv='1' AND isHirdetheto='1';`;
    let data = `<?xml version="1.0" encoding="UTF-8"?>`;
    data += `<items>`;
    ingatlanok.query(sql, async (error, result) => {
        const ingatlanJson = result;
        if (!error) {
            await Promise.all(
                ingatlanJson.map(async (ingatlan) => {
                    ingatlan = getJSONfromLongtext(ingatlan, 'toBool');
                    const getLatLongSql = `SELECT geoLat, geoLong FROM telep_1 WHERE irszam='${ingatlan.irsz}';`;
                    const tipus = ingatlan.tipus + '';
                    const hirdeto = ingatlan.hirdeto;
                    const latLong = await UseQuery(getLatLongSql);
                    const kepek = ingatlan.kepek;
                    data += `<item refnum="${ingatlan.refid}">
                  <agent-name>${hirdeto && hirdeto.feladoNev}</agent-name>
                  <agent-email>${hirdeto && hirdeto.feladoEmail}</agent-email>
                  <agent-phone>${hirdeto && hirdeto.feladoTelefon}</agent-phone>
                  <status>${'Aktív'}</status>
                  <type>${ingatlan.tipus}</type>
                  <refnum>${ingatlan.refid}</refnum>
                  <city>${ingatlan.telepules}</city>
                  <zip>${ingatlan.irsz}</zip>
                  <mbtyp>${ingatlan.statusz}</mbtyp>
                  ${ingatlan.statusz === 'Kiadó' ? `<kaucio>${ingatlan.kaucio}</kaucio>` : ''}
                  <price>${ingatlan.ar}</price>
                  <currency>${getPenznem(ingatlan.penznem)}</currency>
                  ${tipus !== '3' && tipus !== '10' && tipus !== '13' ? `<sqrm>${ingatlan.alapterulet}</sqrm>` : ''}
                  ${
                      tipus === '2' || tipus === '3' || tipus === '10' || tipus === '13'
                          ? `<land>${ingatlan.telek}</land>
                  <ltyp>${ingatlan.telektipus}</ltyp>`
                          : ''
                  }
                  ${
                      tipus === '2' || tipus === '6' || tipus === '8' || tipus === '9' || tipus === '10' || tipus === '11' || tipus === '12' || tipus === '13'
                          ? `<btype>${ingatlan.altipus}</btype>`
                          : ''
                  }
                  ${tipus === '2' || tipus === '3' ? `<rend>${ingatlan.rendeltetes}</rend>` : ''}
                  ${ingatlan.szobaszam && `<room>${ingatlan.szobaszam}</room>`}
                  ${ingatlan.felszobaszam && `<froom>${ingatlan.felszobaszam}</froom>`}
                  ${ingatlan.viz && `<water>${ingatlan.viz}</water>`}
                  ${ingatlan.gaz && `<gas>${ingatlan.gaz}</gas>`}
                  ${ingatlan.villany && `<electr>${ingatlan.villany}</electr>`}
                  ${ingatlan.szennyviz && `<sewage>${ingatlan.szennyviz}</sewage>`}
                  <pname>${ingatlan.cim}</pname>
                  <note>
                  <![CDATA[${ingatlan.leiras}]]>
                  </note>
                  <lat>${latLong[0].geoLat}</lat>
                  <lng>${latLong[0].geoLong}</lng>
                  ${tipus === '1' || tipus === '2' || tipus === '4' || tipus === '9' || tipus === '12' ? `<property-condition>${ingatlan.allapot}</property-condition>` : ''}
                  ${tipus === '1' ? `<floor>${ingatlan.emelet}</floor>` : ''}
                  ${ingatlan.epitesmod ? `<builds>${ingatlan.epitesmod}</builds>` : ''}
                  ${ingatlan.futes ? `<htyp>${ingatlan.futes}</htyp>` : ''}
                  <images>
                    ${getKepekForXml(kepek, data)}
                  </images>
                  </item>`;
                    return data;
                })
            );
            data += `</items>`;
            /*       const dir = `/home/eobgycvo/public_html/xml/ingatlanok/`; */
            const dir = process.env.xmlUrl;
            let exist = existsSync(dir);
            if (!exist) {
                mkdirSync(path.normalize(dir));
            }
            writeFileSync(path.join(dir, 'ingatlanapi.xml'), data);
            writeFileSync(path.join(dir, 'ingatlanapi.txt'), data);
            res.status(200).send({ msg: 'XML file generálása sikeres!' });
        } else {
            res.status(500).send({ err: 'XML file generálása sikertelen!' });
        }
    });
});

router.get('/javitas', async (req, res) => {
    const isExist = await isTableExists('ingatlanok');
    if (isExist) {
        const id = req.query.id;
        const sql = id
            ? `SELECT * FROM ingatlanok WHERE id='${id}' AND isAktiv='1'`
            : `SELECT id, refid, office_id, cim, leiras, helyseg, irsz, telepules, altipus, rendeltetes, hirdeto, ar, kepek, kaucio, penznem, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, rogzitIdo FROM ingatlanok;`;

        let result = await UseQuery(sql);
        let ress = [];
        ress = result.map((ing) => {
            ing = getJSONfromLongtext(ing, 'toBool');
            ing.kepek.map((item) => {
                let extIndex = item.filename.lastIndexOf('.');
                let fname = item.filename.substring(0, extIndex);
                const ref = `${fname}.jpg`;
                item.src = `${process.env.ingatlankepekUrl}/${ing.id}/${ref}`;
                return item;
            });

            let newHird = ing.hirdeto;
            newHird.feladoAvatar.map((avatar) => {
                let newSrc = avatar.src.replace('http://192.168.1.76:5500', `${process.env.REACT_APP_mainUrl}`);
                avatar.src = newSrc;
            });

            ing.hirdeto = newHird;

            return ing;
        });

        /* const hird = {
            feladoNev: 'Berki Mónika',
            feladoEmail: 'berkimonika@myhomezala.hu',
            feladoAvatar: [
                {
                    src: 'https://myhomezala.hu/static/images/avatars/7/berkimonika2.png',
                    title: 'berkimonika.png'
                }
            ],
            feladoTelefon: '+36 20 461 9075'
        }; */

        ress.forEach((elem) => {
            /*     if (elem.hirdeto.feladoNev === 'Berki Mónika') { */
            const sql = `UPDATE ingatlanok SET kepek='${JSON.stringify(elem.kepek)}', hirdeto='${JSON.stringify(elem.hirdeto)}' WHERE id='${elem.id}';`;
            ingatlanok.query(sql, (errrrr) => {
                if (!errrrr) {
                    console.log('JÓ');
                } else {
                    console.log('ROSSZ');
                }
            });
            /*     } */
        });
        res.send({ msg: 'HELLO' });
    } else {
        res.send([]);
    }
});

// INGATLANOK END

export default router;
