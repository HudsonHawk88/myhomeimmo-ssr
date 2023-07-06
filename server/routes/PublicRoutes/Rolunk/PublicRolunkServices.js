import express from 'express';
const router = express.Router();
import { getJSONfromLongtext, pool } from '../../../common/QueryHelpers.js';
const rolunk = pool;

// ROLUNK START

router.get('/', (req, res) => {
    const id = req.headers.id;
    if (id) {
        const sql = `SELECT * FROM rolunk WHERE id='${id}';`;
        rolunk.query(sql, (err, result) => {
            if (!err) {
                let ress = getJSONfromLongtext(result, 'toBool');
                res.status(200).send(ress);
            } else {
                res.status(500).send({ err: err });
            }
        });
    } else {
        const sql = `SELECT * FROM rolunk ORDER BY nev ASC;`;
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
    }
});

// ROLUNK END

export default router;
