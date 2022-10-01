import express from 'express';
const router = express.Router();
import { pool } from '../../../common/QueryHelpers.js';
const ingatlanSzolg = pool;

// INGATLANSZOLGALTATASOK START

router.get('/', (req, res) => {
    const sql = `SELECT * FROM ingatlan_szolg;`;
    ingatlanSzolg.query(sql, (err, result) => {
        if (!err) {
            let ress = result[0];
            ress.kep = JSON.parse(ress.kep);
            res.status(200).send(ress);
        } else {
            res.status(500).send({ err: err });
        }
    });
});

// INGATLANSZOLGALTATASOK END

export default router;
