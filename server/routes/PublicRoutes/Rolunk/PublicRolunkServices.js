import express from 'express';
const router = express.Router();
import { pool } from '../../../common/QueryHelpers.js';
const rolunk = pool;

// ROLUNK START

router.get('/', (req, res) => {
    const sql = `SELECT * FROM rolunk;`;
    rolunk.query(sql, (err, result) => {
        if (!err) {
            let ress = result;
            ress.forEach((item) => {
                item.kep = JSON.parse(item.kep);
            });
            res.status(200).send(ress);
        } else {
            res.status(500).send({ err: err });
        }
    });
});

// ROLUNK END

export default router;
