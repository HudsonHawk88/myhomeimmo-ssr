import express from 'express';
import { pool, getIngatlanokByKm, getKepekForXml, UseQuery, getJSONfromLongtext, isTableExists } from '../../../common/QueryHelpers.js';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import fetch from 'isomorphic-fetch';
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

router.get('/reklam', async (req, res) => {
    const isExist = await isTableExists('ingatlanok');
    if (isExist) {
        const sql = `SELECT * FROM ingatlanok WHERE isAktiv='1' AND isKiemelt='1' ORDER BY rogzitIdo DESC;`;

        let result = await UseQuery(sql);
        let ress = result.map((ing) => {
            return getJSONfromLongtext(ing, 'toBool');
        });
        res.send(ress);
    } else {
        res.send([]);
    }
});

router.get('/ingatlanids', async (req, res) => {
    const isExist = await isTableExists('ingatlanok');
    if (isExist) {
        const sql = `SELECT id, ar, alapterulet, szobaszam, felszobaszam FROM ingatlanok WHERE isAktiv='1' ORDER BY rogzitIdo DESC;`;

        let result = await UseQuery(sql);
        let ress = result.map((ing) => {
            return getJSONfromLongtext(ing, 'toBool');
        });
        res.send(ress);
    } else {
        res.send([]);
    }
});

const getDeviza = async (base, rate) => {
    try {
        /* const res = await fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=${process.env.REACT_APP_devvaltoAK}&base=${base}&symbols=${rate}`, {
            method: 'GET'
        }); */
        const res = await fetch(`http://infojegyzet.hu/webszerkesztes/php/valuta/api/v1/arfolyam/`, {
            method: 'GET'
        });
        return res.json();
    } catch (err) {
        console.error(err);
    }
};

/* const convertDeviza = async (from, to, amount) => {
    try {
        const res = await fetch(`http://api.exchangeratesapi.io/v1/convert?access_key=${process.env.REACT_APP_devvaltoAK}&from=${from}&to=${to}&amount=${amount}`, {
            method: 'GET'
        });
        return res.json();
    } catch (err) {
        console.error(err);
    }
}; */

const convertDeviza = (curr, amount, toEuro) => {
    return toEuro ? parseInt((amount / curr).toFixed(2), 10) : parseInt((curr * amount).toFixed(0), 10);
};

/* const changeDeviza = async (from, to, amount, toEuro) => {
    const curr = await getDeviza(from, to);
    console.log(curr);
    if (curr && curr.success) {
        const result = convertDeviza(curr.rates[to], amount);
        if (result) {
            return { curr: { penznem: to, atvaltott: result }, err: null };
        }
    } else {
        return { curr: null, err: 'Nem sikerült a deviza lekérdezése!' };
    }
}; */

router.post('/getdeviza', async (req, res) => {
    const { base, rate } = req.body;
    const result = await getDeviza(base, rate);
    if (result) {
        res.status(200).send({ curr: result, err: null });
    } else {
        res.status(409).send({ curr: null, err: 'Nem sikerült a deviza lekérdezése!' });
    }
});

router.post('/changedeviza', async (req, res) => {
    const { from, to, amount } = req.body;
    const curr = await getDeviza(from, to);
    let result;
    if (curr && curr.success) {
        result = to === 'EUR' ? convertDeviza(curr.rates['HUF'], amount, true) : convertDeviza(curr.rates[to], amount);
        result ? res.status(200).send({ curr: { penznem: to, atvaltott: result }, err: null }) : res.status(409).send({ curr: null, err: 'Nem sikerült a deviza lekérdezése!' });
    } else {
        res.status(409).send({ curr: null, err: 'Nem sikerült a deviza lekérdezése!' });
    }
});

router.post('/ingatalnokbyids', async (req, res) => {
    const isExist = await isTableExists('ingatlanok');
    const { ids } = req.body;
    let where = '';
    if (ids && Array.isArray(ids) && ids.length > 0) {
        ids.forEach((id, idx) => {
            if (ids.length - 1 === idx) {
                where = where.concat(`id = '${id}'`);
            } else {
                where = where.concat(`id = '${id}' OR `);
            }
        });
    }

    if (isExist) {
        const sql = `SELECT * FROM ingatlanok WHERE isAktiv='1' AND ${where} ORDER BY rogzitIdo DESC;`;

        let result = await UseQuery(sql);
        let ress = result.map((ing) => {
            console.log(ing);
            return getJSONfromLongtext(ing, 'toBool');
        });
        res.send(ress);
    } else {
        res.send([]);
    }
});

