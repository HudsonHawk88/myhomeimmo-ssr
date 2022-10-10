import express from 'express';
import { getJSONfromLongtext, pool } from '../../../common/QueryHelpers.js';
const router = express.Router();
const ingatlanSzolg = pool;

// INGATLANSZOLGALTATASOK START

router.get('/', (req, res) => {
    const sql = `SELECT * FROM ingatlan_szolg;`;
    ingatlanSzolg.query(sql, (err, result) => {
        if (!err) {
            let ress = getJSONfromLongtext(result[0]);
            res.status(200).send(ress);
        } else {
            res.status(500).send({ err: err });
        }
    });
});

// INGATLANSZOLGALTATASOK END

export default router;
