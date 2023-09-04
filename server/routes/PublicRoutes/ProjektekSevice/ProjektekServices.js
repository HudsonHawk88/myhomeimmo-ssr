import { pool, getJSONfromLongtext } from '../../../common/QueryHelpers.js';
import express from 'express';
const router = express.Router();
const projektek = pool;

// PROJEKTEK START

router.get('/', async (req, res) => {
    const id = req.headers.id;
    if (id) {
        const sql = `SELECT * FROM projektek WHERE id='${id}';`;
        projektek.query(sql, (err, result) => {
            if (!err) {
                const resss = getJSONfromLongtext(result[0], 'toBool');
                res.status(200).send(resss);
            } else {
                res.status(500).send({ err: 'Hiba történt a projektek lekérdezésekor!' });
            }
        });
    } else {
        const sql = `SELECT id, nev, leiras, penznem, borito, utem, szlogen, felirat, bemutatvideo, cim, atadasev, atadasnegyedev, atadashonap, osszlakasszam, szabadlakasszam, projektingatlanok, ingtipus, elsodlegesfutes, masodlagosfutes, harmadlagosfutes, parkolotipus, parkolohasznalat, parkoloarmill,isTobbEpuletes, komfort, epuletszintek, isLift, tarolohasznalat, isAkadalymentes, isLegkondicionalt, isZoldOtthon, energetika, isNapelemes, isSzigetelt, szigetelesmeret FROM projektek;`;
        projektek.query(sql, (error, ress) => {
            if (error) {
                res.status(500).send({ err: 'Hiba történt a projektek lekérdezésekor!' });
            } else {
                let resss = ress.map((item) => {
                    return getJSONfromLongtext(item, 'toBool');
                });
                res.status(200).send(resss);
            }
        });
    }
});

export default router;