const getArFilter = (penznem, ar, kereso) => {
    let newWh = `(REPLACE(ar, ' ', '') <= ${ar} AND penznem='Ft') AND `;
    const atv = kereso['atvaltott'];
    if (penznem && penznem !== '') {
        if (penznem !== 'HUF') {
            if (penznem === 'EUR') {
                if (atv) {
                    newWh = `(((REPLACE(ar, ' ', '')<=${atv} AND penznem='Ft') OR (REPLACE(ar, ' ', '')<=${ar} AND penznem='${kereso['penznem']}'))) AND `;
                }
            }
        } else {
            if (atv) {
                newWh = `(((REPLACE(ar, ' ', '')<=${atv} AND penznem='Euró') OR (REPLACE(ar, ' ', '')<=${ar} AND penznem='Ft'))) AND `;
            }
        }
    } else {
        newWh = `(REPLACE(ar, ' ', '')<=${ar} AND penznem='Ft') AND `;
    }

    return newWh;
};

const getNumberFromBool = (bool) => {
    let result = 0;
    if (bool === true || bool === 'true') {
        result = 1;
    }

    return result;
};

router.post('/keres', async (req, res) => {
    let kereso = req.body;
    kereso = JSON.parse(JSON.stringify(kereso));
    const keys = Object.keys(kereso);

    let where = '';
    let newWhere = '';
    let newWh = '';
    let leftJoin = '';
    if (kereso['referenciaSzam'] && kereso['referenciaSzam'] !== '') {
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
                        const penznem = getPenznem(kereso['penznem']);
                        where = where.concat(getArFilter(penznem, kereso['ar'], kereso));
                    }
                    if (filter === 'isHirdetheto' || filter === 'isKiemelt' || filter === 'isLift' || filter === 'isErkely' || filter === 'isUjEpitesu' || filter === 'isTetoter') {
                        where = where.concat(`${filter}='${getNumberFromBool(kereso[filter])}' AND `);
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
                        filter === 'allapot'
                    ) {
                        where = where.concat(`${filter}='${kereso[filter]}' AND `);
                    }

                    if (filter === 'penznem') {
                        if (kereso['penznem'] === 'Ft' && kereso['ar'] === '') {
                            where = where.concat(`${filter}='${kereso[filter]}' AND `);
                        }
                    }
                }
            }
        });
    }

    if (kereso['telepules']) {
        if (parseInt(kereso['telepules'].km, 10) > 0) {
            let km = kereso['telepules'].km;
            let telepnev = kereso['telepules'].telepulesnev;
            leftJoin = await getIngatlanokByKm(telepnev, km);
            newWhere = `distance >= 0 ORDER BY distances.distance`;
        } else {
            if (kereso['telepules'].telepulesnev !== '') {
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

    let resultNewNew = newWh.lastIndexOf('AND');
    if (resultNewNew !== -1) {
        newWh = newWh.slice(0, resultNewNew - 1);
    }

    let sql = `SELECT * FROM ingatlanok ${leftJoin !== '' ? leftJoin : ''} WHERE isAktiv='1' ${where !== '' ? 'AND ' + where : ''}${newWhere !== '' ? ' AND ' + newWhere : ''}${
        newWh !== '' ? ' AND ' + newWh : ''
    };`;

    /* console.log('SQL: ', sql); */
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
                    const getLatLongSql = `SELECT geoLat, geoLong FROM telep_1 WHERE irszam='${ingatlan.irsz}' AND telepulesnev='${ingatlan.telepules}';`;
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
                  <btype>${ingatlan.altipus}</btype>
                  <rend>${ingatlan.rendeltetes}</rend>
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
                let oldSrc = avatar.src.slice(0, avatar.src.indexOf('/', 8));
                let newSrc = avatar.src.replace(oldSrc, `${process.env.REACT_APP_mainUrl}`);
                avatar.src = newSrc;
            });
            const emailPart = newHird.feladoEmail.slice(0, newHird.feladoEmail.indexOf('@'));
            newHird.feladoEmail = emailPart + '@myhomeimmo.hu';

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
                    /* console.log('JÓ'); */
                } else {
                    /* console.log('ROSSZ'); */
                }
            });
            /*     } */
        });
        res.send({ msg: 'OK' });
    } else {
        res.send([]);
    }
});

// INGATLANOK END

export default router;
