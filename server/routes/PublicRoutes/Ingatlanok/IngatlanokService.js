// const { Pool } = require("pg");
import express from 'express';
import { poolConnect, getTelepulesekByKm, getTypeForXml, getAllapotForXml, getKepekForXml, UseQuery, getJSONfromLongtext, isIngatlanokTableExists } from '../../../common/QueryHelpers.js';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { serverRender } from '../../../common/serverRender.js';
import path from 'path';
const router = express.Router();
const ingatlanok = poolConnect;

// INGATLANOK START

router.get('/', async (req, res) => {
    const isExist = await isIngatlanokTableExists(ingatlanok);
    if (isExist) {
        const id = req.query.id;
        const sql = id
            ? `SELECT * FROM ingatlanok WHERE id='${id}' AND isAktiv='1'`
            : `SELECT id, refid, cim, leiras, helyseg, irsz, telepules, altipus, rendeltetes, hirdeto, ar, kepek, kaucio, penznem, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, rogzitIdo FROM ingatlanok WHERE isAktiv='1';`;

        let result = await UseQuery(ingatlanok, sql);
        console.log(result);
        let ress = result.map((ing) => {
            return getJSONfromLongtext(ing);
            /*    if (ing.kepek) {
            ing.kepek = JSON.parse(JSON.stringify(ing.kepek));
        }
        if (ing.rogzitoAvatar) {
            JSON.parse(JSON.stringify(ing.rogzitoAvatar));
        }
        if (ing.helyseg) {
            ing.helyseg = JSON.parse(JSON.stringify(ing.helyseg));
        }

        ing.isHirdetheto = ing.isHirdetheto === 0 ? true : false;
        ing.isKiemelt = ing.isKiemelt === 0 ? true : false;
        ing.isErkely = ing.isErkely === 0 ? true : false;
        ing.isLift = ing.isLift === 0 ? true : false;
        ing.isAktiv = ing.isAktiv === 0 ? true : false;
        ing.isUjEpitesu = ing.isUjEpitesu === 0 ? true : false; */
        });
        /* return result; */
        res.status(200).send(ress);
    } else {
        res.status(200).send([]);
    }
});

/* router.get('/ingatlanok/aktiv', (req, res) => {
  // const id = req.headers.id;
  const id = req.headers.id;

  const sql = id ? `SELECT * FROM ingatlanok WHERE id='${id}' AND isAktiv='1'` : `SELECT id, refid, cim, leiras, helyseg, irsz, telepules, ar, kepek, kaucio, penznem, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, rogzitoNev, rogzitoEmail, rogzitoTelefon FROM ingatlanok WHERE isAktiv='1';`;
  ingatlanok.query(sql, (err, result, rows) => {
    if (!err) {
      let ressss = result;
      ressss.forEach((ing) => {
        ing.kepek = JSON.parse(ing.kepek);
        if (!id) {
          ing.kepek = ing.kepek.filter((kep) => kep.isCover);
          
        } else {
          ing.rogzitoAvatar = JSON.parse(ing.rogzitoAvatar)
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
}); */

/* router.get('/', (req, res) => {
  // const id = req.headers.id;
  const id = req.query.id;
  const sql = `SELECT * FROM ingatlanok WHERE id='${id}' AND isAktiv='1';`;
  ingatlanok.query(sql, (err, result, rows) => {
    if (!err) {
      let ressss = result;
      ressss.forEach((ing) => {
        ing.kepek = JSON.parse(ing.kepek);
        if (!id) {
          ing.kepek = ing.kepek.filter((kep) => kep.isCover);
          
        } else {
          ing.rogzitoAvatar = JSON.parse(ing.rogzitoAvatar)
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
}); */

/* router.get('/ujepites', (req, res) => {
  const id = req.headers.id;
  const sql = id ? `SELECT * FROM ingatlanok WHERE id='${id}' AND isUjEpitesu='0'` : `SELECT * FROM ingatlanok WHERE isUjEpitesu='0';`;
  ingatlanok.query(sql, (err, result, rows) => {
    if (!err) {
      let ressss = result;
      ressss.forEach((ing) => {
        ing.kepek = JSON.parse(ing.kepek);
        if (!id) {
          ing.kepek = ing.kepek.filter((kep) => kep.isCover);
          ing.rogzitoAvatar = JSON.parse(ing.rogzitoAvatar)
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
}); */

