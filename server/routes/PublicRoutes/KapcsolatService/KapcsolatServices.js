import express from 'express';
const router = express.Router();
import { getJSONfromLongtext, pool } from '../../../common/QueryHelpers.js';
const kapcsolat = pool;

// KAPCSOLAT START

router.get('/', (req, res) => {
    const sql = `SELECT * FROM kapcsolat;`;
    kapcsolat.query(sql, (err, result) => {
        if (!err) {
            let ress = result.map((item) => {
                return getJSONfromLongtext(item, 'toBool');
                /* item.kep = JSON.parse(item.kep); */
            });
            res.status(200).send(ress);
        } else {
            res.status(500).send({ err: err });
        }
    });
});

// KAPCSOLAT END

export default router;
