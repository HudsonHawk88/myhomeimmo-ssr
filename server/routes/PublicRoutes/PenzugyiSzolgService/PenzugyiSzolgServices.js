import express from 'express';
const router = express.Router();
import { getJSONfromLongtext, pool } from '../../../common/QueryHelpers.js';
const penzugyiSzolg = pool;

// PENZUGYISZOLGALTATASOK START

router.get('/', (req, res) => {
    const sql = `SELECT * FROM penzugyi_szolg;`;
    penzugyiSzolg.query(sql, (err, result) => {
        if (!err) {
            let ress = getJSONfromLongtext(result[0]);
            res.status(200).send(ress);
        } else {
            res.status(500).send({ err: err });
        }
    });
});

// PENZUGYISZOLGALTATASOK END

export default router;
