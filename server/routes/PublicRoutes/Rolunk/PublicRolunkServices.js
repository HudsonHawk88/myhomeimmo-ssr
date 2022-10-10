import express from 'express';
const router = express.Router();
import { getJSONfromLongtext, pool } from '../../../common/QueryHelpers.js';
const rolunk = pool;

// ROLUNK START

router.get('/', (req, res) => {
    const sql = `SELECT * FROM rolunk;`;
    rolunk.query(sql, (err, result) => {
        if (!err) {
            let ress = result.map((item) => {
                return getJSONfromLongtext(item, 'toBool');
            });
            res.status(200).send(ress);
        } else {
            res.status(500).send({ err: err });
        }
    });
});

// ROLUNK END

export default router;