router.post('/keres', async (req, res) => {
    let kereso = req.body;
    kereso = JSON.parse(JSON.stringify(kereso));
    const keys = Object.keys(kereso);

    let where = '';
    let newWhere = '';
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
                    filter !== 'irszam' ||
                    filter === 'statusz' ||
                    filter === 'tipus' ||
                    filter === 'szobaszam' ||
                    filter === 'emelet' ||
                    filter === 'epitesmod' ||
                    filter === 'futes' ||
                    filter === 'allapot'
                ) {
                    if (filter === 'telek' || filter === 'alapterulet') {
                        where = where.concat(`${filter}>='${kereso[filter]}' AND `);
                    }
                    if (filter === 'ar') {
                        where = where.concat(`${filter}<=${kereso[filter]} AND `);
                    }
                    if (filter === 'isHirdetheto' || filter === 'isKiemelt' || filter === 'isLift' || filter === 'isErkely' || filter === 'isUjEpitesu') {
                        where = where.concat(`${filter}='${0}' AND `);
                    }
                    if (filter === 'statusz' || filter === 'tipus' || filter === 'szobaszam' || filter === 'emelet' || filter === 'epitesmod' || filter === 'futes' || filter === 'allapot') {
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
            let irszam = kereso['telepules'].irszam;
            const nearTelep = await getTelepulesekByKm(ingatlanok, telepnev, irszam, km);
            let telepek = nearTelep.map((telep, index) => {
                return `'${telep.telepulesnev}'`;
            });
            newWhere = `telepules IN(${telepek})`;
        } else {
            if (kereso['telepules'].telepulesnev !== '') {
                newWhere = newWhere.concat(`telepules='${kereso['telepules'].telepulesnev}' AND `);
            }
            if (kereso['telepules'].irszam !== '') {
                newWhere = newWhere.concat(`irsz='${kereso['telepules'].irszam}' AND `);
            }
        }

        // where = where.concat(newWhere);
    }

    let result = where.lastIndexOf('AND');
    if (result !== -1) {
        where = where.slice(0, result - 1);
    }

    let resultNew = newWhere.lastIndexOf('AND');
    if (resultNew !== -1) {
        newWhere = newWhere.slice(0, resultNew - 1);
    }

    let sql = `SELECT * FROM ingatlanok WHERE isAktiv='1' ${where !== '' ? `AND ` + where : ''} ${newWhere !== '' ? `AND ` + newWhere : ''};`;
    ingatlanok.query(sql, (err, result) => {
        if (!err) {
            let ressss = result;
            ressss.forEach((ing) => {
                /*   ing.kepek = JSON.parse(ing.kepek); */
                ing.kepek = ing.kepek.filter((kep) => kep.isCover);
                /*        ing.helyseg = JSON.parse(ing.helyseg); */
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
                    const getLatLongSql = `SELECT geoLat, geoLong FROM telep_1 WHERE irszam='${ingatlan.irsz}';`;
                    const latLong = await UseQuery(ingatlanok, getLatLongSql);
                    const kepek = ingatlan.kepek;
                    data += `<item refnum="${ingatlan.refid}"> 
        <agent-name>${ingatlan.rogzitoNev}</agent-name>
        <agent-email>${ingatlan.rogzitoEmail}</agent-email>
        <agent-phone>${ingatlan.rogzitoTelefon}</agent-phone>
        <status>${'Aktív'}</status>
        <type>${getTypeForXml(ingatlan.tipus)}</type>
        <refnum>${ingatlan.refid}</refnum>
        <city>${ingatlan.telepules}</city>
        <zip>${ingatlan.irsz}</zip>
        <mbtyp>${ingatlan.statusz}</mbtyp>
        <price>${ingatlan.ar}</price>
        <currency>${'HUF'}</currency>
        ${ingatlan.tipus !== 'Telek' && ingatlan.tipus !== 'Fejlesztési terület' && ingatlan.tipus !== 'Mezőgazdasági terület' && `<sqrm>${ingatlan.alapterulet}</sqrm>`}
        ${
            ingatlan.tipus === 'Telek' || ingatlan.tipus === 'Fejlesztési terület' || ingatlan.tipus === 'Mezőgazdasági terület'
                ? `<land>${ingatlan.telek}</land>
           <ltyp>Egyéb</ltyp>
          `
                : ''
        }
        <pname>${ingatlan.cim}</pname>
        <note>
        <![CDATA[${ingatlan.leiras}]]>
        </note>
        <lat>${latLong[0].geoLat}</lat>
        <lng>${latLong[0].geoLong}</lng>
  
        ${getAllapotForXml(ingatlan.allapot, ingatlan.tipus)}
        ${ingatlan.emelet ? `<floor>${ingatlan.emelet}</floor>` : ''}
        <builds>${ingatlan.epitesmod}</builds>
        <htyp>${ingatlan.futes}</htyp>
        <images>
          ${getKepekForXml(kepek, data)}
        </images>
        </item>`;
                    return data;
                })
            );
            data += `</items>`;
            const dir = `/home/eobgycvo/public_html/xml/ingatlanok/`;
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

// INGATLANOK END

export default router;
